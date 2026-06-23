"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const heroSection = containerRef.current.querySelector(".hero-section");
    const heroText = containerRef.current.querySelector(".hero-text");
    const heroButtons = containerRef.current.querySelector(".hero-buttons");

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

    // Animate hero buttons with 0.5s delay
    gsap.fromTo(
      heroButtons,
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

    // Autoplay functionality
    if (autoPlay) {
      const autoPlayInterval = setInterval(() => {
        window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
      }, 3000); // Scroll every 3 seconds

      return () => clearInterval(autoPlayInterval);
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [autoPlay]);

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col bg-white">
      {/* Autoplay Toggle */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
        <label className="flex items-center gap-2 cursor-pointer text-sm font-light tracking-wide">
          <input
            type="checkbox"
            checked={autoPlay}
            onChange={() => setAutoPlay(!autoPlay)}
            className="w-4 h-4"
          />
          <span>Autoplay</span>
        </label>
      </div>

      {/* Hero Section with Buttons */}
      <section
        className="hero-section flex flex-col relative w-full"
        style={{
          height: "100vh",
        }}
      >
        {/* Hero Image - 85vh */}
        <div
          className="flex flex-col items-center justify-end flex-1 bg-cover relative"
          style={{
            backgroundImage: `url('/images/hero_section3.jpg')`,
            backgroundPosition: "20% 50%",
            height: "100vh",
          }}
        >
          <div className="absolute inset-0 bg-gray/10"></div>
          <div className="hero-text absolute z-10 text-black px-6" style={{ opacity: 0, right: "100px", top: "50%", transform: "translateY(-50%)" }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-widest text-black text-right" style={{ fontFamily: "'Cormorant Garamond', serif" }} >
              Luc and Gail
            </h1>
            <p className="text-xl md:text-xl font-light text-black-100 text-right" style={{ fontFamily: "'Italianno', cursive" }} >
              are getting married!
              {/* Under Jehovah's blessing, they begin their life as one. */}
            </p>
          </div>
        </div>
{/* style={{ fontFamily: "'DM Serif Display', serif" }} */}
        {/* Hero Buttons - 15vh */}
        <div className="hero-buttons flex items-center justify-center bg-white" style={{ height: "15vh", opacity: 0 }}>
          <div className="flex flex-col md:flex-row gap-6">
            <button className="px-8 py-3 bg-gray-800 text-white font-light tracking-wide hover:bg-gray-900 transition-colors duration-300 rounded-sm">
              RSVP
            </button>
            <button className="px-8 py-3 bg-white text-gray-800 font-light tracking-wide border-2 border-gray-800 hover:bg-gray-50 transition-colors duration-300 rounded-sm">
              Wedding Details
            </button>
            <button className="px-8 py-3 bg-gray-800 text-white font-light tracking-wide hover:bg-gray-900 transition-colors duration-300 rounded-sm">
              Dress Code
            </button>
          </div>
        </div>
      </section>

      {/* Story Section 2 */}
      <section className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-6">
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

      {/* Story Section 3 */}
      <section className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-6">
        <div className="max-w-3xl text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-wide text-gray-900">
            The Proposal
          </h2>
          <p className="text-lg md:text-xl font-light leading-relaxed text-gray-700 mb-8">
            Under the stars, surrounded by the people we love, he got down on one
            knee and asked the question we'd both been dreaming about. Yes was the
            easiest answer I've ever given.
          </p>
        </div>
      </section>

      {/* Buttons Section */}
      <section className="w-full py-20 px-6 bg-white flex justify-center border-t border-gray-200">
        <div className="flex flex-col md:flex-row gap-6 max-w-2xl">
          <button className="px-8 py-3 bg-gray-800 text-white font-light tracking-wide hover:bg-gray-900 transition-colors duration-300 rounded-sm">
            Save the Date
          </button>
          <button className="px-8 py-3 bg-white text-gray-800 font-light tracking-wide border-2 border-gray-800 hover:bg-gray-50 transition-colors duration-300 rounded-sm">
            Our Story
          </button>
          <button className="px-8 py-3 bg-gray-800 text-white font-light tracking-wide hover:bg-gray-900 transition-colors duration-300 rounded-sm">
            RSVP
          </button>
        </div>
      </section>
    </div>
  );
}
