import CountdownTimer from "@/components/CountdownTimer";
import React from "react";

const RegisterationPage = () => {
  return (
    <main>
      <section className="max-width">
        <h1 className="text-3xl font-bold text-center my-12">
          Participate in the qualifier
        </h1>

        <div className="text-center bg-yellow-400 py-8 rounded-lg mb-12">
          <h2 className="text-xl font-bold mb-4">
            Qualifier Registration Starts In
          </h2>
          <CountdownTimer targetDate="2025-12-01T00:00:00" />
        </div>
      </section>
    </main>
  );
};

export default RegisterationPage;
