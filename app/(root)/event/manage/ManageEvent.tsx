"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import QuillEditor from "@/components/editor/QuillEditor";
import "quill/dist/quill.snow.css";

const schema = z.object({
  title: z.string().min(3),
  excerpt: z.string().max(300).optional(),
  coverImage: z.string().url(),
  images: z.string().optional(), // comma separated URLs
  videos: z.string().optional(), // comma separated URLs
  contentHtml: z.string().min(10),
  publishedAt: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type EventItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage: string;
  images?: string[];
  videos?: string[];
  contentHtml?: string;
  publishedAt?: string;
};

export default function ManageEvent() {
  const searchParams = useSearchParams();
  const manageKey = searchParams.get("key") || "";
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"create" | "update" | "delete">(
    "create"
  );
  const [submitting, setSubmitting] = useState(false);

  // Create form
  const createForm = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      excerpt: "",
      coverImage: "",
      images: "",
      videos: "",
      contentHtml: "",
    },
  });

  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "blockquote", "code-block"],
        ["clean"],
      ],
    }),
    []
  );

  async function onCreate(values: FormValues) {
    setSubmitting(true);
    try {
      const images = values.images
        ? values.images
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      const videos = values.videos
        ? values.videos
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      const res = await fetch(
        `/api/events?key=${encodeURIComponent(manageKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            images,
            videos,
          }),
        }
      );
      if (!res.ok) {
        const { message } = await res
          .json()
          .catch(() => ({ message: "Failed" }));
        throw new Error(message || "Failed to create post");
      }
      const data = await res.json();
      toast.success("Event post created");
      router.push(`/event/${data.slug}`);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  // Update/delete helpers
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<EventItem[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoadingSearch(true);
      try {
        const params = new URLSearchParams({ limit: "20" });
        if (query) params.set("q", query);
        const res = await fetch(`/api/events?${params.toString()}`);
        const json = await res.json();
        setResults(json.items || []);
      } catch (e) {
        // ignore
      } finally {
        setLoadingSearch(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  // Update form
  const updateForm = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      excerpt: "",
      coverImage: "",
      images: "",
      videos: "",
      contentHtml: "",
    },
  });
  const [selected, setSelected] = useState<EventItem | null>(null);

  async function loadOneById(id: string) {
    const res = await fetch(`/api/events/id/${id}`);
    if (!res.ok) {
      toast.error("Failed to load post");
      return;
    }
    const data: EventItem = await res.json();
    setSelected(data);
    updateForm.reset({
      title: data.title || "",
      excerpt: data.excerpt || "",
      coverImage: data.coverImage || "",
      images: Array.isArray(data.images) ? data.images.join(", ") : "",
      videos: Array.isArray(data.videos) ? data.videos.join(", ") : "",
      contentHtml: data.contentHtml || "",
      publishedAt: data.publishedAt
        ? new Date(data.publishedAt).toISOString()
        : undefined,
    });
  }

  async function onUpdate(values: FormValues) {
    if (!selected?._id) return;
    setSubmitting(true);
    try {
      const images = values.images
        ? values.images
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      const videos = values.videos
        ? values.videos
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      const res = await fetch(
        `/api/events/id/${selected._id}?key=${encodeURIComponent(manageKey)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            images,
            videos,
          }),
        }
      );
      if (!res.ok) {
        const { message } = await res
          .json()
          .catch(() => ({ message: "Failed" }));
        throw new Error(message || "Failed to update post");
      }
      const data = await res.json();
      toast.success("Event post updated");
      router.push(`/event/${data.slug}`);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id: string) {
    if (
      !confirm(
        "Are you sure you want to delete this event post? This cannot be undone."
      )
    )
      return;
    try {
      const res = await fetch(
        `/api/events/id/${id}?key=${encodeURIComponent(manageKey)}`,
        { method: "DELETE" }
      );
      if (!res.ok && res.status !== 204) throw new Error("Failed to delete");
      toast.success("Event post deleted");
      setResults((prev) => prev.filter((p) => p._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch (e: any) {
      toast.error(e.message || "Delete failed");
    }
  }

  return (
    <main className="min-h-screen container mx-auto px-4 py-10 max-w-5xl">
      <h1 className="text-2xl font-semibold mb-6">Manage Event</h1>

      {/* Tabs */}
      <div className="mb-6">
        <div className="inline-flex rounded-md border overflow-hidden">
          <button
            className={`px-4 py-2 text-sm cursor-pointer ${
              activeTab === "create"
                ? "bg-primary text-primary-foreground"
                : "bg-background"
            }`}
            onClick={() => setActiveTab("create")}
          >
            Create
          </button>
          <button
            className={`px-4 py-2 text-sm border-l cursor-pointer ${
              activeTab === "update"
                ? "bg-primary text-primary-foreground"
                : "bg-background"
            }`}
            onClick={() => setActiveTab("update")}
          >
            Update
          </button>
          <button
            className={`px-4 py-2 text-sm border-l cursor-pointer ${
              activeTab === "delete"
                ? "bg-primary text-primary-foreground"
                : "bg-background"
            }`}
            onClick={() => setActiveTab("delete")}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Create Tab */}
      {activeTab === "create" && (
        <div className="max-w-3xl">
          <Form {...createForm}>
            <form
              onSubmit={createForm.handleSubmit(onCreate)}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  name="title"
                  control={createForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Post title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                name="excerpt"
                control={createForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Short summary (optional)"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="coverImage"
                control={createForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Displayed on the event list.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  name="images"
                  control={createForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Image URLs</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Comma separated URLs"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Displayed inside the post.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="videos"
                  control={createForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URLs</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Comma separated URLs"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Displayed inside the post.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                name="contentHtml"
                control={createForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <div className="rounded-md border">
                        <QuillEditor
                          value={field.value}
                          onChange={field.onChange}
                          modules={quillModules}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="cursor-pointer"
                >
                  {submitting ? "Creating..." : "Create Post"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      {/* Update Tab */}
      {activeTab === "update" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <div className="space-y-3">
              <Input
                placeholder="Search by title, slug"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="text-sm text-muted-foreground">
                {loadingSearch
                  ? "Searching..."
                  : results.length === 0
                    ? "No matches"
                    : `${results.length} result(s)`}
              </div>
              <div className="max-h-[400px] overflow-auto border rounded-md divide-y">
                {results.map((item) => (
                  <div
                    key={item._id}
                    className={`p-3 cursor-pointer hover:bg-accent ${
                      selected?._id === item._id ? "bg-accent" : ""
                    }`}
                    onClick={() => loadOneById(item._id)}
                  >
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-muted-foreground">
                      /{item.slug}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            {selected ? (
              <Form {...updateForm}>
                <form
                  onSubmit={updateForm.handleSubmit(onUpdate)}
                  className="space-y-5"
                >
                  <FormField
                    name="title"
                    control={updateForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Post title" {...field} />
                        </FormControl>
                        <FormDescription>
                          Changing the title will regenerate and update the slug
                          automatically.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="excerpt"
                    control={updateForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Short summary (optional)"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="coverImage"
                    control={updateForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      name="images"
                      control={updateForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Image URLs</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Comma separated URLs"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="videos"
                      control={updateForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Video URLs</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Comma separated URLs"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    name="contentHtml"
                    control={updateForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <div className="rounded-md border">
                            <QuillEditor
                              value={field.value}
                              onChange={field.onChange}
                              modules={quillModules}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="cursor-pointer"
                    >
                      {submitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="text-muted-foreground">Select a post to edit</div>
            )}
          </div>
        </div>
      )}

      {/* Delete Tab */}
      {activeTab === "delete" && (
        <div className="max-w-3xl space-y-4">
          <Input
            placeholder="Search by title, slug"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="text-sm text-muted-foreground">
            {loadingSearch
              ? "Searching..."
              : results.length === 0
                ? "No matches"
                : `${results.length} result(s)`}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.map((item) => (
              <div
                key={item._id}
                className="border rounded-md p-3 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="font-medium line-clamp-1">{item.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    /{item.slug}
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(item._id)}
                  className="cursor-pointer"
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
