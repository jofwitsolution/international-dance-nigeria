"use client";

import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";

const Footer = () => {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    if (e.target instanceof HTMLFormElement) {
      const formData = new FormData(e.target);
      const email = formData.get("email");
      if (!email) {
        toast.error("Please enter a valid email address.");
        return;
      } else {
        toast.success("Subscribed successfully!");
        e.target.reset();
      }
    }
  };

  return (
    <footer className="bg-primary-100 text-white py-12">
      <div className="max-width grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">About IDN</h3>
          <p>
            International Dance Nigeria is the official organizer of the Dance
            World Cup qualifiers in Nigeria.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/rules-and-regulations">Rules & Regulations</Link>
            </li>
            <li>
              <Link href="/contact-us">Contact Us</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Follow Us</h3>
          <div className="flex items-center gap-4">
            <Link target="_blank" href="https://x.com/intldance_nig">
              Twitter
            </Link>
            <Link
              target="_blank"
              href="https://www.instagram.com/international_dance_nigeria_1"
            >
              Instagram
            </Link>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Newsletter</h3>
          <p>Stay up to date with our latest news.</p>
          <form
            onSubmit={handleSubscribe}
            className="flex items-center gap-2 mt-4"
          >
            <Input name="email" type="email" placeholder="Email" className="" />
            <Button type="submit" className="cursor-pointer">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
      <div className="text-center mt-8">
        <p>&copy; 2025 International Dance Nigeria. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
