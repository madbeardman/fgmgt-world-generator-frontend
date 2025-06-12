import type { APIRoute } from "astro";
import { buildSector } from "../../lib/buildSector.js";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const sector = url.searchParams.get("sector")?.trim();
  const format = url.searchParams.get("format")?.trim();

  if (!sector || !format) {
    console.warn("❌ Missing query parameters:", { sector, format });
    return new Response("Missing query parameters", { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (msg: string) => {
        controller.enqueue(encoder.encode(`data: ${msg}\n\n`));
      };

      const keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(":\n\n")); // SSE comment (safe ping)
      }, 15000); // every 15s

      buildSector(sector, format, send)
        .then(() => {
          clearInterval(keepAlive);
          send("[DONE]");
          controller.close();
        })
        .catch((err) => {
          clearInterval(keepAlive);
          console.error("❌ Build failed:", err);
          send(`[ERROR] ${err.message}`);
          controller.close();
        });
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};
