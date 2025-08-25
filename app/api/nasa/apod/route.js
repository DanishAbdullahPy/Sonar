
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';

  // Build query parameters
  const params = new URLSearchParams();
  params.append('api_key', apiKey);

  // Add optional parameters if provided
  const date = searchParams.get('date');
  if (date) params.append('date', date);

  const startDate = searchParams.get('start_date');
  const endDate = searchParams.get('end_date');
  if (startDate && endDate) {
    params.append('start_date', startDate);
    params.append('end_date', endDate);
  }

  const count = searchParams.get('count');
  if (count) params.append('count', count);

  const thumbs = searchParams.get('thumbs');
  if (thumbs) params.append('thumbs', thumbs);

  try {
    const response = await fetch(`https://api.nasa.gov/planetary/apod?${params.toString()}`);
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      ok: false,
      error: 'NASA APOD API failed',
      detail: err.message,
    }), { status: 500 });
  }
}
