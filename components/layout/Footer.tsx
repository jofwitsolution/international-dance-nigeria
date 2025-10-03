
import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Footer = () => {
  return (
    <footer className="bg-primary-100 text-white py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
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
              <Link href="/rules-and-regulations">Rules & Regulations</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
            <li>
              <Link href="/contact-us">Contact Us</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Follow Us</h3>
          <div className="flex items-center gap-4">
            <Link href="#">Facebook</Link>
            <Link href="#">Twitter</Link>
            <Link href="#">Instagram</Link>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Newsletter</h3>
          <p>Stay up to date with our latest news.</p>
          <div className="flex items-center gap-2 mt-4">
            <Input type="email" placeholder="Email" className="text-black" />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>
      <div className="text-center mt-8">
        <p>&copy; 2025 International Dance Nigeria. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

