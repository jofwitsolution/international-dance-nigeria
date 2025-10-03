
import React from "react";
import BlogPostCard from "@/components/BlogPostCard";

const blogPosts = [
  {
    title: "Nigeria's Historic Debut at the Dance World Cup",
    excerpt: "For the first time, Nigeria will be represented at the Dance World Cup. Learn more about this historic moment.",
    slug: "nigerias-historic-debut",
  },
  {
    title: "Meet the Judges for the Nigerian Qualifiers",
    excerpt: "Get to know the international and local judges who will be selecting Nigeria's representatives.",
    slug: "meet-the-judges",
  },
  {
    title: "A Guide to the Dance World Cup Categories",
    excerpt: "From ballet to hip-hop, learn about the different dance genres that will be featured in the competition.",
    slug: "guide-to-dwc-categories",
  },
];

const BlogPage = () => {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <BlogPostCard key={post.slug} {...post} />
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
