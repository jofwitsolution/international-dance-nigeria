"use client";

import React from "react";
import { MobileNav } from "./MobileNav";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";

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
  // {
  //   label: "Blog",
  //   href: "/blog",
  // },
  {
    label: "Contact Us",
    href: "/contact-us",
  },
];

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-secondary shadow-sm">
      <nav className="max-width navbar-height flex items-center justify-between">
        <Link href={"/"} className="flex items-center gap-2 sm:gap-4">
          <Image
            src={"site-logo-1.svg"}
            width={70}
            height={40}
            alt="Logo"
            className="max-sm:w-[50px]"
          />

          <div className="flex flex-col items-center italic text-sm sm:text-lg font-bold leading-tight">
            <span>DANCE WORLD CUP</span>
            <span>NIGERIA</span>
          </div>
        </Link>
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink
                    href={link.href}
                    className={cn(
                      "inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors hover:bg-background/50",
                      isActive && "bg-background"
                    )}
                  >
                    {link.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="hidden lg:flex items-center gap-4">
          <Link href={"/registeration"} className="cursor-pointer">
            <Button>Register</Button>
          </Link>
        </div>
        <div className="lg:hidden">
          <MobileNav />
        </div>
      </nav>
    </header>
  );
};

export default Header;
