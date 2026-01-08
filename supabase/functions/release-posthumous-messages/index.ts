import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

interface CadenceSetting {
  recipient_id: string;
  cadence: string;
  message_order: string[] | null;
}

interface MessageToDeliver {
  id: string;
  title: string;
  content: string;
  user_id: string;
  message_recipients: {
    id: string;
    delivery_token: string;
    recipient_id: string;
    recipients: {
      name: string;
      email: string;
    }[] | { name: string; email: string } | null;
  }[];
}

// Parse cadence string like "2_per_week" into components (simplified - order now stored separately)
function parseCadence(cadence: string): { 
  quantity: number; 
  period: "week" | "month";
} | null {
  if (cadence === "all_at_once") return null;
  
  // Legacy format support
  if (cadence === "weekly") return { quantity: 1, period: "week" };
  if (cadence === "monthly") return { quantity: 1, period: "month" };
  
  // Parse new format (strip any legacy order suffix)
  const cadencePart = cadence.split(":")[0];
  const match = cadencePart.match(/^(\d+)_per_(week|month)$/);
  
  if (match) {
    return { 
      quantity: parseInt(match[1], 10), 
      period: match[2] as "week" | "month"
    };
  }
  
  return null;
}

// Calculate delivery date for a message based on its position in the cadence
function calculateDeliveryDate(
  index: number, 
  cadence: { quantity: number; period: "week" | "month" },
  baseDate: Date
): Date {
  const batchNumber = Math.floor(index / cadence.quantity);
  const deliveryDate = new Date(baseDate);
  
  if (cadence.period === "week") {
    deliveryDate.setDate(deliveryDate.getDate() + batchNumber * 7);
  } else {
    deliveryDate.setMonth(deliveryDate.getMonth() + batchNumber);
  }
  
  return deliveryDate;
}

interface MessageWithMeta extends MessageToDeliver {
  created_at: string;
}

