import { NextRequest } from "next/server";
import { dbConnect } from "@/lib/db/mongoose";
import EventModel, { generateUniqueSlug } from "@/models/event";

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

  const body = await req.json();

  const {
    title,
    excerpt = "",
    contentHtml,
    coverImage,
    images = [],
    videos = [],
    publishedAt,
  } = body || {};

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
    images,
    videos,
    publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
  });

  return new Response(JSON.stringify(doc), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
