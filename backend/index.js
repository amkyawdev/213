/**
 * Burme AI - Cloudflare Worker API (v2)
 */

const AI_PROVIDERS = {
  nvidia: {
    url: "https://integrate.api.nvidia.ai/v1/chat/completions",
    model: "nvidia/llama-3.1-nemorus-70b-instruct"
  },
  cerebras: {
    url: "https://api.cerebras.cloud/v1/chat/completions",
    model: "llama-3.3-70b"
  }
};

// Helper: Get AI Response
async function getAIResponse(apiKey, provider, messages) {
  const config = AI_PROVIDERS[provider];
  
  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      messages: messages,
      stream: false,
      max_tokens: 2048
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response";
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Chat: /v1/chat
      if (path === "/v1/chat" && request.method === "POST") {
        const { message } = await request.json().catch(() => ({}));
        
        if (!message) {
          return new Response(JSON.stringify({ error: "Message required" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }

        const apiKey = env.NVIDIA_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "API key not configured" }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }

        const response = await getAIResponse(apiKey, "nvidia", [
          { role: "system", content: "You are Burme AI, a helpful AI assistant. Respond in the same language as the user." },
          { role: "user", content: message }
        ]);
        
        return new Response(JSON.stringify({ 
          response: response,
          provider: "nvidia"
        }), {
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }

      // Health: /health
      if (path === "/health") {
        return new Response(JSON.stringify({ 
          status: "ok", 
          provider: env.NVIDIA_API_KEY ? "nvidia" : "not configured"
        }), {
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }

      return new Response(JSON.stringify({ error: "Not found", path }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
  }
};
