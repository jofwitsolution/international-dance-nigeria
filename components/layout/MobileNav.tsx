import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Rules and Regulations",
    href: "/rules-and-regulations",
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
          <SheetTitle>
            <SheetClose asChild>
              <Link href="/" className="text-2xl font-bold text-primary-100">
                <Image
                  src={"site-logo-1.svg"}
                  width={70}
                  height={40}
                  alt="Logo"
                />
              </Link>
            </SheetClose>
          </SheetTitle>
          <SheetDescription className="sr-only" />
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-8 px-4">
          {navLinks.map((link) => (
            <SheetClose asChild key={link.href}>
              <Link href={link.href} className="text-lg font-medium">
                {link.label}
              </Link>
            </SheetClose>
          ))}
          <Link href={"/registeration"} className="mt-4 w-full cursor-pointer">
            <Button className="w-full">Register</Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};
