import Hero from "@/components/Hero";
import React from "react";
import CountdownTimer from "@/components/CountdownTimer";
import InfoCard from "@/components/InfoCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
          <Button size="lg">Learn More</Button>
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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 my-12 max-width">
        <Image
          src={"/dancers/dancer-1.jpg"}
          alt="Dancers"
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
        />
        <Image
          src={"/dancers/dancer-1.jpg"}
          alt="Dancers"
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
        />
        <Image
          src={"/dancers/dancer-1.jpg"}
          alt="Dancers"
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
        />
        <Image
          src={"/dancers/dancer-1.jpg"}
          alt="Dancers"
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
        />
        <Image
          src={"/dancers/dancer-1.jpg"}
          alt="Dancers"
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
        />
        <Image
          src={"/dancers/dancer-1.jpg"}
          alt="Dancers"
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
        />
        <Image
          src={"/dancers/dancer-1.jpg"}
          alt="Dancers"
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
        />
        <Image
          src={"/dancers/dancer-1.jpg"}
          alt="Dancers"
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
        />
      </div>
      <div className="max-width py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Event Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <InfoCard
              title="Categories & Entry Fees"
              content={
                <ul>
                  <li>Solo: ₦10,704 (€6)</li>
                  <li>Duet/Trio: ₦9,812 (€5.50)</li>
                  <li>Small Group (4-9 dancers): ₦8,920 (€5)</li>
                  <li>Large Group (10+ dancers): ₦8,028 (€4.50)</li>
                  <li>Spectator Admission: ₦3,568 (€2)</li>
                </ul>
              }
            />
            <InfoCard
              title="Dance Genres"
              content={
                <ul>
                  <li>Ballet & Neo Classical</li>
                  <li>Modern/Lyrical & Contemporary</li>
                  <li>Jazz/Show-Dance</li>
                  <li>Hip-Hop/Street Dance & Commercial</li>
                  <li>National Dance</li>
                  <li>Step Dance & Song and Dance</li>
                </ul>
              }
            />
            <InfoCard
              title="Awards"
              content={
                <ul>
                  <li>Gold: 90 and above</li>
                  <li>Silver: 80-89</li>
                  <li>Bronze: 70-79</li>
                </ul>
              }
            />
          </div>
        </div>
      </div>
      <div className="max-width py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">About the Dance World Cup</h2>
          <p className="text-lg mb-8">
            The Dance World Cup is the most prestigious all-genre dance
            competition in the world. For the first time, Nigeria will be
            participating in this global event, and this is your chance to be a
            part of history.
          </p>
          <Button size="lg">Register Now</Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
