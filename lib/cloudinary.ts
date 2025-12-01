const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
const API_KEY = process.env.CLOUDINARY_API_KEY || "";
const API_SECRET = process.env.CLOUDINARY_API_SECRET || "";

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  // Intentionally not throwing at import time. Functions will check and throw when used.
}

type UploadResult = {
  url: string;
  secure_url: string;
  public_id: string;
  [k: string]: any;
};

export async function uploadImageFromBuffer(
  buffer: Buffer,
  folder = "events"
): Promise<UploadResult> {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    throw new Error("Cloudinary env vars not configured");
  }

  const cloudUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const form = new FormData();
  // Use base64 data URL so we avoid multipart file readers on the server
  const base64 = buffer.toString("base64");
  form.append("file", `data:image/jpeg;base64,${base64}`);
  form.append("folder", folder);

  const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64");

  const res = await fetch(cloudUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
    },
    body: form as any,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Cloudinary upload failed: ${res.status} ${txt}`);
  }
  const json = (await res.json()) as UploadResult;
  return json;
}

export async function deleteImageByPublicId(publicId: string) {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    throw new Error("Cloudinary env vars not configured");
  }

  const destroyUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`;
  const form = new FormData();
  form.append("public_id", publicId);

  const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64");
  const res = await fetch(destroyUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
    },
    body: form as any,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Cloudinary delete failed: ${res.status} ${txt}`);
  }

  const json = await res.json();
  return json;
}
