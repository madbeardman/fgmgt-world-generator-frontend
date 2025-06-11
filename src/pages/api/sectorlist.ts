import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const res = await fetch("https://travellermap.com/data/sectorlist.json");
  if (!res.ok) {
    return new Response("Failed to fetch sector list", { status: res.status });
  }

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};
