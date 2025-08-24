 
import { db } from "@/lib/db";

export async function GET() {
  // NASA NEO quick ping (will not bill you much quota)
  let nasaApiStatus = "ok";
  try {
    const res = await fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"); // safe, public, fast
    if (!res.ok) throw new Error();
  } catch {
    nasaApiStatus = "error";
  }

  // Database check
  let dbStatus = "ok";
  try {
    await db.query("SELECT 1");
  } catch {
    dbStatus = "error";
  }

  // Optionally, check cache connectivity here if using Redis/Upstash (not included in this demo)

  return new Response(JSON.stringify({
    status: "ok",
    nasaApi: nasaApiStatus,
    db: dbStatus,
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
