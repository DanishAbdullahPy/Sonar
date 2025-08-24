export async function GET(request) {
  const apiKey = process.env.NASA_API_KEY;
  const { searchParams } = new URL(request.url);

  const rover = searchParams.get("rover") || "Curiosity";
  const sol = searchParams.get("sol");
  const earth_date = searchParams.get("earth_date");
  const camera = searchParams.get("camera");

  let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?api_key=${apiKey}`;
  if (sol) url += `&sol=${sol}`;
  if (earth_date) url += `&earth_date=${earth_date}`;
  if (camera) url += `&camera=${camera}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return new Response(JSON.stringify({
      count: data.photos.length,
      photos: data.photos.map(p => ({
        id: p.id,
        img: p.img_src,
        earth_date: p.earth_date,
        sol: p.sol,
        camera: p.camera.full_name,
        rover: p.rover.name
      }))
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
