/**
 * Worker for myip.gmm.tec.br, myip4, and myip6
 * Optimized for myinfo.gmm.tec.br dashboard
 */

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    
    // The Dashboard URL that is allowed to read this data
    const allowedOrigin = "https://myinfo.gmm.tec.br";
    const origin = request.headers.get("Origin");

    // Extract the client IP from Cloudflare
    const ip = request.headers.get("CF-Connecting-IP") || "";
    const isIPv6 = ip.includes(":");
    
    // Standard response headers
    const headers = { 
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    };

    // CORS Logic: Only allow the specific dashboard to bypass browser security
    if (origin === allowedOrigin) {
      headers["Access-Control-Allow-Origin"] = allowedOrigin;
      headers["Access-Control-Allow-Methods"] = "GET, OPTIONS";
      headers["Access-Control-Allow-Headers"] = "Content-Type";
      headers["Access-Control-Max-Age"] = "86400"; 
    } else if (!origin) {
      // Allow direct browser access (curl, typing URL in bar) without blocking
      headers["Access-Control-Allow-Origin"] = "*";
    }

    // Handle Browser Preflight (OPTIONS) - Critical to avoid 403/ERR_CORS
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    // IPv6 Enforcement for myip6 hostname
    if (hostname.startsWith("myip6")) {
      if (isIPv6) {
        return new Response(ip + "\n", { status: 200, headers });
      }
      return new Response("IPv6 address not detected.\n", { status: 400, headers });
    }

    // Default response for myip / myip4
    return new Response(ip + "\n", { status: 200, headers });
  }
};
