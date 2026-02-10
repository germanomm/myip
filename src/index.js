export default {
  async fetch(request) {
    const ip = request.headers.get("CF-Connecting-IP") || "";
    return new Response(ip + "\n", {
      headers: { "Content-Type": "text/plain" }
    });
  }
};
