import { NextRequest } from "next/server";
import { dbConnect } from "@/lib/db/mongoose";
import EventModel, { generateUniqueSlug } from "@/models/event";
import { uploadImageFromBuffer, deleteImageByPublicId } from "@/lib/cloudinary";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  const doc = await EventModel.findById(id).lean();
  if (!doc)
    return new Response(JSON.stringify({ message: "Not found" }), {
      status: 404,
    });
  return Response.json(doc);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  // Verify manage key from query param
  const { searchParams } = new URL(req.url);
  const provided = searchParams.get("key") || "";
  const expected = process.env.MANAGE_KEY || "";
  if (!expected || provided !== expected) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const { id } = await params;

  // Load existing event
  const existing = await EventModel.findById(id);
  if (!existing)
    return new Response(JSON.stringify({ message: "Not found" }), {
      status: 404,
    });

  const contentType = req.headers.get("content-type") || "";
  const allowed: any = {};

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    // Basic fields
    if (form.get("title")) allowed.title = form.get("title")?.toString();
    if (form.get("excerpt")) allowed.excerpt = form.get("excerpt")?.toString();
    if (form.get("contentHtml"))
      allowed.contentHtml = form.get("contentHtml")?.toString();
    if (form.get("publishedAt")) {
      const p = form.get("publishedAt")?.toString();
      if (p) allowed.publishedAt = new Date(p);
    }

    // Handle coverImage replacement
    const coverFile = form.get("coverImage") as File | null;
    if (coverFile && typeof coverFile.arrayBuffer === "function") {
      // Upload new cover
      const buf = Buffer.from(await coverFile.arrayBuffer());
      const res = await uploadImageFromBuffer(buf, "events/cover");
      // mark to set new cover and public id
      allowed.coverImage = res.secure_url || res.url;
      allowed.coverImagePublicId = res.public_id;
      // delete previous cover from cloudinary if present
      if (existing.coverImagePublicId) {
        try {
          await deleteImageByPublicId(existing.coverImagePublicId);
        } catch (err) {
          console.error("Failed to delete old cover image", err);
        }
      }
    }

    // Handle images additions and removals
    // imagesToKeep - comma separated public ids to keep
    const imagesToKeepRaw = form.get("imagesToKeep")?.toString() || "";
    const imagesToKeep = imagesToKeepRaw
      ? imagesToKeepRaw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    // Files in `images` field are new uploads
    const newImages = form.getAll("images") as File[];
    const newImageUrls: string[] = [];
    const newImagePublicIds: string[] = [];
    if (newImages && newImages.length) {
      for (const f of newImages) {
        if (f && typeof f.arrayBuffer === "function") {
          const buf = Buffer.from(await f.arrayBuffer());
          const r = await uploadImageFromBuffer(buf, "events/images");
          newImageUrls.push(r.secure_url || r.url);
          newImagePublicIds.push(r.public_id);
        }
      }
    }

    // Determine which existing images to delete (those not in imagesToKeep)
    const existingPublicIds: string[] = existing.imagesPublicIds || [];
    const toDelete = existingPublicIds.filter(
      (id) => !imagesToKeep.includes(id)
    );
    for (const pubId of toDelete) {
      try {
        await deleteImageByPublicId(pubId);
      } catch (err) {
        console.error("Failed to delete image", pubId, err);
      }
    }

    // Build final arrays
    const keptImageUrls: string[] = [];
    const keptImagePublicIds: string[] = [];
    // Map kept public ids to their URLs using existing.images and existing.imagesPublicIds
    for (let i = 0; i < (existing.imagesPublicIds || []).length; i++) {
      const pub = existing.imagesPublicIds[i];
      const url = existing.images[i];
      if (imagesToKeep.includes(pub)) {
        keptImagePublicIds.push(pub);
        if (url) keptImageUrls.push(url);
      }
    }

    // Combine kept + new
    allowed.images = [...keptImageUrls, ...newImageUrls];
    allowed.imagesPublicIds = [...keptImagePublicIds, ...newImagePublicIds];
  } else {
    const body = await req.json();
    const fields = [
      "title",
      "excerpt",
      "contentHtml",
      "coverImage",
      "images",
      "videos",
      "publishedAt",
    ];
    for (const key of fields) if (key in body) allowed[key] = body[key];
    if (allowed.publishedAt) {
      const p = allowed.publishedAt;
      try {
        allowed.publishedAt = p ? new Date(p) : undefined;
      } catch (e) {
        // leave as-is if invalid
      }
    }
    // If body includes explicit imagesPublicIds and coverImagePublicId, keep them
    if (body.coverImagePublicId) {
      // if cover changed, delete old
      if (
        existing.coverImagePublicId &&
        existing.coverImagePublicId !== body.coverImagePublicId
      ) {
        try {
          await deleteImageByPublicId(existing.coverImagePublicId);
        } catch (err) {
          console.error("Failed to delete old cover image (json update)", err);
        }
      }
      allowed.coverImagePublicId = body.coverImagePublicId;
    }
    if (body.imagesPublicIds) {
      // delete any existing public ids that are not in body.imagesPublicIds
      const keepSet = new Set(body.imagesPublicIds || []);
      const toDelete = (existing.imagesPublicIds || []).filter(
        (id) => !keepSet.has(id)
      );
      for (const pubId of toDelete) {
        try {
          await deleteImageByPublicId(pubId);
        } catch (err) {
          console.error("Failed to delete image (json update)", pubId, err);
        }
      }
      allowed.imagesPublicIds = body.imagesPublicIds;
    }
  }

  const slug = await generateUniqueSlug(
    EventModel,
    allowed.title || existing.title
  );
  const updated = await EventModel.findByIdAndUpdate(
    id,
    { $set: { ...allowed, slug } },
    { new: true, runValidators: true }
  );
  if (!updated)
    return new Response(JSON.stringify({ message: "Not found" }), {
      status: 404,
    });
  return Response.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  // Verify manage key from query param
  const { searchParams } = new URL(req.url);
  const provided = searchParams.get("key") || "";
  const expected = process.env.MANAGE_KEY || "";
  if (!expected || provided !== expected) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const { id } = await params;
  const doc = await EventModel.findById(id);
  if (!doc)
    return new Response(JSON.stringify({ message: "Not found" }), {
      status: 404,
    });

  // delete images from cloudinary if present
  try {
    if (doc.coverImagePublicId)
      await deleteImageByPublicId(doc.coverImagePublicId);
  } catch (err) {
    console.error("Failed to delete cover image on deletion", err);
  }
  try {
    if (doc.imagesPublicIds && doc.imagesPublicIds.length) {
      for (const pubId of doc.imagesPublicIds) {
        try {
          await deleteImageByPublicId(pubId);
        } catch (err) {
          console.error("Failed to delete image on deletion", pubId, err);
        }
      }
    }
  } catch (err) {
    console.error("Error deleting images on event delete", err);
  }

  await doc.deleteOne();
  return new Response(null, { status: 204 });
}
