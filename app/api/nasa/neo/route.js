export async function GET(request) {
  const apiKey = process.env.NASA_API_KEY;
  const today = new Date().toISOString().slice(0,10);
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      ok: false,
      error: 'NASA API failed',
      detail: err.message,
    }), { status: 500 });
  }
}
