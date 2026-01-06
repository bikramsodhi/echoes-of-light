import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiter (resets on function cold start)
// For production, consider using Redis or database-backed rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 20; // Max emails per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(userId);
  
  if (!record || now > record.resetTime) {
    // New window
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }
  
  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count };
}

// HTML escape function to prevent XSS in email templates
function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char);
}

// Mask email for logging (e.g., jo***@example.com)
function maskEmail(email: string): string {
  const atIndex = email.indexOf('@');
  if (atIndex <= 2) {
    return email.charAt(0) + '***' + email.substring(atIndex);
  }
  return email.substring(0, 2) + '***' + email.substring(atIndex);
}

// Mask UUID for logging (first 8 chars + ***)
function maskUuid(uuid: string): string {
  return uuid.substring(0, 8) + '***';
}

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface TrustedContactInviteRequest {
  type: "trusted_contact_invite";
  contactName: string;
  contactEmail: string;
  userName: string;
  inviteToken: string;
}

interface MessageDeliveryRequest {
  type: "message_delivery";
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  messageTitle: string;
  accessLink: string;
}

type EmailPayload = EmailRequest | TrustedContactInviteRequest | MessageDeliveryRequest;

// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// UUID validation
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// SECURITY: Hard caps on user-provided input to prevent resource exhaustion.
const MAX_REQUEST_BYTES = 150_000; // ~150KB
const MAX_EMAIL_LENGTH = 255;
const MAX_NAME_LENGTH = 200;
const MAX_TITLE_LENGTH = 500;
const MAX_SUBJECT_LENGTH = 300;
const MAX_URL_LENGTH = 2000;
const MAX_HTML_LENGTH = 100_000;

function isStringWithinMax(value: unknown, max: number): value is string {
  return typeof value === "string" && value.length <= max;
}

