export async function GET(request) {
  const apiKey = process.env.NASA_API_KEY;
  const { searchParams } = new URL(request.url);

  const rover = searchParams.get("rover") || "Curiosity";
  const sol = searchParams.get("sol");
  let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?api_key=${apiKey}`;
  if (sol) url += `&sol=${sol}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();

    const cameraCounts = {};
    data.photos.forEach(p => {
      cameraCounts[p.camera.name] = (cameraCounts[p.camera.name] || 0) + 1;
    });

    return new Response(JSON.stringify({
      rover,
      sol,
      total_photos: data.photos.length,
      camera_counts: cameraCounts
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
