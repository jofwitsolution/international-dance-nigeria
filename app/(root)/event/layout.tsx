import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Event - International Dance Nigeria",
  description:
    "Details and information about a specific event in International Dance Nigeria.",
};
const BlogLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className={"min-h-screen max-width"}>{children}</div>;
};

export default BlogLayout;