function requireStringWithinMax(
  field: string,
  value: unknown,
  max: number,
): { ok: true; value: string } | { ok: false; error: string } {
  if (typeof value !== "string") return { ok: false, error: `${field} must be a string` };
  if (value.length === 0) return { ok: false, error: `${field} is required` };
  if (value.length > max) return { ok: false, error: `${field} too long` };
  return { ok: true, value };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check - require valid user session
    const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized - no authorization header" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing backend env vars", {
        hasUrl: Boolean(supabaseUrl),
        hasAnonKey: Boolean(supabaseAnonKey),
      });
      return new Response(
        JSON.stringify({ success: false, error: "Server misconfigured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Create Supabase client with user's auth token
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user is authenticated
    const jwt = authHeader.replace(/^Bearer\s+/i, "");
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser(jwt);

    if (authError || !user) {
      console.error("Authentication failed", {
        message: authError?.message,
        name: authError?.name,
        status: (authError as any)?.status,
      });
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized - invalid session" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Authenticated user:", maskUuid(user.id));

    // Check rate limit
    const rateLimitResult = checkRateLimit(user.id);
    if (!rateLimitResult.allowed) {
      console.warn("Rate limit exceeded for user:", maskUuid(user.id));
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Rate limit exceeded. Please try again later.",
          retryAfter: "1 hour"
        }),
        {
          status: 429,
          headers: { 
            "Content-Type": "application/json", 
            "X-RateLimit-Remaining": "0",
            ...corsHeaders 
          },
        }
      );
    }

    // Reject oversized requests early (best-effort; Content-Length may be absent)
    const contentLengthHeader = req.headers.get("content-length");
    const contentLength = contentLengthHeader ? Number(contentLengthHeader) : NaN;
    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
      console.warn("Rejected oversized request", {
        user_id: maskUuid(user.id),
        content_length: contentLength,
      });
      return new Response(
        JSON.stringify({ success: false, error: "Request too large" }),
        {
          status: 413,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const payload: EmailPayload = await req.json();

    // Log only minimal non-sensitive info
    console.log("Processing email request:", {
      type: "type" in payload ? payload.type : "generic",
      hasRecipient: "to" in payload || "contactEmail" in payload || "recipientEmail" in payload
    });

    let emailConfig: { to: string; subject: string; html: string; from: string; reply_to?: string };

    const siteUrl = "https://echolight.live";
    const fromEmail = "EchoLight <noreply@echolight.live>";
    const supportEmail = "support@echolight.live";

    // Handle different email types
    if ("type" in payload && payload.type === "trusted_contact_invite") {
      const { contactName, contactEmail, userName, inviteToken } = payload;

      const contactNameCheck = requireStringWithinMax("contactName", contactName, MAX_NAME_LENGTH);
      if (!contactNameCheck.ok) {
        return new Response(JSON.stringify({ success: false, error: contactNameCheck.error }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const userNameCheck = requireStringWithinMax("userName", userName, MAX_NAME_LENGTH);
      if (!userNameCheck.ok) {
        return new Response(JSON.stringify({ success: false, error: userNameCheck.error }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const contactEmailCheck = requireStringWithinMax(
        "contactEmail",
        contactEmail,
        MAX_EMAIL_LENGTH,
      );
      if (!contactEmailCheck.ok) {
        return new Response(JSON.stringify({ success: false, error: contactEmailCheck.error }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const inviteTokenCheck = requireStringWithinMax("inviteToken", inviteToken, 64);
      if (!inviteTokenCheck.ok) {
        return new Response(JSON.stringify({ success: false, error: inviteTokenCheck.error }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // Validate email format
      if (!emailRegex.test(contactEmailCheck.value)) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid email format" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      // Validate invite token is UUID format
      if (!uuidRegex.test(inviteTokenCheck.value)) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid invite token format" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      // Verify user owns this trusted contact by checking the invite token
      // Verify user owns this trusted contact by checking the invite token
      const { data: contact, error: contactError } = await supabaseClient
        .from("trusted_contacts")
        .select("user_id")
        .eq("invite_token", inviteTokenCheck.value)
        .single();

      if (contactError || !contact) {
        console.error("Trusted contact not found");
        return new Response(
          JSON.stringify({ success: false, error: "Trusted contact not found" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      if (contact.user_id !== user.id) {
        console.error("User does not own this trusted contact");
        return new Response(
          JSON.stringify({ success: false, error: "Forbidden - you do not own this contact" }),
          {
            status: 403,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      // Escape user-controlled content to prevent XSS
      const safeContactName = escapeHtml(contactNameCheck.value);
      const safeUserName = escapeHtml(userNameCheck.value);

      // Use /verify as the canonical path
      const verifyUrl = `${siteUrl}/verify?token=${inviteTokenCheck.value}`;
      
      emailConfig = {
        from: fromEmail,
        reply_to: supportEmail,
        to: contactEmailCheck.value,
        subject: `${safeUserName} has chosen you as a trusted contact on EchoLight`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #e8e0f0 0%, #f5f0e8 100%); border-radius: 16px; padding: 40px; text-align: center;">
              <h1 style="color: #6b5b7a; margin-bottom: 24px; font-size: 28px;">You've Been Chosen</h1>
              <p style="font-size: 18px; color: #555; margin-bottom: 16px;">
                Dear ${safeContactName},
              </p>
              <p style="font-size: 16px; color: #666; margin-bottom: 24px;">
                <strong>${safeUserName}</strong> has selected you as a trusted contact on EchoLight — 
                a platform that helps people leave meaningful messages for their loved ones.
              </p>
              <p style="font-size: 16px; color: #666; margin-bottom: 32px;">
                As a trusted contact, you may be asked to help verify important information 
                when the time comes. This is a deeply personal choice, and ${safeUserName} trusts you 
                with this responsibility.
              </p>
              <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #8b7a9e 0%, #6b5b7a 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                Accept or Decline Invitation
              </a>
              <p style="font-size: 14px; color: #888; margin-top: 32px;">
                If you have questions, please reach out to ${safeUserName} directly or contact us at <a href="mailto:${supportEmail}" style="color: #6b5b7a;">${supportEmail}</a>.
              </p>
            </div>
            <p style="text-align: center; font-size: 12px; color: #999; margin-top: 24px;">
              This email was sent by EchoLight on behalf of ${safeUserName}.
            </p>
          </body>
          </html>
        `,
      };
    } else if ("type" in payload && payload.type === "message_delivery") {
      const { recipientName, recipientEmail, senderName, messageTitle, accessLink } = payload;

      const recipientNameCheck = requireStringWithinMax("recipientName", recipientName, MAX_NAME_LENGTH);
      if (!recipientNameCheck.ok) {
        return new Response(JSON.stringify({ success: false, error: recipientNameCheck.error }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const senderNameCheck = requireStringWithinMax("senderName", senderName, MAX_NAME_LENGTH);
      if (!senderNameCheck.ok) {
        return new Response(JSON.stringify({ success: false, error: senderNameCheck.error }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const messageTitleCheck = requireStringWithinMax("messageTitle", messageTitle, MAX_TITLE_LENGTH);
      if (!messageTitleCheck.ok) {
        return new Response(JSON.stringify({ success: false, error: messageTitleCheck.error }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const accessLinkCheck = requireStringWithinMax("accessLink", accessLink, MAX_URL_LENGTH);
      if (!accessLinkCheck.ok) {
        return new Response(JSON.stringify({ success: false, error: accessLinkCheck.error }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const recipientEmailCheck = requireStringWithinMax(
        "recipientEmail",
        recipientEmail,
        MAX_EMAIL_LENGTH,
      );
      if (!recipientEmailCheck.ok) {
        return new Response(JSON.stringify({ success: false, error: recipientEmailCheck.error }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // Validate email format
      if (!emailRegex.test(recipientEmailCheck.value)) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid email format" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
      
      // For message delivery, verify user has a message with this title
      // For message delivery, verify user has a message with this title
      // This is a basic check - in production you might want stricter validation
      const { data: message, error: messageError } = await supabaseClient
        .from("messages")
        .select("user_id")
        .eq("user_id", user.id)
        .eq("title", messageTitleCheck.value)
        .limit(1)
        .single();

      if (messageError || !message) {
        console.error("Message not found or not owned by user");
        return new Response(
          JSON.stringify({ success: false, error: "Message not found or unauthorized" }),
          {
            status: 403,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      // Escape user-controlled content to prevent XSS
      const safeRecipientName = escapeHtml(recipientNameCheck.value);
      const safeSenderName = escapeHtml(senderNameCheck.value);
      const safeMessageTitle = escapeHtml(messageTitleCheck.value);

      emailConfig = {
        from: fromEmail,
        reply_to: supportEmail,
        to: recipientEmailCheck.value,
        subject: `A message from ${safeSenderName} awaits you`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #e8e0f0 0%, #f5f0e8 100%); border-radius: 16px; padding: 40px; text-align: center;">
              <h1 style="color: #6b5b7a; margin-bottom: 24px; font-size: 28px;">A Message Awaits</h1>
              <p style="font-size: 18px; color: #555; margin-bottom: 16px;">
                Dear ${safeRecipientName},
              </p>
              <p style="font-size: 16px; color: #666; margin-bottom: 24px;">
                <strong>${safeSenderName}</strong> left you a heartfelt message titled 
                "<em>${safeMessageTitle}</em>" that is now ready for you to receive.
              </p>
              <p style="font-size: 16px; color: #666; margin-bottom: 32px;">
                They wanted you to know that even when they couldn't be there in person, 
                their words and love would find their way to you.
              </p>
              <a href="${accessLink}" style="display: inline-block; background: linear-gradient(135deg, #d4a574 0%, #c49a6c 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                View Your Message
              </a>
              <p style="font-size: 14px; color: #888; margin-top: 32px;">
                Take your time. This message will wait for you.
              </p>
              <p style="font-size: 14px; color: #888; margin-top: 16px;">
                Questions? Contact us at <a href="mailto:${supportEmail}" style="color: #6b5b7a;">${supportEmail}</a>
              </p>
            </div>
            <p style="text-align: center; font-size: 12px; color: #999; margin-top: 24px;">
              Delivered with care by EchoLight.
            </p>
          </body>
          </html>
        `,
      };
    } else {
      // Generic email - only allow authenticated users
      const { to, subject, html, from } = payload as EmailRequest;

      if (!isStringWithinMax(to, MAX_EMAIL_LENGTH)) {
        return new Response(JSON.stringify({ success: false, error: "to too long" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      if (!isStringWithinMax(subject, MAX_SUBJECT_LENGTH)) {
        return new Response(JSON.stringify({ success: false, error: "subject too long" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      if (!isStringWithinMax(html, MAX_HTML_LENGTH)) {
        return new Response(JSON.stringify({ success: false, error: "html too long" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      if (from && !isStringWithinMax(from, MAX_SUBJECT_LENGTH)) {
        return new Response(JSON.stringify({ success: false, error: "from too long" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // Validate email format
      if (!emailRegex.test(to)) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid email format" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      emailConfig = {
        from: from || fromEmail,
        reply_to: supportEmail,
        to,
        subject,
        html,
      };
    }

    // Log with masked sensitive data
    console.log(JSON.stringify({
      event: 'email_sending',
      user_id: maskUuid(user.id),
      email_type: "type" in payload ? payload.type : "generic",
      recipient_masked: maskEmail(emailConfig.to),
      rate_limit_remaining: rateLimitResult.remaining,
      timestamp: new Date().toISOString()
    }));
    
    const emailResponse = await resend.emails.send({
      from: emailConfig.from,
      reply_to: emailConfig.reply_to,
      to: [emailConfig.to],
      subject: emailConfig.subject,
      html: emailConfig.html,
    });

    console.log("Email sent successfully");

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to send email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);