import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Proxy für den Make.com Webhook.
 * Verhindert CORS-Probleme, indem der Aufruf vom Vercel-Server statt vom Browser kommt.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Nur POST-Requests erlauben
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Webhook URL (Fallback ist hardcoded, besser wäre eine Environment Variable in Vercel)
  const webhookUrl =
    process.env.MAKE_WEBHOOK_URL ||
    "https://hook.eu1.make.com/tst5fhjqrw7a95gkedjyh3737ld4ud2m";

  if (!webhookUrl) {
    return res
      .status(500)
      .json({ error: "Configuration error: MAKE_WEBHOOK_URL is not set" });
  }

  try {
    // Anfrage an Make.com weiterleiten
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body ?? {}),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Make.com webhook error:", text);
      return res
        .status(response.status)
        .json({ error: `Make.com error: ${text}` });
    }

    // Erfolg!
    return res
      .status(200)
      .json({ status: "ok", message: "Survey triggered successfully" });
  } catch (error: any) {
    console.error("Proxy error:", error);
    return res
      .status(500)
      .json({ error: error?.message || "Unknown proxy error" });
  }
}
