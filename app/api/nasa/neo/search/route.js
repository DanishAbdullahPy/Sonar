import { getCache, setCache } from "@/utils/cache";

export async function GET(request) {
  const apiKey = process.env.NASA_API_KEY;
  const { searchParams } = new URL(request.url);

  // Get params (with fallbacks)
  const start = searchParams.get("start") || new Date().toISOString().slice(0, 10);
  const end = searchParams.get("end") || start;
  const hazardousOnly = searchParams.get("hazardous") === "true";
const cacheKey = `neo-stats:${start}:${end}`;
const cached = getCache(cacheKey);
if (cached) {
  return new Response(JSON.stringify(cached), { status: 200, headers: { "Content-Type": "application/json" } });
}
// ...[after calculating “result”]...
setCache(cacheKey, result, 15 * 60 * 1000); // 15 minutes
return new Response(JSON.stringify(result), { status: 200, headers: { "Content-Type": "application/json" } });

  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();

    // Prepare list (support multi-day if needed!)
    let objects = [];
    for (const day in data.near_earth_objects) {
      for (const neo of data.near_earth_objects[day]) {
        if (hazardousOnly && !neo.is_potentially_hazardous_asteroid) continue;
        objects.push({
          id: neo.id,
          name: neo.name,
          hazardous: neo.is_potentially_hazardous_asteroid,
          approach_date: day,
          est_diameter_km: neo.estimated_diameter.kilometers.estimated_diameter_max,
          closest_approach_km: neo.close_approach_data?.[0]?.miss_distance?.kilometers,
        });
      }
    }

    return new Response(
      JSON.stringify({
        start, end, hazardousOnly, count: objects.length, objects,
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: "NASA API failed", detail: err.message }),
      { status: 500 }
    );
  }
}
