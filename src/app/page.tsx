"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RsvpGuest = {
  id: string;
  firstName: string;
  lastName: string;
  attending: string;
};

const createRsvpGuest = (): RsvpGuest => ({
  id: `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  firstName: "",
  lastName: "",
  attending: "yes",
});

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [rsvpStatus, setRsvpStatus] = useState("");
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpGuests, setRsvpGuests] = useState<RsvpGuest[]>([
    { id: "guest-1", firstName: "", lastName: "", attending: "yes" },
  ]);

  // Configurable scroll threshold for nav bar visibility (in pixels)
  const NAV_SCROLL_THRESHOLD = 100;
  const navLinkStyle = {
    fontSize: "clamp(0.5rem, 3vw, 1rem)",
    fontWeight: 600,
    lineHeight: 1.5,
  };
  const rsvpLinkStyle = {
    ...navLinkStyle,
    color: "#deaa00",
  };

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

  async function handleRsvpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmittingRsvp(true);
    setRsvpStatus("");
    const form = event.currentTarget;

    const formData = new FormData(form);
    const payload = {
      guests: rsvpGuests,
      attendeeCount: formData.get("attendeeCount"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message || "Could not send RSVP.");
      }

      form.reset();
      setRsvpStatus(data.message || "RSVP saved. Thank you!");
    } catch (error) {
      setRsvpStatus(error instanceof Error ? error.message : "Could not send RSVP.");
    } finally {
      setIsSubmittingRsvp(false);
    }
  }

  function updateRsvpGuest(id: string, field: keyof Omit<RsvpGuest, "id">, value: string) {
    setRsvpGuests((guests) =>
      guests.map((guest) => (guest.id === id ? { ...guest, [field]: value } : guest))
    );
  }

  function addRsvpGuest() {
    setRsvpGuests((guests) => [...guests, createRsvpGuest()]);
  }

  function removeRsvpGuest(id: string) {
    setRsvpGuests((guests) => guests.filter((guest) => guest.id !== id));
  }

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col bg-white">
      {/* Fixed Navigation Bar - appears on scroll */}
      <nav
        className="fixed top-0 left-0 w-full z-40 px-3 sm:px-6 md:px-8 py-5 md:py-6 flex justify-center md:justify-start gap-3 sm:gap-5 md:gap-8 transition-all duration-300"
        style={{
          backgroundColor: scrollY > NAV_SCROLL_THRESHOLD ? "white" : "transparent",
          boxShadow: scrollY > NAV_SCROLL_THRESHOLD ? "0 2px 8px rgba(0, 0, 0, 0.1)" : "none",
        }}
      >
        <a href="#story" className="tracking-wide text-black hover:text-gray-400 transition-colors" style={navLinkStyle}>
          Our Story
        </a>
        <a href="#details" className="tracking-wide text-black hover:text-gray-400 transition-colors" style={navLinkStyle}>
          Wedding Details
        </a>
        <a href="#dress" className="tracking-wide text-black hover:text-gray-400 transition-colors" style={navLinkStyle}>
          Dress Code
        </a>
        <a href="#rsvp" className="tracking-wide hover:text-gray-400 transition-colors" style={rsvpLinkStyle}>
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
            backgroundImage: `url('/images/hero_section3.jpg')`,
            backgroundPosition: "50% 35%",
            height: "100vh",
          }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}></div>
          
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}></div>
          <div className="hero-text absolute z-10 text-black w-1/2" style={{ opacity: 0, right: 0, top: "50%", transform: "translateY(-50%)", paddingRight: "clamp(0.5rem, 12vw, 14rem)" }}>
            <h1 className="text-black text-right" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(3.5rem, 8vw, 4.5rem)", fontWeight: 700, letterSpacing: "clamp(0.06em, 0.8vw, 0.2em)", marginBottom: "clamp(0.375rem, 1.5vw, 1rem)" }}>
              Luc & Gail
            </h1>
            <p className="text-black text-right" style={{ fontFamily: "var(--font-italianno)", fontSize: "clamp(2.5rem, 7vw, 3.75rem)", fontWeight: 400, marginRight: "clamp(0rem, 1vw, 1.125rem)", textShadow: "0 0 0.35px currentColor" }} >
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

      {/* RSVP Section */}
      <section id="rsvp" className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-6 py-24">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-wide text-gray-900">
              RSVP
            </h2>
            <p className="text-lg md:text-xl font-light leading-relaxed text-gray-700">
              We would love to know if you can celebrate with us.
            </p>
          </div>

          <form onSubmit={handleRsvpSubmit} className="bg-white shadow-lg rounded-3xl p-6 md:p-8 space-y-6">
            <div className="space-y-4">
              {rsvpGuests.map((guest, index) => (
                <div key={guest.id} className="rounded-2xl border border-gray-200 p-4 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-xl font-semibold tracking-wide text-gray-700">
                      Guest {index + 1}
                    </h3>
                    {rsvpGuests.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeRsvpGuest(guest.id)}
                        className="text-sm font-semibold text-gray-500 transition-colors hover:text-red-500"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor={`${guest.id}-first-name`} className="block text-sm font-semibold tracking-wide text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        id={`${guest.id}-first-name`}
                        type="text"
                        required
                        value={guest.firstName}
                        onChange={(event) => updateRsvpGuest(guest.id, "firstName", event.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-gray-500"
                      />
                    </div>

                    <div>
                      <label htmlFor={`${guest.id}-last-name`} className="block text-sm font-semibold tracking-wide text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        id={`${guest.id}-last-name`}
                        type="text"
                        required
                        value={guest.lastName}
                        onChange={(event) => updateRsvpGuest(guest.id, "lastName", event.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-gray-500"
                      />
                    </div>
                  </div>

                  <fieldset>
                    <legend className="block text-sm font-semibold tracking-wide text-gray-700 mb-2">
                      Will this person attend?
                    </legend>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`cursor-pointer rounded-full border px-4 py-3 text-center text-sm font-semibold transition-colors ${guest.attending === "yes" ? "border-black bg-black text-white" : "border-gray-200 text-gray-700"}`}>
                        <input
                          type="radio"
                          name={`${guest.id}-attending`}
                          value="yes"
                          checked={guest.attending === "yes"}
                          onChange={(event) => updateRsvpGuest(guest.id, "attending", event.target.value)}
                          className="sr-only"
                        />
                        Yes
                      </label>
                      <label className={`cursor-pointer rounded-full border px-4 py-3 text-center text-sm font-semibold transition-colors ${guest.attending === "no" ? "border-black bg-black text-white" : "border-gray-200 text-gray-700"}`}>
                        <input
                          type="radio"
                          name={`${guest.id}-attending`}
                          value="no"
                          checked={guest.attending === "no"}
                          onChange={(event) => updateRsvpGuest(guest.id, "attending", event.target.value)}
                          className="sr-only"
                        />
                        No
                      </label>
                    </div>
                  </fieldset>
                </div>
              ))}

              <button
                type="button"
                onClick={addRsvpGuest}
                className="w-full rounded-2xl border border-dashed border-gray-300 px-4 py-4 text-lg font-semibold text-gray-700 transition-colors hover:border-gray-500 hover:text-black"
              >
                + Add Another Person
              </button>
            </div>

            <div>
              <label htmlFor="attendeeCount" className="block text-sm font-semibold tracking-wide text-gray-700 mb-2">
                Number of Attendees
              </label>
              <input
                id="attendeeCount"
                name="attendeeCount"
                type="number"
                min="0"
                required
                defaultValue="1"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold tracking-wide text-gray-700 mb-2">
                Optional Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-gray-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingRsvp}
              className="w-full rounded-full bg-black px-6 py-3 text-white font-semibold tracking-wide transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isSubmittingRsvp ? "Sending..." : "Send RSVP"}
            </button>

            {rsvpStatus ? (
              <p className="text-center text-sm font-medium text-gray-700" aria-live="polite">
                {rsvpStatus}
              </p>
            ) : null}
          </form>
        </div>
      </section>
    </div>
  );
}
