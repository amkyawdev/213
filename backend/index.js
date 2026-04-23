/**
 * Burme AI - Cloudflare Worker API
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

const JWT_SECRET = "burme-ai-secret-key";

// Helper: Verify JWT
function verifyJWT(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
}

// Helper: Get AI Response (Non-Streaming)
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
      stream: false
    })
  });

  return response;
}

// Handle Stream
async function handleStream(response, writer) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split("\n").filter(line => line.trim() && line.startsWith("data: "));
    
    for (const line of lines) {
      const data = JSON.parse(line.slice(5));
      if (data.choices?.[0]?.delta?.content) {
        writer.write(data.choices[0].delta.content);
      }
    }
  }
}

// Main API Handler
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
      // Auth: /api/auth/login
      if (path === "/api/auth/login" && request.method === "POST") {
        const { email, password } = await request.json();
        
        // Simple auth (replace with Firebase in production)
        if (!email || !password) {
          return new Response(JSON.stringify({ error: "Invalid credentials" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }

        // Generate JWT
        const payload = { email, exp: Math.floor(Date.now() / 1000) + 86400 };
        const token = btoa(JSON.stringify(payload)) + "." + btoa(JWT_SECRET) + ".sig";
        
        return new Response(JSON.stringify({ access_token: token, user: { email } }), {
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }

      // Chat Stream: /api/chat/stream
      if (path === "/api/chat/stream" && request.method === "POST") {
        const auth = request.headers.get("Authorization");
        if (!auth) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }

        const { message } = await request.json();
        if (!message) {
          return new Response(JSON.stringify({ error: "Message required" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }

        const apiKey = env.NVIDIA_API_KEY || env.CEREBRAS_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "API key not configured" }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }

        const provider = env.NVIDIA_API_KEY ? "nvidia" : "cerebras";
        const response = await getAIResponse(apiKey, provider, [
          { role: "system", content: "You are Burme AI, a helpful assistant." },
          { role: "user", content: message }
        ]);

        if (!response.ok) {
          const error = await response.text();
          return new Response(JSON.stringify({ error }), {
            status: response.status,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }

        // Stream response
        const body = new ReadableStream({
          async start(controller) {
            const writer = controller.getWriter();
            await handleStream(response, writer);
            writer.close();
          }
        });

        return new Response(body, {
          headers: {
            "Content-Type": "text/event-stream",
            ...corsHeaders
          }
        });
      }

      // Chat: /api/chat (Non-Streaming)
      if (path === "/api/chat" && request.method === "POST") {
        const { message } = await request.json().catch(() => ({}));
        
        if (!message) {
          return new Response(JSON.stringify({ error: "Message required" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }

        const apiKey = env.NVIDIA_API_KEY || env.CEREBRAS_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "API key not configured" }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }

        const provider = env.NVIDIA_API_KEY ? "nvidia" : "cerebras";
        const response = await getAIResponse(apiKey, provider, [
          { role: "system", content: "You are Burme AI, a helpful assistant." },
          { role: "user", content: message }
        ]);

        if (!response.ok) {
          const error = await response.text();
          return new Response(JSON.stringify({ error }), {
            status: response.status,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "No response";
        
        return new Response(JSON.stringify({ response: content, provider }), {
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }

      // Health check
      if (path === "/api/health") {
        return new Response(JSON.stringify({ status: "ok", provider: "nvidia" }), {
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }

      return new Response(JSON.stringify({ error: "Not found" }), {
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