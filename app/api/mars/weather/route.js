import { getCache, setCache } from "@/utils/cache";

export async function GET(request) {
  const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";
  const { searchParams } = new URL(request.url);
  const feedtype = searchParams.get('feedtype') || 'json';
  const ver = searchParams.get('ver') || '1.0';

  try {
    const response = await fetch(`https://api.nasa.gov/insight_weather/?api_key=${apiKey}&feedtype=${feedtype}&ver=${ver}`);
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();

    // Process the weather data
    const processedData = {
      sol_keys: data.sol_keys || [],
      validity_checks: data.validity_checks || {},
      " terrestrial_date": data.terrestrial_date || {},
      "sol_data": data.sol_data || {}
    };

    // Cache the response for 1 hour
    setCache('mars-weather', processedData, 3600);

    return new Response(JSON.stringify(processedData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    // Try to get from cache if available
    const cachedData = getCache('mars-weather');
    if (cachedData) {
      return new Response(JSON.stringify(cachedData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      ok: false,
      error: 'Mars Weather API failed',
      detail: err.message,
    }), { status: 500 });
  }
}