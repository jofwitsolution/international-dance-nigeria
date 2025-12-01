import { NextRequest } from "next/server";
import { dbConnect } from "@/lib/db/mongoose";
import EventModel, { generateUniqueSlug } from "@/models/event";
import { uploadImageFromBuffer } from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  const limit = Math.min(
    Math.max(parseInt(searchParams.get("limit") || "9", 10), 1),
    50
  );
  const skip = (page - 1) * limit;
  const q = (searchParams.get("q") || "").trim();
  const filter = q
    ? {
        $or: [
          { title: { $regex: q, $options: "i" } },
          { slug: { $regex: q, $options: "i" } },
          { tags: { $elemMatch: { $regex: q, $options: "i" } } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    EventModel.find(filter as any)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("title slug excerpt coverImage publishedAt")
      .lean(),
    EventModel.countDocuments(filter as any),
  ]);

  return Response.json({
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(req: NextRequest) {
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

  let title: string | undefined;
  let excerpt = "";
  let contentHtml: string | undefined;
  let coverImage: string | undefined;
  let coverImagePublicId: string | undefined;
  let images: string[] = [];
  let imagesPublicIds: string[] = [];
  let videos: string[] = [];
  let publishedAt: any = undefined;

  // Accept multipart/form-data with files OR JSON
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    title = form.get("title")?.toString();
    excerpt = form.get("excerpt")?.toString() || "";
    contentHtml = form.get("contentHtml")?.toString() || "";
    publishedAt = form.get("publishedAt")?.toString();

    // coverImage file
    const coverFile = form.get("coverImage") as File | null;
    if (coverFile && typeof coverFile.arrayBuffer === "function") {
      const buf = Buffer.from(await coverFile.arrayBuffer());
      const res = await uploadImageFromBuffer(buf, "events/cover");
      coverImage = res.secure_url || res.url;
      coverImagePublicId = res.public_id;
    } else {
      coverImage = form.get("coverImageUrl")?.toString() || undefined;
    }

    // images[] files (multiple)
    const imageFiles = form.getAll("images") as File[];
    if (imageFiles && imageFiles.length) {
      for (const f of imageFiles) {
        if (f && typeof f.arrayBuffer === "function") {
          const buf = Buffer.from(await f.arrayBuffer());
          const res = await uploadImageFromBuffer(buf, "events/images");
          images.push(res.secure_url || res.url);
          imagesPublicIds.push(res.public_id);
        }
      }
    } else {
      const imgs = form.get("imagesUrls")?.toString();
      if (imgs)
        images = imgs
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
    }
  } else {
    const body = await req.json();
    title = body.title;
    excerpt = body.excerpt || "";
    contentHtml = body.contentHtml;
    coverImage = body.coverImage;
    images = body.images || [];
    videos = body.videos || [];
    publishedAt = body.publishedAt;
    coverImagePublicId = body.coverImagePublicId;
    imagesPublicIds = body.imagesPublicIds || [];
  }

  if (!title || !contentHtml || !coverImage) {
    return new Response(
      JSON.stringify({ message: "Missing required fields" }),
      { status: 400 }
    );
  }

  const slug = await generateUniqueSlug(EventModel, title);

  const doc = await EventModel.create({
    title,
    slug,
    excerpt,
    contentHtml,
    coverImage,
    coverImagePublicId,
    images,
    imagesPublicIds,
    videos,
    publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
  });

  return new Response(JSON.stringify(doc), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
