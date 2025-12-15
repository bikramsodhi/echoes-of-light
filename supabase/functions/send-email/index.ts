import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: EmailPayload = await req.json();
    console.log("Processing email request:", JSON.stringify(payload, null, 2));

    let emailConfig: { to: string; subject: string; html: string; from: string; reply_to: string };

    const siteUrl = "https://echolight.live";
    const fromEmail = "EchoLight <bsodhi424@gmail.com>";

    // Handle different email types
    if ("type" in payload && payload.type === "trusted_contact_invite") {
      const { contactName, contactEmail, userName, inviteToken } = payload;
      const verifyUrl = `${siteUrl}/verify-contact?token=${inviteToken}`;
      
      emailConfig = {
        from: fromEmail,
        reply_to: "bsodhi424@gmail.com",
        to: contactEmail,
        subject: `${userName} has chosen you as a trusted contact on EchoLight`,
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
                Dear ${contactName},
              </p>
              <p style="font-size: 16px; color: #666; margin-bottom: 24px;">
                <strong>${userName}</strong> has selected you as a trusted contact on EchoLight — 
                a platform that helps people leave meaningful messages for their loved ones.
              </p>
              <p style="font-size: 16px; color: #666; margin-bottom: 32px;">
                As a trusted contact, you may be asked to help verify important information 
                when the time comes. This is a deeply personal choice, and ${userName} trusts you 
                with this responsibility.
              </p>
              <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #8b7a9e 0%, #6b5b7a 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                Accept or Decline Invitation
              </a>
              <p style="font-size: 14px; color: #888; margin-top: 32px;">
                If you have questions, please reach out to ${userName} directly.
              </p>
            </div>
            <p style="text-align: center; font-size: 12px; color: #999; margin-top: 24px;">
              This email was sent by EchoLight on behalf of ${userName}.
            </p>
          </body>
          </html>
        `,
      };
    } else if ("type" in payload && payload.type === "message_delivery") {
      const { recipientName, recipientEmail, senderName, messageTitle, accessLink } = payload;
      
      emailConfig = {
        from: fromEmail,
        reply_to: "bsodhi424@gmail.com",
        to: recipientEmail,
        subject: `A message from ${senderName} awaits you`,
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
                Dear ${recipientName},
              </p>
              <p style="font-size: 16px; color: #666; margin-bottom: 24px;">
                <strong>${senderName}</strong> left you a heartfelt message titled 
                "<em>${messageTitle}</em>" that is now ready for you to receive.
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
            </div>
            <p style="text-align: center; font-size: 12px; color: #999; margin-top: 24px;">
              Delivered with care by EchoLight.
            </p>
          </body>
          </html>
        `,
      };
    } else {
      // Generic email
      const { to, subject, html, from } = payload as EmailRequest;
      emailConfig = {
        from: from || fromEmail,
        reply_to: "bsodhi424@gmail.com",
        to,
        subject,
        html,
      };
    }

    console.log("Sending email to:", emailConfig.to);
    
    const emailResponse = await resend.emails.send({
      from: emailConfig.from,
      reply_to: emailConfig.reply_to,
      to: [emailConfig.to],
      subject: emailConfig.subject,
      html: emailConfig.html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
