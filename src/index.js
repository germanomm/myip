export default {
  async fetch(request) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    
    // Define the only allowed origin for security
    const allowedOrigin = "https://info.gmm.tec.br";
    const origin = request.headers.get("Origin");

    // Extract the client IP from Cloudflare's specific header
    const ip = request.headers.get("CF-Connecting-IP") || "";

    // Determine if the IP is IPv6 by checking for the presence of a colon
    const isIPv6 = ip.includes(":");
    
    // Prepare headers with basic content type
    const headers = { 
      "Content-Type": "text/plain",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    };

    // Apply CORS headers only if the request comes from your dashboard
    if (origin === allowedOrigin) {
      headers["Access-Control-Allow-Origin"] = allowedOrigin;
      headers["Access-Control-Allow-Methods"] = "GET, OPTIONS";
      headers["Access-Control-Allow-Headers"] = "Content-Type";
    }

    // Handle Browser Preflight requests (CORS check)
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    // Logic for myip6 specific hostname
    if (hostname.startsWith("myip6")) {
      if (isIPv6) {
        return new Response(ip + "\n", { status: 200, headers });
      }
      // Return 404 if an IPv4 client attempts to access the IPv6-only hostname
      return new Response("Error: IPv6 address not detected.\n", { status: 404, headers });
    }

    // Default Rule: Return the IP for any other hostname (like myip4)
    return new Response(ip + "\n", { status: 200, headers });
  }
};
