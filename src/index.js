/**
 * Updated myip Worker (v4/v6)
 * Fixed 403 issues and optimized CORS for info.gmm.tec.br
 */

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    
    // Define the only allowed origin for your dashboard
    const allowedOrigin = "https://info.gmm.tec.br";
    const origin = request.headers.get("Origin");

    // Extract the client IP
    const ip = request.headers.get("CF-Connecting-IP") || "";
    const isIPv6 = ip.includes(":");
    
    // Prepare base headers
    const headers = { 
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    };

    // CORS logic: Only attach headers if the Origin matches or if it's a preflight request
    if (origin === allowedOrigin) {
      headers["Access-Control-Allow-Origin"] = allowedOrigin;
      headers["Access-Control-Allow-Methods"] = "GET, OPTIONS";
      headers["Access-Control-Allow-Headers"] = "Content-Type";
      headers["Access-Control-Max-Age"] = "86400"; // Cache preflight for 24h
    } else if (origin) {
      // If there's an origin but it's NOT yours, we don't send CORS headers (Browser will block)
    } else {
      // Direct browser access (no Origin header) - Allow it to avoid 403
      headers["Access-Control-Allow-Origin"] = "*";
    }

    // Handle Browser Preflight (OPTIONS)
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    // Specific logic for IPv6 enforcement
    if (hostname.startsWith("myip6")) {
      if (isIPv6) {
        return new Response(ip + "\n", { status: 200, headers });
      }
      // Return 404 (Not Found) or 400 (Bad Request) instead of 403
      return new Response("Error: IPv6 address not detected via this hostname.\n", { status: 400, headers });
    }

    // Default response for myip4 or other hostnames
    return new Response(ip + "\n", { status: 200, headers });
  }
};
