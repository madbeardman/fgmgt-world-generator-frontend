import type { APIRoute } from "astro";
import { buildSector } from "../../lib/buildSector.js";

export const POST: APIRoute = async ({ request }) => {
  const { sector, format } = await request.json();

  if (!sector || !format) {
    return new Response(JSON.stringify({ error: "Missing sector or format" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Return an SSE stream
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      function sendMessage(msg: string) {
        controller.enqueue(encoder.encode(`data: ${msg}\n\n`));
      }

      buildSector(sector, format, sendMessage)
        .then(() => {
          sendMessage("[DONE]");
          controller.close();
        })
        .catch((err) => {
          sendMessage(`[ERROR] ${err.message}`);
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
