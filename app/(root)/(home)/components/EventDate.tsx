import React from "react";

const EventDate: React.FC = () => {
  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid gap-6 sm:grid-cols-2 items-stretch">
          {/* Qualifier Card */}
          <article className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/90 to-primary-50 shadow-lg p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 rounded-lg bg-primary-100/10 p-3">
                <div className="h-12 w-12 rounded-md bg-primary-100 flex items-center justify-center text-white font-bold">
                  Q
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Qualifier</h3>
                <p className="mt-1 text-sm text-primary">
                  Preliminary competition to select national representatives
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-primary">Date</p>
                <p className="text-lg font-semibold">14 February 2026</p>
              </div>

              <div>
                <p className="text-sm text-primary">Location</p>
                <p className="text-lg font-semibold">Abeokuta, Ogun State</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-primary">
                The qualifier brings together the best young dancers from across
                Nigeria. Qualified dancers will earn the chance to represent
                Nigeria at the Dance World Cup Finals in July 2026.
              </p>
            </div>
          </article>

          {/* Main Event Card */}
          <article className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 to-primary-foreground text-white shadow-2xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 rounded-lg bg-white/10 p-3">
                <div className="h-12 w-12 rounded-md bg-white flex items-center justify-center text-primary-100 font-bold">
                  M
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Main Event</h3>
                <p className="mt-1 text-sm text-white/90">
                  National finals and Dance World Cup delegation
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-white/90">Date</p>
                <p className="text-lg font-semibold">8 — 18 July 2026</p>
              </div>

              <div>
                <p className="text-sm text-white/90">Location</p>
                <p className="text-lg font-semibold">Dublin, Ireland</p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <a
                href="/contact-us"
                className="inline-block rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:opacity-95"
              >
                Get Involved
              </a>
              <a href="#" className="text-sm text-white/90 underline">
                See Full Schedule
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default EventDate;
