
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";

const navLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Rules and Regulations",
    href: "/rules-and-regulations",
  },
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Contact Us",
    href: "/contact-us",
  },
];

export const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>IDN</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-8">
          {navLinks.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className="text-lg font-medium"
            >
              {link.label}
            </Link>
          ))}
          <Button>Register</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
