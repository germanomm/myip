export default {
  async fetch(request) {
    // Parse the request URL to identify the hostname
    const url = new URL(request.url);
    const hostname = url.hostname;

    // Extract the client IP from Cloudflare's specific header
    const ip = request.headers.get("CF-Connecting-IP") || "";

    // Determine if the IP is IPv6 by checking for the presence of a colon
    const isIPv6 = ip.includes(":");
    
    // Define standard plain text headers for the response
    const headers = { "Content-Type": "text/plain" };

    // Strict Rule: If the hostname starts with 'myip6', it MUST be IPv6
    if (hostname.startsWith("myip6")) {
      if (isIPv6) {
        return new Response(ip + "\n", { status: 200, headers });
      }
      // Return 404 error if an IPv4 client attempts to access the IPv6-only hostname
      return new Response("Error: IPv6 address not detected.\n", { status: 404, headers });
    }

    // Default Rule: For any other hostname, return the IP regardless of the protocol (v4 or v6)
    return new Response(ip + "\n", { status: 200, headers });
  }
};
