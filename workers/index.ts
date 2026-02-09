/**
 * Somatic Canticles Worker
 * 
 * Main Cloudflare Worker entry point for API routes and R2 integration
 */

export interface Env {
  // R2 Buckets
  R2_AUDIO: R2Bucket;
  R2_IMAGES: R2Bucket;
  
  // Environment
  ENVIRONMENT: string;
  
  // Secrets (configured via wrangler secret put)
  DATABASE_URL: string;
  JWT_SECRET: string;
  AUTH_SECRET: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // API Routes
    if (url.pathname.startsWith("/api/")) {
      // TODO: Implement API routes
      return new Response("API routes not implemented yet", { 
        status: 501,
        headers: corsHeaders,
      });
    }

    // R2 Audio serving (with signed URLs)
    if (url.pathname.startsWith("/audio/")) {
      const key = url.pathname.replace("/audio/", "");
      
      try {
        const object = await env.R2_AUDIO.get(key);
        
        if (!object) {
          return new Response("Audio not found", { 
            status: 404,
            headers: corsHeaders,
          });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("etag", object.httpEtag);
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Content-Type", "audio/mpeg");
        headers.set("Accept-Ranges", "bytes");
        
        return new Response(object.body, { headers });
      } catch (error) {
        return new Response("Error fetching audio", { 
          status: 500,
          headers: corsHeaders,
        });
      }
    }

    // Default response
    return new Response("Somatic Canticles API", { 
      status: 200,
      headers: corsHeaders,
    });
  },
};
