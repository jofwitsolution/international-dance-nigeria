"use client";

import React, { useEffect, useState } from "react";

const DEADLINE_ISO = "2026-01-31T23:59:59"; // Registration closes on Jan 31, 2026 (end of day local time)

function useCountdown(targetIso: string) {
  const target = new Date(targetIso).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isOver: diff <= 0 };
}

export default function RegisterationPage() {
  const { days, hours, minutes, seconds, isOver } = useCountdown(DEADLINE_ISO);
  const deadline = new Date(DEADLINE_ISO);

  return (
    <main className="min-h-screen bg-background text-foreground py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Registration — DWC Qualifier Entries
          </h1>
          <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Registration is open for the DWC qualifier. Please follow the steps
            below to create an account and submit your dancers.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="md:col-span-1 bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Registration Status</h2>
            <div className="rounded-md border p-4 bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Closes</div>
                  <div className="text-base font-medium">
                    {deadline.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div className="text-right">
                  {!isOver ? (
                    <div className="text-sm text-success font-semibold">
                      Open
                    </div>
                  ) : (
                    <div className="text-sm text-destructive font-semibold">
                      Closed
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                {!isOver ? (
                  <div className="flex gap-2 justify-center">
                    <div className="text-center px-3 py-2 bg-primary/5 rounded-md">
                      <div className="text-2xl font-bold">
                        {String(days).padStart(2, "0")}
                      </div>
                      <div className="text-xs text-muted-foreground">Days</div>
                    </div>
                    <div className="text-center px-3 py-2 bg-primary/5 rounded-md">
                      <div className="text-2xl font-bold">
                        {String(hours).padStart(2, "0")}
                      </div>
                      <div className="text-xs text-muted-foreground">Hours</div>
                    </div>
                    <div className="text-center px-3 py-2 bg-primary/5 rounded-md">
                      <div className="text-2xl font-bold">
                        {String(minutes).padStart(2, "0")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Minutes
                      </div>
                    </div>
                    <div className="text-center px-3 py-2 bg-primary/5 rounded-md">
                      <div className="text-2xl font-bold">
                        {String(seconds).padStart(2, "0")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Seconds
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-sm text-muted-foreground">
                    Registration has closed.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 text-center">
              <a
                className="inline-block w-full md:w-auto text-center px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md shadow-sm"
                href="https://dwcentries.com/login"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open DWC Entries registration in a new tab"
              >
                Register on DWC Entries
              </a>
              <p className="text-xs text-muted-foreground mt-3">
                This opens the official DWC registration portal in a new tab.
              </p>
            </div>
          </section>

          <section className="md:col-span-2 bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-3">
              How to register (step-by-step)
            </h2>
            <ol className="list-decimal list-inside space-y-4 text-sm md:text-base">
              <li>
                Create an account on the official DWC registration portal:{" "}
                <a
                  className="text-primary underline"
                  href="https://dwcentries.com/login"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  dwcentries.com
                </a>
                . When creating your account, use your school or organisation
                name as the account name.
              </li>
              <li>
                After creating your account, <strong>log in</strong> to the DWC
                dashboard.
              </li>
              <li>
                In the dashboard (your school account), add your dancers and
                create entries for each dancer by selecting the dance categories
                they will perform in.
              </li>
              <li>
                Each participating dancer must pay a registration fee (a fixed
                fee per participant) and an entry fee for every category the
                dancer is entered into.{" "}
                {/* <strong>We are not showing any prices here.</strong> */}
              </li>
              <li>Payment information is available on the DWC portal.</li>
            </ol>

            <div className="mt-6 border-t pt-4 text-sm text-muted-foreground">
              <h3 className="font-medium mb-2">Important notes</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  You're registering through the official DWC entries website
                  (third-party). The registration and entry management happen on
                  that site.
                </li>
                <li>
                  Payment is made directly to Dance World Cup through their
                  portal. International Dance Nigeria does not handle payments
                  for DWC entries.
                </li>
                <li>
                  If you have questions about the DWC portal itself, please use
                  the contact/support links on the DWC site or contact us on
                  info@internationaldance.ng
                </li>
              </ul>
            </div>

            {/* <div className="mt-6">
              <h4 className="font-semibold">
                Why two steps (create entries now, pay later)?
              </h4>
              <p className="text-sm text-muted-foreground mt-2">
                Creating entries now secures your dancers' participation and
                allows organisers to plan. Payment details will be added
                shortly; when available you will be able to make payments to the
                provided account. International Dance Nigeria will forward
                registration fees to DWC as required.
              </p>
            </div> */}
          </section>
        </div>

        <footer className="mt-10 text-center text-xs text-muted-foreground">
          By registering you agree to the DWC terms on their site. If you need
          help, contact us on info@internationaldance.ng
        </footer>
      </div>
    </main>
  );
}
