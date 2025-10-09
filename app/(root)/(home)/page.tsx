import Hero from "@/components/Hero";
import React from "react";
import CountdownTimer from "@/components/CountdownTimer";
import InfoCard from "@/components/InfoCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import EventInformation from "./components/EventInformation";
import AboutDWC from "./components/AboutDWC";
import EventDate from "./components/EventDate";

const HomePage = () => {
  return (
    <div className="">
      <Hero />
      <div className="bg-primary-100 my-8 py-4">
        <div className="max-width text-center text-background">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-down">
            Dance World Cup Nigeria
          </h1>
          <p className="text-lg md:text-2xl mb-8 animate-fade-in-up">
            The official qualifier for the Dance World Cup Finals.
          </p>
          <Link href={"#about-dwc"} className="cursor-pointer">
            {" "}
            <Button size="lg">Learn More</Button>
          </Link>
        </div>
      </div>
      <div className="py-12 bg-primary-100 rounded-lg shadow-2xl">
        <div className="max-width">
          <h2 className="text-3xl font-bold text-center text-background mb-8">
            Event Countdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl text-background font-bold mb-4">
                Qualifier Registration Starts
              </h3>
              <CountdownTimer targetDate="2025-12-01T00:00:00" />
            </div>
            <div className="text-center">
              <h3 className="text-xl text-background font-bold mb-4">
                Qualifier Event
              </h3>
              <CountdownTimer targetDate="2026-02-14T00:00:00" />
            </div>
            <div className="text-center">
              <h3 className="text-xl text-background font-bold mb-4">
                Dance World Cup Finals
              </h3>
              <CountdownTimer targetDate="2026-07-08T00:00:00" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 my-12 max-width">
        {[
          "/dancers/dancer-1.jpg",
          "/dancers/dancer-2.jpg",
          "/dancers/dancer-3.jpg",
          "/dancers/dancer-4.jpg",
          "/dancers/dancer-5.jpg",
          "/dancers/dancer-6.jpg",
          "/dancers/dancer-7.jpg",
        ].map((src, idx) => (
          <div
            key={src}
            className="relative aspect-[3/2] rounded-lg shadow-lg overflow-hidden"
          >
            <Image
              src={src}
              alt={`Dancer ${idx + 1}`}
              fill
              className="object-cover w-full h-full"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              priority={idx === 0}
            />
          </div>
        ))}
      </div>

      <AboutDWC />

      <EventInformation />

      <EventDate />
    </div>
  );
};

export default HomePage;
