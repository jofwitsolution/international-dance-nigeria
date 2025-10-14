import { Schema, model, models, InferSchemaType, type Model } from "mongoose";

function slugifyTitle(title: string) {
  return title
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // spaces to dashes
    .replace(/-+/g, "-") // collapse dashes
    .replace(/^-+|-+$/g, ""); // trim dashes
}

export async function generateUniqueSlug(Event: Model<any>, baseTitle: string) {
  const base = slugifyTitle(baseTitle) || "post";
  let slug = base;
  let i = 0;
  // loop to find an available slug
  // exclude current document id when checking (for updates)
  // Note: using regex to match exact slug
  // We'll increment -n suffix until unique
  // Set an upper bound to prevent infinite loop
  while (i < 1000) {
    const query: any = { slug };
    const exists = await Event.exists(query);
    if (!exists) return slug;
    i += 1;
    slug = `${base}-${i}`;
  }
  return `${base}-${Date.now()}`; // fallback
}

const EventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, default: "" },
    contentHtml: { type: String, required: true }, // store sanitized HTML from rich text editor
    coverImage: { type: String, required: true }, // URL
    images: { type: [String], default: [] }, // additional image URLs
    videos: { type: [String], default: [] }, // video URLs
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export type Event = InferSchemaType<typeof EventSchema> & { _id: any };

// @ts-ignore
export default (models.Event as ReturnType<typeof model<Event>>) ||
  model("Event", EventSchema);
