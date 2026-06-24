"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  // Configurable scroll threshold for nav bar visibility (in pixels)
  const NAV_SCROLL_THRESHOLD = 100;

  useEffect(() => {
    if (!containerRef.current) return;

    const heroSection = containerRef.current.querySelector(".hero-section");
    const heroText = containerRef.current.querySelector(".hero-text");

    // Handle scroll event
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    // Animate hero section (background only, no delay)
    gsap.fromTo(
      heroSection,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
        scrollTrigger: {
          trigger: heroSection,
          start: "top center",
          end: "center center",
          markers: false,
        },
      }
    );

    // Animate hero text with 0.5s delay
    gsap.fromTo(
      heroText,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: 0.5,
        scrollTrigger: {
          trigger: heroSection,
          start: "top center",
          end: "center center",
          markers: false,
        },
      }
    );

    // Animate other sections on scroll
    const sections = containerRef.current.querySelectorAll("section:not(.hero-section)");

    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: "top center",
            end: "center center",
            scrub: 1,
            markers: false,
          },
        }
      );
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col bg-white">
      {/* Fixed Navigation Bar - appears on scroll */}
      <nav
        className="fixed top-0 left-0 w-full z-40 px-8 py-6 flex gap-8 transition-all duration-300"
        style={{
          backgroundColor: scrollY > NAV_SCROLL_THRESHOLD ? "white" : "transparent",
          boxShadow: scrollY > NAV_SCROLL_THRESHOLD ? "0 2px 8px rgba(0, 0, 0, 0.1)" : "none",
        }}
      >
        <a href="#home" className="text-sm font-semibold tracking-wide text-black hover:text-gray-400 transition-colors">
          Home
        </a>
        <a href="#story" className="text-sm font-semibold tracking-wide text-black hover:text-gray-400 transition-colors">
          Our Story
        </a>
        <a href="#details" className="text-sm font-semibold tracking-wide text-black hover:text-gray-400 transition-colors">
          Wedding Details
        </a>
        <a href="#dress" className="text-sm font-semibold tracking-wide text-black hover:text-gray-400 transition-colors">
          Dress Code
        </a>
        <a href="#rsvp" className="text-sm font-semibold tracking-wide text-black hover:text-gray-400 transition-colors" style={{ color: "#deaa00" }}>
          RSVP
        </a>
      </nav>

      {/* Hero Section with Buttons */}
      <section
        id="home"
        className="hero-section flex flex-col relative w-full"
        style={{
          height: "100vh",
        }}
      >
        {/* Hero Image - 85vh */}
        <div
          className="flex flex-col items-center justify-end flex-1 bg-cover relative"
          style={{
            backgroundImage: `url('./images/hero_section3.jpg')`,
            backgroundPosition: "50% 35%",
            height: "100vh",
          }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}></div>
          
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}></div>
          <div className="hero-text absolute z-10 text-black px-6" style={{ opacity: 0, right: "200px", top: "50%", transform: "translateY(-50%)" }}>
            <h1 className="text-7xl md:text-7xl font-extrabold mb-4 tracking-widest text-black text-right" style={{ fontFamily: "var(--font-cormorant)" }}>
              Luc and Gail
            </h1>
            <p className="text-6xl md:text-6xl font-medium text-black text-right" style={{ fontFamily: "var(--font-italianno)", marginRight: "18px"}} >
              are getting married!
              {/* Under Jehovah's blessing, they begin their life as one. */}
            </p>
          </div>
        </div>

      </section>

      {/* Story Section 2 */}
      <section id="story" className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-6">
        <div className="max-w-3xl text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-wide text-gray-900">
            How We Met
          </h2>
          <p className="text-lg md:text-xl font-light leading-relaxed text-gray-700 mb-8">
            It was a beautiful day when our paths crossed. From that moment on,
            we knew our story was just beginning. Every laugh, every adventure,
            and every quiet moment has been a gift.
          </p>
        </div>
      </section>

      {/* Wedding Details Section */}
      <section id="details" className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-6">
        <div className="max-w-3xl text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-wide text-gray-900">
            Wedding Details
          </h2>
          <p className="text-lg md:text-xl font-light leading-relaxed text-gray-700 mb-8">
            Join us as we celebrate our love and create memories together.
          </p>
          <div className="text-base font-light text-gray-700 space-y-4">
            <p><strong>Date:</strong> [Your Wedding Date]</p>
            <p><strong>Time:</strong> [Your Wedding Time]</p>
            <p><strong>Location:</strong> [Your Venue]</p>
          </div>
        </div>
      </section>

      {/* Dress Code Section */}
      <section id="dress" className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-6">
        <div className="max-w-3xl text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-wide text-gray-900">
            Dress Code
          </h2>
          <p className="text-lg md:text-xl font-light leading-relaxed text-gray-700 mb-8">
            Elegant and formal attire, please. We invite you to celebrate in style.
          </p>
          <div className="text-base font-light text-gray-700 space-y-4">
            <p><strong>For Her:</strong> Evening gown or formal dress</p>
            <p><strong>For Him:</strong> Tuxedo or formal suit</p>
          </div>
        </div>
      </section>
    </div>
  );
}
