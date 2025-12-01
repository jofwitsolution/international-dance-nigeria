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
  coverImagePublicId?: string;
  images?: string[];
  imagesPublicIds?: string[];
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

  // Create-state file inputs
  const [createCoverFile, setCreateCoverFile] = useState<File | null>(null);
  const [createImageFiles, setCreateImageFiles] = useState<File[]>([]);

  // Update-state: existing images and selection
  const [existingImagesState, setExistingImagesState] = useState<
    { url: string; publicId?: string; keep: boolean }[]
  >([]);
  const [existingCoverPreview, setExistingCoverPreview] = useState<
    string | null
  >(null);
  const [updateCoverFile, setUpdateCoverFile] = useState<File | null>(null);
  const [updateNewImageFiles, setUpdateNewImageFiles] = useState<File[]>([]);
  // upload progress
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // compress image using canvas (client-side)
  async function compressImage(file: File, maxWidth = 1600, quality = 0.8) {
    if (!file.type.startsWith("image/")) return file;
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = (e) => reject(e);
      image.src = url;
    });

    const ratio = img.width / img.height;
    const targetWidth = Math.min(maxWidth, img.width);
    const targetHeight = Math.round(targetWidth / ratio);

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, file.type || "image/jpeg", quality)
    );
    if (!blob) return file;
    return new File([blob], file.name, { type: blob.type });
  }

  // upload via XHR so we can track progress
  function uploadToCloudinary(
    file: File,
    sig: any,
    folder: string,
    onProgress?: (loaded: number, total: number) => void
  ) {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const compressed = await compressImage(file);
        const fd = new FormData();
        fd.append("file", compressed);
        fd.append("folder", folder);
        fd.append("api_key", sig.apiKey);
        fd.append("timestamp", String(sig.timestamp));
        fd.append("signature", sig.signature);

        const url = `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`;
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.upload.onprogress = function (e) {
          if (e.lengthComputable && onProgress) onProgress(e.loaded, e.total);
        };
        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const json = JSON.parse(xhr.responseText);
              resolve(json);
            } catch (err) {
              reject(err);
            }
          } else {
            reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
          }
        };
        xhr.onerror = function (e) {
          reject(new Error("Network error"));
        };
        xhr.send(fd);
      } catch (err) {
        reject(err);
      }
    });
  }

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
      // If files need uploading, do direct signed uploads to Cloudinary
      if (createCoverFile || createImageFiles.length) {
        // request signature
        const sigRes = await fetch(
          `/api/cloudinary/signature?key=${encodeURIComponent(manageKey)}`,
          { method: "POST", body: JSON.stringify({ folder: "events" }) }
        );
        if (!sigRes.ok)
          throw new Error("Failed to obtain Cloudinary signature");
        const sig = await sigRes.json();

        const uploadedImages: string[] = [];
        const uploadedPublicIds: string[] = [];
        let coverUrl = values.coverImage;
        let coverPubId: string | undefined = undefined;

        // helper to upload a file (delegates to XHR uploader which supports progress)
        async function uploadFile(
          file: File,
          folder = sig.folder,
          onProgress?: (loaded: number, total: number) => void
        ) {
          return await uploadToCloudinary(file, sig, folder, onProgress);
        }

        setIsUploading(true);
        setUploadProgress(0);
        try {
          const totalFiles =
            (createCoverFile ? 1 : 0) + createImageFiles.length;
          let uploaded = 0;

          if (createCoverFile) {
            const r = await uploadFile(
              createCoverFile,
              sig.folder + "/cover",
              (l: number, t: number) => {
                // approximate overall progress
                const frac = (uploaded + l / t) / totalFiles;
                setUploadProgress(Math.round(frac * 100));
              }
            );
            coverUrl = r.secure_url || r.url;
            coverPubId = r.public_id;
            uploaded += 1;
          }

          for (const f of createImageFiles) {
            const r = await uploadFile(
              f,
              sig.folder + "/images",
              (l: number, t: number) => {
                const frac = (uploaded + l / t) / totalFiles;
                setUploadProgress(Math.round(frac * 100));
              }
            );
            uploadedImages.push(r.secure_url || r.url);
            uploadedPublicIds.push(r.public_id);
            uploaded += 1;
            setUploadProgress(Math.round((uploaded / totalFiles) * 100));
          }
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
        }

        const payload = {
          title: values.title,
          excerpt: values.excerpt || "",
          contentHtml: values.contentHtml,
          publishedAt: values.publishedAt,
          videos,
          coverImage: coverUrl,
          coverImagePublicId: coverPubId,
          images: uploadedImages,
          imagesPublicIds: uploadedPublicIds,
        } as any;

        const res2 = await fetch(
          `/api/events?key=${encodeURIComponent(manageKey)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (!res2.ok) {
          const { message } = await res2
            .json()
            .catch(() => ({ message: "Failed" }));
          throw new Error(message || "Failed to create post");
        }
        const data = await res2.json();
        toast.success("Event post created");
        router.push(`/event/${data.slug}`);
        return;
      }

      const res = await fetch(
        `/api/events?key=${encodeURIComponent(manageKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, images, videos }),
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
    // populate existing images state for update UI
    const imgs: { url: string; publicId?: string; keep: boolean }[] = [];
    if (Array.isArray(data.images)) {
      const publicIds = Array.isArray(data.imagesPublicIds)
        ? data.imagesPublicIds
        : [];
      for (let i = 0; i < data.images.length; i++) {
        imgs.push({ url: data.images[i], publicId: publicIds[i], keep: true });
      }
    }
    setExistingImagesState(imgs);
    setExistingCoverPreview(data.coverImage || null);
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

      // Build list of existing images public ids to keep
      const imagesToKeepPubIds = existingImagesState
        .filter((i) => i.keep)
        .map((i) => i.publicId)
        .filter(Boolean) as string[];

      // If uploads or deletions are needed, perform client-side uploads then send JSON
      if (
        updateCoverFile ||
        updateNewImageFiles.length ||
        imagesToKeepPubIds.length !== (existingImagesState.length || 0)
      ) {
        // get signature
        const sigRes = await fetch(
          `/api/cloudinary/signature?key=${encodeURIComponent(manageKey)}`,
          { method: "POST", body: JSON.stringify({ folder: "events" }) }
        );
        if (!sigRes.ok)
          throw new Error("Failed to obtain Cloudinary signature");
        const sig = await sigRes.json();

        const uploadedImages: string[] = [];
        const uploadedPublicIds: string[] = [];
        let coverUrl = values.coverImage;
        let coverPubId: string | undefined = undefined;

        // Use the same XHR uploader so we can track progress in the UI
        async function uploadFile(
          file: File,
          folder = sig.folder,
          onProgress?: (loaded: number, total: number) => void
        ) {
          return await uploadToCloudinary(file, sig, folder, onProgress);
        }

        setIsUploading(true);
        setUploadProgress(0);
        try {
          const totalFiles =
            (updateCoverFile ? 1 : 0) + updateNewImageFiles.length;
          let uploaded = 0;
          if (updateCoverFile) {
            const r = await uploadFile(
              updateCoverFile,
              sig.folder + "/cover",
              (l: number, t: number) => {
                const frac = (uploaded + l / t) / totalFiles;
                setUploadProgress(Math.round(frac * 100));
              }
            );
            coverUrl = r.secure_url || r.url;
            coverPubId = r.public_id;
            uploaded += 1;
          }

          for (const f of updateNewImageFiles) {
            const r = await uploadFile(
              f,
              sig.folder + "/images",
              (l: number, t: number) => {
                const frac = (uploaded + l / t) / totalFiles;
                setUploadProgress(Math.round(frac * 100));
              }
            );
            uploadedImages.push(r.secure_url || r.url);
            uploadedPublicIds.push(r.public_id);
            uploaded += 1;
            setUploadProgress(Math.round((uploaded / totalFiles) * 100));
          }
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
        }

        // Combine kept existing URLs with newly uploaded ones. Existing URLs can be taken from existingImagesState
        const keptUrls = existingImagesState
          .filter((i) => i.keep)
          .map((i) => i.url);
        const keptPubIds = existingImagesState
          .filter((i) => i.keep)
          .map((i) => i.publicId)
          .filter(Boolean) as string[];

        const payload = {
          title: values.title,
          excerpt: values.excerpt || "",
          contentHtml: values.contentHtml,
          publishedAt: values.publishedAt,
          videos,
          coverImage: coverUrl,
          coverImagePublicId: coverPubId,
          images: [...keptUrls, ...uploadedImages],
          imagesPublicIds: [...keptPubIds, ...uploadedPublicIds],
        } as any;

        const res2 = await fetch(
          `/api/events/id/${selected._id}?key=${encodeURIComponent(manageKey)}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (!res2.ok) {
          const { message } = await res2
            .json()
            .catch(() => ({ message: "Failed" }));
          throw new Error(message || "Failed to update post");
        }
        const data = await res2.json();
        toast.success("Event post updated");
        router.push(`/event/${data.slug}`);
        return;
      }

      const res = await fetch(
        `/api/events/id/${selected._id}?key=${encodeURIComponent(manageKey)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, images, videos }),
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
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0] || null;
                          setCreateCoverFile(f);
                          if (f) {
                            const url = URL.createObjectURL(f);
                            createForm.setValue("coverImage", url);
                          }
                        }}
                      />
                    </div>
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
                      <FormDescription>
                        Or upload image files below (multiple allowed). Files
                        will be uploaded to Cloudinary.
                      </FormDescription>
                      <div className="mt-2">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            setCreateImageFiles(files);
                            const urls = files.map((f) =>
                              URL.createObjectURL(f)
                            );
                            createForm.setValue("images", urls.join(", "));
                          }}
                        />
                      </div>
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
                <div className="flex items-center gap-3">
                  {isUploading && (
                    <div className="w-48">
                      <div className="h-2 bg-background rounded-full overflow-hidden">
                        <div
                          className="h-2 bg-primary"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Uploading {uploadProgress}%
                      </div>
                    </div>
                  )}
                  <Button
                    type="submit"
                    disabled={submitting || isUploading}
                    className="cursor-pointer"
                  >
                    {submitting ? "Creating..." : "Create Post"}
                  </Button>
                </div>
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
                        <FormDescription>
                          Or upload a new cover file to replace the existing
                          one.
                        </FormDescription>
                        <div className="mt-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0] || null;
                              setUpdateCoverFile(f);
                              if (f)
                                updateForm.setValue(
                                  "coverImage",
                                  URL.createObjectURL(f)
                                );
                            }}
                          />
                        </div>
                        {existingCoverPreview && !updateCoverFile && (
                          <div className="mt-2">
                            <img
                              src={existingCoverPreview}
                              alt="cover"
                              className="max-h-40 rounded-md"
                            />
                          </div>
                        )}
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
                          <div className="mt-4">
                            <div className="text-sm font-medium mb-2">
                              Existing images
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {existingImagesState.map((img, idx) => (
                                <label key={idx} className="block text-center">
                                  <img
                                    src={img.url}
                                    className="h-20 w-28 object-cover rounded-md"
                                  />
                                  <div>
                                    <input
                                      type="checkbox"
                                      checked={img.keep}
                                      onChange={(e) => {
                                        setExistingImagesState((prev) => {
                                          const next = [...prev];
                                          next[idx] = {
                                            ...next[idx],
                                            keep: e.target.checked,
                                          };
                                          return next;
                                        });
                                      }}
                                    />{" "}
                                    Keep
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="text-sm font-medium mb-1">
                              Upload new images
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                setUpdateNewImageFiles(files);
                                // append previews to textarea
                                const prev =
                                  updateForm.getValues("images") || "";
                                const urls = files.map((f) =>
                                  URL.createObjectURL(f)
                                );
                                updateForm.setValue(
                                  "images",
                                  prev
                                    ? prev + ", " + urls.join(", ")
                                    : urls.join(", ")
                                );
                              }}
                            />
                          </div>
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
                    <div className="flex items-center gap-3">
                      {isUploading && (
                        <div className="w-48">
                          <div className="h-2 bg-background rounded-full overflow-hidden">
                            <div
                              className="h-2 bg-primary"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Uploading {uploadProgress}%
                          </div>
                        </div>
                      )}
                      <Button
                        type="submit"
                        disabled={submitting || isUploading}
                        className="cursor-pointer"
                      >
                        {submitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
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
