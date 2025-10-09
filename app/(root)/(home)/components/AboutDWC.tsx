import React from "react";

const AboutDWC = () => {
  return (
    <section id="about-dwc" className="max-width py-12">
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
              streets. The Grand Finals feature the best routines competing for
              top awards.
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
    </section>
  );
};

export default AboutDWC;
