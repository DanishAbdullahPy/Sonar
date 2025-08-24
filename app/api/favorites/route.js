import { db } from "@/lib/db";
import { admin } from "@/lib/firebase-admin";

// Utility to validate and get current user
async function getUserIdFromRequest(request) {
  const authHeader = request.headers.get("authorization") || "";
  const idToken = authHeader.startsWith("Bearer ") ? authHeader.split("Bearer ")[1] : null;

  if (!idToken) return null;
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    return decoded.uid; // Firebase's user UID (string)
  } catch {
    return null;
  }
}

export async function GET(request) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }
  const { rows } = await db.query("SELECT * FROM favorites WHERE user_id = $1", [userId]);
  return new Response(JSON.stringify(rows), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(request) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }
  const body = await request.json();
  const { type, object_id, label, data } = body;

  if (!type || !object_id) {
    return new Response(JSON.stringify({ error: "Missing type or object_id" }), { status: 400 });
  }
  try {
    await db.query(
      `INSERT INTO favorites (user_id, type, object_id, label, data)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, type, object_id) DO NOTHING`,
      [userId, type, object_id, label, data]
    );
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function DELETE(request) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }
  const body = await request.json();
  const { type, object_id } = body;
  try {
    await db.query(
      `DELETE FROM favorites WHERE user_id = $1 AND type = $2 AND object_id = $3`,
      [userId, type, object_id]
    );
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
