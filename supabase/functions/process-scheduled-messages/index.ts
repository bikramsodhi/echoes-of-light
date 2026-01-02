import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

interface MessageRecipient {
  id: string;
  delivery_token: string;
  recipient_id: string;
  recipients: {
    name: string;
    email: string;
  } | null;
}

interface ScheduledMessage {
  id: string;
  title: string;
  content: string;
  user_id: string;
  delivery_date: string;
  profiles: {
    full_name: string;
  } | null;
  message_recipients: MessageRecipient[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing environment variables");
      return new Response(
        JSON.stringify({ success: false, error: "Server misconfigured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Use service role key for cron job (no user auth)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date().toISOString();
    console.log(`Processing scheduled messages at ${now}`);

    // Find messages that are scheduled and due
    const { data: dueMessages, error: fetchError } = await supabase
      .from("messages")
      .select(`
        id,
        title,
        content,
        user_id,
        delivery_date,
        profiles!messages_user_id_fkey(full_name),
        message_recipients(
          id,
          delivery_token,
          recipient_id,
          recipients(name, email)
        )
      `)
      .eq("status", "scheduled")
      .eq("delivery_trigger", "scheduled")
      .lte("delivery_date", now);

    if (fetchError) {
      console.error("Error fetching scheduled messages:", fetchError.message);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to fetch messages" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!dueMessages || dueMessages.length === 0) {
      console.log("No scheduled messages due for delivery");
      return new Response(
        JSON.stringify({ success: true, processed: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Found ${dueMessages.length} messages due for delivery`);

    const siteUrl = "https://echolight.live";
    const fromEmail = "EchoLight <noreply@echolight.live>";
    const supportEmail = "support@echolight.live";
    
    let successCount = 0;
    let errorCount = 0;

    for (const message of dueMessages) {
      // Handle profiles - could be array or single object from join
      const profileData = Array.isArray(message.profiles) ? message.profiles[0] : message.profiles;
      const senderName = profileData?.full_name || "Someone special";
      const safeMessageTitle = escapeHtml(message.title || "A message for you");
      const safeSenderName = escapeHtml(senderName);

      // Send to each recipient
      for (const mr of message.message_recipients) {
        // Handle recipients - could be array or single object from join
        const recipientData = Array.isArray(mr.recipients) ? mr.recipients[0] : mr.recipients;
        
        if (!recipientData?.email) {
          console.warn(`Recipient ${mr.recipient_id} has no email, skipping`);
          continue;
        }

        const recipientEmail = recipientData.email;
        const safeRecipientName = escapeHtml(recipientData.name || "Friend");
        const accessLink = `${siteUrl}/message?token=${mr.delivery_token}`;

        // Set token expiration (7 days from now)
        const tokenExpiry = new Date();
        tokenExpiry.setDate(tokenExpiry.getDate() + 7);

        try {
          // Update token expiration
          await supabase
            .from("message_recipients")
            .update({ token_expires_at: tokenExpiry.toISOString() })
            .eq("id", mr.id);

          // Send email
          const emailHtml = `
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
          `;

          await resend.emails.send({
            from: fromEmail,
            reply_to: supportEmail,
            to: [recipientEmail],
            subject: `A message from ${safeSenderName} awaits you`,
            html: emailHtml,
          });

          console.log(`Email sent to recipient for message ${message.id}`);
          successCount++;
        } catch (emailError: any) {
          console.error(`Failed to send email for message ${message.id}:`, emailError.message);
          errorCount++;
        }
      }

      // Update message status to sent
      const { error: updateError } = await supabase
        .from("messages")
        .update({ status: "sent", sent_at: now })
        .eq("id", message.id);

      if (updateError) {
        console.error(`Failed to update message ${message.id} status:`, updateError.message);
      } else {
        console.log(`Message ${message.id} marked as sent`);
      }
    }

    console.log(`Processed ${dueMessages.length} messages: ${successCount} emails sent, ${errorCount} errors`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: dueMessages.length,
        emailsSent: successCount,
        errors: errorCount
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in process-scheduled-messages:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
