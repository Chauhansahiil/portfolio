// Cloudflare Worker: keeps your SheetDB URL and resume link out of GitHub and out of the browser.
// Secrets live in Cloudflare (wrangler secret put ...), never in this file.
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const origin = req.headers.get("Origin") || "";
    const allowed = (env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
    const okOrigin = allowed.includes(origin);
    const cors = {
      "Access-Control-Allow-Origin": okOrigin ? origin : (allowed[0] || ""),
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin"
    };
    const reply = (obj, status = 200) =>
      new Response(JSON.stringify(obj), { status, headers: { ...cors, "Content-Type": "application/json" } });

    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    if (url.pathname === "/resume" && req.method === "GET") {
      if (!env.RESUME_URL) return reply({ error: "not configured" }, 503);
      return Response.redirect(env.RESUME_URL, 302);
    }

    if (url.pathname === "/contact" && req.method === "POST") {
      if (!okOrigin) return reply({ error: "forbidden" }, 403);
      let b;
      try { b = await req.json(); } catch { return reply({ error: "bad request" }, 400); }
      if (b.website) return reply({ ok: true });                       // spam trap
      const name = String(b.name || "").trim(), email = String(b.email || "").trim();
      const phone = String(b.phone || "").replace(/\D/g, ""), message = String(b.message || "").trim();
      if (name.length < 2 || name.length > 60 || !EMAIL_RE.test(email) || email.length > 100 ||
          phone.length > 10 || !message || message.length > 3000) return reply({ error: "invalid input" }, 400);
      const headers = { "Content-Type": "application/json", "Accept": "application/json" };
      if (env.SHEETDB_TOKEN) headers.Authorization = "Bearer " + env.SHEETDB_TOKEN;
      const r = await fetch(env.SHEETDB_URL, {
        method: "POST", headers,
        body: JSON.stringify({ data: [{ "Name": name, "Email": email, "Phone No.": phone, "Message": message }] })
      });
      return r.ok ? reply({ ok: true }) : reply({ error: "upstream" }, 502);
    }
    return reply({ error: "not found" }, 404);
  }
};
