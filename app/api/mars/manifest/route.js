import { getCache, setCache } from "@/utils/cache";

export async function GET(request) {
  const apiKey = process.env.NASA_API_KEY;
  // e.g., /api/mars/manifest?rover=Perseverance
  const { searchParams } = new URL(request.url);
  const rover = searchParams.get('rover') || 'Curiosity';
const cacheKey = `neo-stats:${start}:${end}`;
const cached = getCache(cacheKey);
if (cached) {
  return new Response(JSON.stringify(cached), { status: 200, headers: { "Content-Type": "application/json" } });
}
// ...[after calculating “result”]...
setCache(cacheKey, result, 15 * 60 * 1000); // 15 minutes
return new Response(JSON.stringify(result), { status: 200, headers: { "Content-Type": "application/json" } });

  const url = `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    const manifest = data.photo_manifest;

    // Reduce to what the UI needs
    const summary = {
      name: manifest.name,
      landing_date: manifest.landing_date,
      max_sol: manifest.max_sol,
      total_photos: manifest.total_photos,
      status: manifest.status,
      cameras: manifest.photos.map(d => ({
        sol: d.sol,
        cameras: d.cameras
      }))
    };

    return new Response(JSON.stringify(summary), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      ok: false,
      error: 'NASA Manifest API failed',
      detail: err.message,
    }), { status: 500 });
  }
}
