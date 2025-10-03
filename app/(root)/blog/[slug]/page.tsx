
import React from "react";

const BlogPostPage = ({ params }: { params: { slug: string } }) => {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">{params.slug.replace(/-/g, " ")}</h1>
      <p>This is a placeholder for the blog post content.</p>
    </div>
  );
};

export default BlogPostPage;