// Sort messages based on custom order or default to created_at
function sortMessagesByOrder(messages: MessageWithMeta[], customOrder: string[] | null): MessageWithMeta[] {
  if (customOrder?.length) {
    const orderMap = new Map(customOrder.map((id, index) => [id, index]));
    return [...messages].sort((a, b) => {
      const aIndex = orderMap.get(a.id) ?? Number.MAX_VALUE;
      const bIndex = orderMap.get(b.id) ?? Number.MAX_VALUE;
      return aIndex - bIndex;
    });
  }
  // Default: sort by created_at ascending
  return [...messages].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      console.error("Missing environment variables");
      return new Response(
        JSON.stringify({ success: false, error: "Server misconfigured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // SECURITY: Require authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify the caller's session
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error("Authentication failed:", userError?.message);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid session" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const callerUserId = user.id;

    // SECURITY: Verify caller has admin role
    const { data: roleData } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", callerUserId)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      console.warn(`Unauthorized access attempt by user: ${callerUserId.substring(0, 8)}***`);
      return new Response(
        JSON.stringify({ success: false, error: "Forbidden - admin required" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Parse request body
    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: "userId is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // SECURITY: Audit logging
    console.log(JSON.stringify({
      event: "posthumous_message_release",
      admin_user_id: callerUserId.substring(0, 8) + "***",
      target_user_id: userId.substring(0, 8) + "***",
      timestamp: new Date().toISOString()
    }));

    console.log(`Processing posthumous message release for user: ${userId.substring(0, 8)}***`);

    // Use service role for the actual operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get sender profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .single();
    
    const senderName = profile?.full_name || "Someone special";

    // Fetch all posthumous messages for this user that haven't been sent
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select(`
        id,
        title,
        content,
        user_id,
        created_at,
        message_recipients(
          id,
          delivery_token,
          recipient_id,
          recipients(name, email)
        )
      `)
      .eq("user_id", userId)
      .eq("delivery_trigger", "posthumous")
      .neq("status", "sent");

    if (messagesError) {
      console.error("Error fetching messages:", messagesError.message);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to fetch messages" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!messages || messages.length === 0) {
      console.log("No posthumous messages found");
      return new Response(
        JSON.stringify({ success: true, processed: 0, message: "No messages to release" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Found ${messages.length} posthumous messages to process`);

    // Fetch cadence settings for all recipients
    const { data: cadenceSettings, error: cadenceError } = await supabase
      .from("recipient_delivery_cadence")
      .select("recipient_id, cadence, message_order")
      .eq("user_id", userId);

    if (cadenceError) {
      console.error("Error fetching cadence settings:", cadenceError.message);
    }

    const cadenceMap = new Map<string, { cadence: string; messageOrder: string[] | null }>();
    (cadenceSettings || []).forEach((cs: any) => {
      cadenceMap.set(cs.recipient_id, { 
        cadence: cs.cadence, 
        messageOrder: cs.message_order 
      });
    });

    // Group messages by recipient
    const messagesByRecipient = new Map<string, MessageWithMeta[]>();
    
    for (const message of messages) {
      for (const mr of message.message_recipients) {
        const recipientId = mr.recipient_id;
        if (!messagesByRecipient.has(recipientId)) {
          messagesByRecipient.set(recipientId, []);
        }
        messagesByRecipient.get(recipientId)!.push(message as MessageWithMeta);
      }
    }

    const siteUrl = "https://echolight.live";
    const fromEmail = "EchoLight <noreply@echolight.live>";
    const supportEmail = "support@echolight.live";
    const now = new Date();
    
    let immediateCount = 0;
    let scheduledCount = 0;
    let errorCount = 0;
    const processedMessageIds = new Set<string>();

    // Process each recipient's messages according to their cadence
    for (const [recipientId, recipientMessages] of messagesByRecipient) {
      const cadenceData = cadenceMap.get(recipientId) || { cadence: "all_at_once", messageOrder: null };
      const parsedCadence = parseCadence(cadenceData.cadence);
      
      console.log(`Processing ${recipientMessages.length} messages for recipient ${recipientId.substring(0, 8)}*** with cadence: ${cadenceData.cadence}`);

      // Sort messages based on custom order or default to created_at
      const sortedMessages = sortMessagesByOrder(recipientMessages, cadenceData.messageOrder);

      for (let i = 0; i < sortedMessages.length; i++) {
        const message = sortedMessages[i];
        const mr = message.message_recipients.find(m => m.recipient_id === recipientId);
        
        if (!mr) continue;
        
        const recipientData = Array.isArray(mr.recipients) ? mr.recipients[0] : mr.recipients;
        if (!recipientData?.email) {
          console.warn(`Recipient ${recipientId} has no email, skipping`);
          continue;
        }

        // Determine if this message should be sent now or scheduled
        let shouldSendNow = true;
        let scheduledDate: Date | null = null;

        if (parsedCadence) {
          scheduledDate = calculateDeliveryDate(i, parsedCadence, now);
          // If scheduled for today (within same day), send now
          const today = new Date(now);
          today.setHours(0, 0, 0, 0);
          const scheduleDay = new Date(scheduledDate);
          scheduleDay.setHours(0, 0, 0, 0);
          
          shouldSendNow = scheduleDay.getTime() <= today.getTime();
        }

        if (shouldSendNow) {
          // Send immediately
          try {
            const safeRecipientName = escapeHtml(recipientData.name || "Friend");
            const safeSenderName = escapeHtml(senderName);
            const safeMessageTitle = escapeHtml(message.title || "A message for you");
            const accessLink = `${siteUrl}/message?token=${mr.delivery_token}`;

            // Set token expiration (7 days)
            const tokenExpiry = new Date();
            tokenExpiry.setDate(tokenExpiry.getDate() + 7);

            await supabase
              .from("message_recipients")
              .update({ token_expires_at: tokenExpiry.toISOString() })
              .eq("id", mr.id);

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
              to: [recipientData.email],
              subject: `A message from ${safeSenderName} awaits you`,
              html: emailHtml,
            });

            // Mark as sent
            await supabase
              .from("messages")
              .update({ status: "sent", sent_at: now.toISOString() })
              .eq("id", message.id);

            processedMessageIds.add(message.id);
            immediateCount++;
            console.log(`Sent message ${message.id.substring(0, 8)}*** immediately`);
          } catch (emailError: any) {
            console.error(`Failed to send message ${message.id}:`, emailError.message);
            errorCount++;
          }
        } else if (scheduledDate) {
          // Schedule for future delivery
          try {
            // Convert to scheduled delivery
            await supabase
              .from("messages")
              .update({ 
                status: "scheduled",
                delivery_trigger: "scheduled",
                delivery_date: scheduledDate.toISOString()
              })
              .eq("id", message.id);

            processedMessageIds.add(message.id);
            scheduledCount++;
            console.log(`Scheduled message ${message.id.substring(0, 8)}*** for ${scheduledDate.toISOString()}`);
          } catch (scheduleError: any) {
            console.error(`Failed to schedule message ${message.id}:`, scheduleError.message);
            errorCount++;
          }
        }
      }
    }

    console.log(`Release complete: ${immediateCount} sent immediately, ${scheduledCount} scheduled for later, ${errorCount} errors`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        immediate: immediateCount,
        scheduled: scheduledCount,
        errors: errorCount,
        totalProcessed: processedMessageIds.size
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in release-posthumous-messages:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
