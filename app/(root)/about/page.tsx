import React from "react";

const AboutPage = () => {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      {/* Hero / Intro */}
      <section className="relative overflow-hidden rounded-2xl bg-primary-100 text-white p-6 sm:p-10 md:p-16 shadow-lg">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight">
          About International Dance Nigeria
        </h1>
        <p className="mt-4 text-base md:text-lg max-w-3xl">
          International Dance Nigeria celebrates and promotes Nigeria’s
          homegrown talent — from performers and dancers to teachers,
          choreographers, musicians and designers. We connect local excellence
          to the world, offering young dancers the unique opportunity to train,
          perform and compete on the international stage at the Dance World Cup.
        </p>
      </section>

      {/* Founders section */}
      <section className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 items-stretch">
        <div className="flex flex-col justify-between rounded-lg bg-background p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Our Founders</h2>
          <p className="mt-3 text-muted-foreground">
            Founded by Margaret Macaulay and Colin Sinclair, International Dance
            Nigeria was created to showcase Nigerian dance excellence and to
            build a sustainable pathway for dancers and creative professionals
            to thrive on the global stage.
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-white font-semibold">
                  MM
                </div>
              </div>
              <div>
                <p className="font-semibold">Margaret Macaulay</p>
                <p className="text-sm text-muted-foreground">
                  Co-Founder • Artistic Director
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-white font-semibold">
                  CS
                </div>
              </div>
              <div>
                <p className="font-semibold">Colin Sinclair</p>
                <p className="text-sm text-muted-foreground">
                  Co-Founder • Programme Lead
                </p>
              </div>
            </div>
          </div>

          <a
            href="/contact-us"
            className="mt-6 inline-block w-max bg-secondary text-secondary-foreground px-4 py-2 rounded-md font-medium hover:opacity-95"
          >
            Contact the Team
          </a>
        </div>

        <div className="grid grid-cols-1 ga-6">
          <img
            src="/founders/margaret.jpg"
            alt="Margaret Macaulay — Founder"
            className="object-cover w-full h-full"
          />
          <img
            src="/founders/colin.jpg"
            alt="Colin Sinclair — Founder"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Big founder images - placeholders (replace with real photos in /public/founders/) */}
        {/* <div className="grid grid-cols-1 gap-6">
          <div className="relative overflow-hidden rounded-xl shadow-lg h-72 md:h-96">
            <img
              src="/founders/margaret.jpg"
              alt="Margaret Macaulay — Founder"
              className="object-cover w-full h-full"
            />
            <div className="absolute left-4 bottom-4 bg-black/60 text-white rounded-md px-3 py-2">
              <p className="font-semibold">Margaret Macaulay</p>
              <p className="text-xs">Artistic Director</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl shadow-lg h-72 md:h-96">
            <img
              src="/founders/colin.jpg"
              alt="Colin Sinclair — Founder"
              className="object-cover w-full h-full"
            />
            <div className="absolute left-4 bottom-4 bg-black/60 text-white rounded-md px-3 py-2">
              <p className="font-semibold">Colin Sinclair</p>
              <p className="text-xs">Programme Lead</p>
            </div>
          </div>
        </div> */}
      </section>

      {/* Mission / Vision / What we do */}
      <section className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-lg">Our Mission</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            To nurture, showcase and export Nigerian dance talent by providing
            opportunities for education, performance and international
            competition — while preserving our cultural identity and creative
            innovation.
          </p>
        </div>

        <div className="rounded-lg bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-lg">What We Do</h3>
          <ul className="mt-2 text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>
              Prepare dancers for the Dance World Cup and other international
              events.
            </li>
            <li>
              Offer masterclasses, workshops and mentorship with top
              professionals.
            </li>
            <li>
              Support dance education, teachers, choreographers and associated
              creatives.
            </li>
          </ul>
        </div>

        <div className="rounded-lg bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-lg">Our Values</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Excellence • Inclusion • Education • Cultural Pride • Collaboration
          </p>
        </div>
      </section>

      {/* Achievements / CTA */}
      {/* <section className="mt-12 rounded-lg bg-primary-foreground p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h4 className="text-xl font-bold">
              Proud partners of Dance World Cup
            </h4>
            <p className="mt-2 text-sm text-white/90 max-w-2xl">
              We provide pathways for young Nigerian dancers to compete and
              learn on the international stage. Over the years our delegates
              have performed with distinction, and our educational programmes
              have continued to grow in reach and impact.
            </p>
          </div>

          <a
            href="/contact-us"
            className="inline-block bg-secondary text-secondary-foreground px-4 py-2 rounded-md font-medium"
          >
            Join or Support Us
          </a>
        </div>
      </section> */}
    </main>
  );
};

export default AboutPage;
