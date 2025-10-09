"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ContactUsPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (e.target instanceof HTMLFormElement) {
      const formData = new FormData(e.target);
      const name = formData.get("name");
      const email = formData.get("email");
      const subject = formData.get("subject");
      const message = formData.get("message");

      if (!name || !email || !subject || !message) {
        toast.error("Please fill in all fields.");
        return;
      } else {
        toast.success("Message sent successfully!", {
          description: "We will get back to you soon.",
        });
        e.target.reset();
      }
    }
  };

  return (
    <div className="max-width mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>

      <div className="max-w-2xl mx-auto bg-background p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block font-medium text-gray-700 mb-2"
            >
              Name
            </label>
            <Input type="text" id="name" placeholder="Your Name" />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <Input type="email" id="email" placeholder="Your Email" />
          </div>
          <div>
            <label
              htmlFor="subject"
              className="block font-medium text-gray-700 mb-2"
            >
              Subject
            </label>
            <Input type="text" id="subject" placeholder="Subject" />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block font-medium text-gray-700 mb-2"
            >
              Message
            </label>
            <Textarea
              id="message"
              placeholder="Your Message"
              rows={5}
              className="h-30"
            />
          </div>
          <Button type="submit" className="w-full cursor-pointer">
            Send Message
          </Button>
        </form>
      </div>

      <div className="max-w-2xl mx-auto">
        <p className="text-center text-sm text-muted-foreground mt-4">
          Alternatively, you can reach us at{" "}
          <a
            href="mailto: info@internationaldance.ng"
            className="text-primary-100 underline"
          >
            info@internationaldance.ng
          </a>
        </p>
      </div>
    </div>
  );
};

export default ContactUsPage;
