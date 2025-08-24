
import { getCache, setCache } from "@/utils/cache";

export async function GET(request) {
  const apiKey = process.env.NASA_API_KEY;
  const { searchParams } = new URL(request.url);
const cacheKey = `neo-stats:${start}:${end}`;
const cached = getCache(cacheKey);
if (cached) {
  return new Response(JSON.stringify(cached), { status: 200, headers: { "Content-Type": "application/json" } });
}
// ...[after calculating “result”]...
setCache(cacheKey, result, 15 * 60 * 1000); // 15 minutes
return new Response(JSON.stringify(result), { status: 200, headers: { "Content-Type": "application/json" } });

  // Params: date range (required)
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  if (!start || !end) {
    return new Response(JSON.stringify({ error: "start and end required" }), { status: 400 });
  }

  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();

    // Prepare daywise and aggregate stats
    let totals = { count: 0, hazardous: 0, minDiameter: Infinity, maxDiameter: -Infinity, closestApproach: Infinity };
    let days = [];

    for (const day in data.near_earth_objects) {
      const arr = data.near_earth_objects[day];
      let dayCount = arr.length;
      let hazardousCount = 0;
      let minDiameter = Infinity;
      let maxDiameter = -Infinity;
      let minApproach = Infinity;

      for (const neo of arr) {
        if (neo.is_potentially_hazardous_asteroid) hazardousCount++;
        const dia = neo.estimated_diameter.kilometers.estimated_diameter_max;
        if (dia > maxDiameter) maxDiameter = dia;
        if (dia < minDiameter) minDiameter = dia;
        const approach = Number(neo.close_approach_data?.[0]?.miss_distance?.kilometers);
        if (!isNaN(approach) && approach < minApproach) minApproach = approach;
      }

      totals.count += dayCount;
      totals.hazardous += hazardousCount;
      if (minDiameter < totals.minDiameter) totals.minDiameter = minDiameter;
      if (maxDiameter > totals.maxDiameter) totals.maxDiameter = maxDiameter;
      if (minApproach < totals.closestApproach) totals.closestApproach = minApproach;

      days.push({
        date: day,
        count: dayCount,
        hazardous: hazardousCount,
        minDiameter,
        maxDiameter,
        minApproach: isFinite(minApproach) ? minApproach : null
      });
    }

    return new Response(
      JSON.stringify({
        start,
        end,
        totals,
        days,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: "NASA API failed", detail: err.message }),
      { status: 500 }
    );
  }
}
