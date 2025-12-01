import { NextRequest } from "next/server";
import crypto from "crypto";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
const API_KEY = process.env.CLOUDINARY_API_KEY || "";
const API_SECRET = process.env.CLOUDINARY_API_SECRET || "";

export async function POST(req: NextRequest) {
  // Optionally require MANAGE_KEY to reduce abuse
  const { searchParams } = new URL(req.url);
  const provided = searchParams.get("key") || "";
  const expected = process.env.MANAGE_KEY || "";
  if (expected && provided !== expected) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return new Response(
      JSON.stringify({ message: "Cloudinary not configured" }),
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({}) as any);
  const folder = body.folder || "events/uploads";
  const timestamp = Math.floor(Date.now() / 1000);

  // build params to sign (sorted)
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha1")
    .update(paramsToSign + API_SECRET)
    .digest("hex");

  return new Response(
    JSON.stringify({
      cloudName: CLOUD_NAME,
      apiKey: API_KEY,
      timestamp,
      signature,
      folder,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
