
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BlogPostCardProps {
  title: string;
  excerpt: string;
  slug: string;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ title, excerpt, slug }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{excerpt}</p>
        <Button asChild className="mt-4">
          <Link href={`/blog/${slug}`}>Read More</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default BlogPostCard;
