import { NextRequest } from "next/server";
import { dbConnect } from "@/lib/db/mongoose";
import EventModel from "@/models/event";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  await dbConnect();
  const { slug } = await params;
  const doc = await EventModel.findOne({ slug }).lean();
  if (!doc) {
    return new Response(JSON.stringify({ message: "Not found" }), {
      status: 404,
    });
  }
  return Response.json(doc);
}
