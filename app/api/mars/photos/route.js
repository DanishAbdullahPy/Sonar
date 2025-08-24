import { getCache, setCache } from "@/utils/cache";

export async function GET(request) {
  const apiKey = process.env.NASA_API_KEY;
  const { searchParams } = new URL(request.url);
  const rover = searchParams.get('rover') || 'Curiosity';
  const sol = searchParams.get('sol') || '1000';
  const camera = searchParams.get('camera'); // optional

  let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${apiKey}`;
  if (camera) url += `&camera=${camera}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();

    // Include more detailed photo information
    const photos = data.photos.slice(0, 10).map(p => ({
      id: p.id,
      img_src: p.img_src,
      earth_date: p.earth_date,
      sol: p.sol,
      camera: {
        name: p.camera.name,
        full_name: p.camera.full_name
      },
      rover: {
        name: rover,
        status: data.rover_status || "Active",
        landing_date: data.rover_landing_date || "Unknown",
        launch_date: data.rover_launch_date || "Unknown",
        max_sol: data.rover_max_sol || "Unknown"
      },
      photo_manifest: {
        total_photos: p.total_photos || "Unknown",
        photos: p.photos || []
      },
      additional_info: {
        rover_id: p.rover_id,
        camera_id: p.camera_id,
        image_src: p.img_src
      }
    }));

    return new Response(JSON.stringify({ rover, sol, photos }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      ok: false,
      error: 'NASA Mars API failed',
      detail: err.message,
    }), { status: 500 });
  }
}
