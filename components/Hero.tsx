"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const heroImages = [
  "/hero-images/image-1.png",
  "/hero-images/image-2.png",
  "/hero-images/image-3.png",
];

const Hero = () => {
  const isMobile = useIsMobile();
  console.log({ isMobile });

  return (
    <div className={`relative ${isMobile ? "h-[300px]" : "h-screen"}`}>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper h-full"
      >
        {heroImages.map((image, index) => (
          <SwiperSlide key={index}>
            <div
              className="h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${image})` }}
            >
              {/* <div className="absolute inset-0 bg-black opacity-80 flex items-center justify-center">
                <div className="text-center text-white">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-down">
                    Dance World Cup Nigeria
                  </h1>
                  <p className="text-lg md:text-2xl mb-8 animate-fade-in-up">
                    The official qualifier for the Dance World Cup Finals.
                  </p>
                  <Button size="lg">Learn More</Button>
                </div>
              </div> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Hero;
