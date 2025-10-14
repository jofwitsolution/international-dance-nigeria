import { dbConnect } from "@/lib/db/mongoose";
import EventModel from "@/models/event";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Event - IDN",
  description:
    "Details and information about a specific event in International Dance Nigeria.",
};

function formatDate(dateStr: string | Date) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await dbConnect();
  const post = await EventModel.findOne({ slug }).lean();
  if (!post) {
    return (
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold">Post not found</h1>
        <p className="text-muted-foreground mt-2">
          The event post you are looking for does not exist.
        </p>
      </main>
    );
  }

  // @ts-ignore
  // @ts-ignore
  return (
    <main className="container mx-auto px-4 py-10 prose dark:prose-invert max-w-3xl">
      <h1 className="mb-2 md:mb-4 text-2xl font-bold">{post.title}</h1>
      <p className="text-sm text-muted-foreground mb-6">
        {formatDate(post.createdAt)}
      </p>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="w-full mb-6">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}

      {/* Content HTML */}
      <article dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

      {/* Additional Images */}
      {Array.isArray(post.images) && post.images.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Images</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {post.images.map((src: string, idx: number) => (
              <img
                key={idx}
                src={src}
                alt={`Image ${idx + 1}`}
                className="w-full h-auto rounded-md"
              />
            ))}
          </div>
        </section>
      )}

      {/* Videos */}
      {Array.isArray(post.videos) && post.videos.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Videos</h2>
          <div className="space-y-4">
            {post.videos.map((url: string, idx: number) => (
              <div key={idx} className="aspect-video w-full">
                <iframe
                  src={url}
                  allow={"true"}
                  className="w-full h-full rounded-md"
                ></iframe>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
