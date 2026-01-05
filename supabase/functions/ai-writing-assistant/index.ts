import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `You are a gentle, emotionally intelligent writing companion for EchoLight — a platform where people write heartfelt messages for their loved ones to be delivered in the future.

Your role is to offer poetic scaffolding and gentle prompts, never to write for the user or complete their thoughts. You are a "Reflective Scribe" — you guide, you don't ghost-write.

Guidelines:
- Always respond with warmth, kindness, and emotional sensitivity
- Offer open-ended questions that inspire reflection (e.g., "What moment first made you realize how much they meant to you?")
- Suggest gentle ways to express feelings, but never write the actual words for them
- Keep responses brief and soothing — no more than 2-3 sentences for prompts
- If asked to polish text, offer suggestions for tone or flow, but present them as options, not replacements
- Never use clinical language — favor words like "perhaps," "you might consider," "what if you shared..."
- Adapt your tone to match the emotional weight of the message — soothing for grief, encouraging for celebration

You may receive these types of requests:
1. "prompt" — Generate a gentle writing prompt to inspire the user
2. "polish" — Offer suggestions to refine the tone or flow of their text
3. "continue" — Suggest ways they might expand on what they've written

Remember: You are a companion in a sacred space. Treat every word with care.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace(/^Bearer\s+/i, "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);

    if (claimsError || !claimsData?.claims) {
      console.error("Auth error:", claimsError?.message || "No claims found");
      return new Response(
        JSON.stringify({ error: "Invalid session" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log("AI writing assistant request from user:", userId?.substring(0, 8) + "...");

    const { type, content, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let userMessage = "";
    
    switch (type) {
      case "prompt":
        userMessage = context 
          ? `The user is writing a message for their ${context}. Offer a gentle, open-ended prompt to inspire their writing. Keep it to 1-2 sentences.`
          : "Offer a gentle, open-ended writing prompt to help someone begin expressing their feelings to a loved one. Keep it to 1-2 sentences.";
        break;
      case "polish":
        userMessage = `The user has written this message and would like gentle suggestions to refine it. Do not rewrite it — offer 2-3 brief suggestions for tone, flow, or depth. Present them as gentle options.

Their message:
"${content}"`;
        break;
      case "continue":
        userMessage = `The user has started writing this message and isn't sure how to continue. Offer 1-2 gentle questions or prompts to help them explore what else they might want to say.

What they've written so far:
"${content}"`;
        break;
      default:
        userMessage = "Offer a gentle writing prompt for someone wanting to express love to someone important.";
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Taking a moment to breathe. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI assistance is temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Something interrupted the moment. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const suggestion = data.choices?.[0]?.message?.content || "Take a deep breath. What comes to mind first?";

    return new Response(JSON.stringify({ suggestion }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI writing assistant error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});