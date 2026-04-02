export interface Env {
  API_KEY: string;
  WEBHOOK_URL: string;
  CACHE: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const key = url.pathname.slice(1);

    if (request.method === "GET" && key) {
      const cached = await env.CACHE.get(key);
      if (cached) {
        return new Response(cached, {
          headers: { "Content-Type": "application/json", "X-Cache": "HIT" },
        });
      }
      return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
    }

    return new Response("edge-kv-cache is running");
  },
};
