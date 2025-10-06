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

      <div className="max-width py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">About the Dance World Cup</h2>
          <p className="text-lg max-w-4xl mx-auto mb-8">
            The Dance World Cup is the most prestigious all-genre dance
            competition in the world. For the first time, Nigeria will be
            participating in this global event, and this is your chance to be a
            part of history.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-primary-foreground rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition">
              <div className="text-primary-600 text-4xl mb-2">🌍</div>
              <h3 className="text-xl font-bold mb-2">A Global Stage</h3>
              <p className="text-primary">
                Over <span className="font-semibold">25,000 competitors</span>{" "}
                from <span className="font-semibold">66+ countries</span>{" "}
                participate each year. The competition is specially aimed at
                children and youth dancers aged between 5 and 25.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-primary-foreground rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition">
              <div className="text-primary-600 text-4xl mb-2">🤝</div>
              <h3 className="text-xl font-bold mb-2">
                International Connections
              </h3>
              <p className="text-primary">
                The Dance World Cup is a prestigious platform where the world's
                most talented young dancers showcase their passion and artistry,
                building lasting friendships across the globe.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-primary-foreground rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition">
              <div className="text-primary-600 text-4xl mb-2">📅</div>
              <h3 className="text-xl font-bold mb-2">2026 Venue & Dates</h3>
              <p className="text-primary">
                The 2026 finals will be held in{" "}
                <span className="font-semibold">Dublin, Ireland</span> from{" "}
                <span className="font-semibold">8 to 18 July 2026</span>. Each
                year, the finals take place in a new country!
              </p>
            </div>
            {/* Card 4 */}
            <div className="bg-primary-foreground rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition">
              <div className="text-primary-600 text-4xl mb-2">🏆</div>
              <h3 className="text-xl font-bold mb-2">Judges & Awards</h3>
              <p className="text-primary">
                Judged by internationally acclaimed dancers and adjudicators.
                Special awards, trophies, and certificates are given to the top
                performers at the finals.
              </p>
            </div>
            {/* Card 5 */}
            <div className="bg-primary-foreground rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition">
              <div className="text-primary-600 text-4xl mb-2">🎉</div>
              <h3 className="text-xl font-bold mb-2">
                Opening Ceremony & Grand Finals
              </h3>
              <p className="text-primary">
                The event kicks off with a vibrant parade through Dublin’s
                streets. The Grand Finals feature the best routines competing
                for top awards.
              </p>
            </div>
            {/* Card 6 */}
            <div className="bg-primary-foreground rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition">
              <div className="text-primary-600 text-4xl mb-2">🇳🇬</div>
              <h3 className="text-xl font-bold mb-2">Nigerian Team</h3>
              <p className="text-primary">
                All qualified dancers will represent Nigeria and perform live in
                Ireland, making history on the world stage!
              </p>
            </div>
          </div>
        </div>
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
    </div>
  );
};

export default HomePage;
