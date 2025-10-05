"use client";

import React, { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeLeft {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft: TimeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]); // Only run once and when targetDate changes

  const timerComponents: React.ReactNode[] = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (timeLeft[interval as keyof TimeLeft] === undefined) {
      return;
    }

    timerComponents.push(
      <div
        key={interval}
        className="text-center bg-background p-4 rounded-lg shadow-md"
      >
        <div className="text-4xl font-bold">
          {timeLeft[interval as keyof TimeLeft]}
        </div>
        <div className="text-sm">{interval}</div>
      </div>
    );
  });

  return (
    <div className="flex justify-center gap-8">
      {timerComponents.length ? timerComponents : <span>Time's up!</span>}
    </div>
  );
};

export default CountdownTimer;
