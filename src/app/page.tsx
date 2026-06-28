"use client";

import Image from "next/image";
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

type WeddingDetailTabKey = "Venue" | "Program" | "Entourage";
type EntourageItem = {
  layout: "single" | "double" | "double-center" | "double-six";
  label: string;
  values: string[];
  secondaryLabel?: string;
  secondaryValues?: string[];
};

const themeColor = "#521322";
const ivoryColor = "#FFFFF0";
const countdownSectionColor = "#FFF1E1";

const entourageItems: EntourageItem[] = [
  { layout: "single", label: "OFFICIATING MINISTER", values: ["Ferdinand Ramos Jr."] },
  {
    layout: "double",
    label: "PARENTS OF THE GROOM",
    values: ["Joel M. Blanca", "Glenda T. Blanca"],
    secondaryLabel: "PARENTS OF THE BRIDE",
    secondaryValues: ["Gil Gino D. Briones", "Melanie Hope E. Briones"],
  },
  { layout: "single", label: "WITNESSES", values: ["Melvin Recongco", "Cynthia D. Amador"]},
  { layout: "single", label: "BEST MAN", values: ["Jonard Jake M. Monilla"] },
  {
    layout: "double-six",
    label: "GROOMSMEN",
    values: ["Jared Nouwin M. Egipto", "Julian Abraham P. Blanca", "Judge Ethan T. Blanca", "Sebastian T. Blanca", "Alvin N. Tunay", "Glenn Adreanne F. Ampongan"],
    secondaryLabel: "BRIDESMAID",
    secondaryValues: ["Morice Jann E. Briones", "Jeneena Gabrielle E. Briones", "Keren-Happuch T. Blanca", "Sinead Brooklyn T. Blanca", "Rosalie T. Duclayan", "Alexandrei Dela Cruz"],
  },
  { layout: "single", label: "FLOWER GIRL", values: ["Anne Claire L. Briones"] },
  { layout: "double-center", label: "RING BEARER", values: ["Aiden Caleb L. Briones"], secondaryLabel: "BIBLE BEARER", secondaryValues: ["Malco Heart B. Gamboa"] },
];

const weddingDetailTabs: Array<{
  key: WeddingDetailTabKey;
  label: string;
  title: string;
  description: string;
  items: Array<{ label: string; value: string }>;
}> = [
  {
    key: "Venue",
    label: "Venue",
    title: "The Venue",
    description: "We’ll gather in a warm and elegant setting for a day of celebration and joy.",
    items: [
      { label: "Date", value: "September 25, 2025" },
      { label: "Time", value: "9:30 AM" },
      { label: "Location", value: "Leynes St., Brgy. Lalaan II, Silang, Cavite 4118, Philippines." },
      { label: "Venue", value: "Tree House Mansion" },
    ],
  },
  {
    key: "Program",
    label: "Program",
    title: "The Day's Events",
    description: "A simple and heartfelt celebration with meaningful moments throughout the day.",
    items: [
      { label: "Start of Ceremony", value: "9:30 AM — Exchanging of vows and becoming one." },
      { label: "Picture Taking Session", value: "10:30 AM — Capturing the joy of this special day" },
      { label: "Gather and Mingle", value: "11:00 AM — Guests are invited to enjoy light refreshements while the couple completes their portrait session" },
      { label: "Lunch", value: "12:00 NN — A luncheon will be served for all the guests" },
      { label: "Reception Begins", value: "1:00 PM — Join us as we continue the celebration and create laasting memories together" },

    ],
  },
  {
    key: "Entourage",
    label: "Entourage",
    title: "Our Entourage",
    description: "These are the people who will stand beside us and help make the day unforgettable.",
    items: [],
  },
];

function renderEntourageCard(item: EntourageItem) {
  if (item.layout === "single") {
    return (
      <div className="rounded-2xl border border-[#521322]/10 bg-[#FFF1E1]/70 p-4 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: themeColor }}>
          {item.label}
        </p>
        <div className="mt-2 space-y-1">
          {item.values.map((value) => (
            <p key={value} className="text-base leading-relaxed" style={{ color: themeColor }}>
              {value}
            </p>
          ))}
        </div>
      </div>
    );
  }

  if (item.layout === "double") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[#521322]/10 bg-[#FFF1E1]/70 p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: themeColor }}>
            {item.label}
          </p>
          <div className="mt-2 space-y-1">
            {item.values.map((value) => (
              <p key={value} className="text-base leading-relaxed" style={{ color: themeColor }}>
                {value}
              </p>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-[#521322]/10 bg-[#FFF1E1]/70 p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: themeColor }}>
            {item.secondaryLabel}
          </p>
          <div className="mt-2 space-y-1">
            {item.secondaryValues?.map((value) => (
              <p key={value} className="text-base leading-relaxed" style={{ color: themeColor }}>
                {value}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (item.layout === "double-center") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[#521322]/10 bg-[#FFF1E1]/70 p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: themeColor }}>
            {item.label}
          </p>
          <p className="mt-2 text-base leading-relaxed" style={{ color: themeColor }}>
            {item.values[0]}
          </p>
        </div>
        <div className="rounded-2xl border border-[#521322]/10 bg-[#FFF1E1]/70 p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: themeColor }}>
            {item.secondaryLabel}
          </p>
          <p className="mt-2 text-base leading-relaxed" style={{ color: themeColor }}>
            {item.secondaryValues?.[0]}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-[#521322]/10 bg-[#FFF1E1]/70 p-4 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: themeColor }}>
          {item.label}
        </p>
        <div className="mt-2 space-y-1">
          {item.values.map((value) => (
            <p key={value} className="text-sm leading-relaxed" style={{ color: themeColor }}>
              {value}
            </p>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-[#521322]/10 bg-[#FFF1E1]/70 p-4 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: themeColor }}>
          {item.secondaryLabel}
        </p>
        <div className="mt-2 space-y-1">
          {item.secondaryValues?.map((value) => (
            <p key={value} className="text-sm leading-relaxed" style={{ color: themeColor }}>
              {value}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function WeddingDetailsTabs() {
  const [activeTab, setActiveTab] = useState<WeddingDetailTabKey>("Venue");
  const activeContent = weddingDetailTabs.find((tab) => tab.key === activeTab) ?? weddingDetailTabs[0];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
      <div className="mx-auto inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-[#521322]/15 bg-white/80 p-1 shadow-sm">
        {weddingDetailTabs.map((tab) => {
          const isActive = tab.key === activeTab;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className="rounded-full px-4 py-2 text-sm font-semibold transition-all"
              style={{
                backgroundColor: isActive ? themeColor : "transparent",
                color: isActive ? "white" : themeColor,
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 w-full rounded-3xl border border-[#521322]/10 bg-white/80 p-6 text-center shadow-sm md:p-8">
        <h3 className="text-2xl font-semibold tracking-wide" style={{ color: themeColor }}>
          {activeContent.title}
        </h3>
        <p className="mt-3 text-base leading-relaxed" style={{ color: themeColor }}>
          {activeContent.description}
        </p>

        <div className="mt-6 space-y-3">
          {activeTab === "Entourage"
            ? entourageItems.map((item) => <div key={item.label}>{renderEntourageCard(item)}</div>)
            : activeContent.items.map((item) => {
                const [time, ...rest] = item.value.split("—");
                const subtitle = rest.join("—").trim();

                return (
                  <div key={item.label} className="rounded-2xl border border-[#521322]/10 bg-[#FFF1E1]/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: themeColor }}>
                      {item.label}
                    </p>
                    <div className="mt-2">
                      <p className="text-base font-semibold leading-relaxed" style={{ color: themeColor }}>
                        {time.trim()}
                      </p>
                      {subtitle ? (
                        <p className="mt-1 text-sm leading-relaxed" style={{ color: themeColor }}>
                          {subtitle}
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              })}

          {activeTab === "Venue" ? (
            <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-[#521322]/10 bg-white/70">
              <div className="p-4 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: themeColor }}>
                  Map
                </p>
                <p className="mt-2 text-base font-semibold" style={{ color: themeColor }}>
                  Tree House Mansion
                </p>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: themeColor }}>
                  5X44+7X5 Lalaan 2, Leynes St, Lalaan 2, Silang, 4118 Cavite
                </p>
              </div>
              <iframe
                title="Tree House Mansion Location"
                src="https://www.google.com/maps?q=Tree%20House%20Mansion%205X44%2B7X5%20Lalaan%202%20Leynes%20St%20Lalaan%202%20Silang%204118%20Cavite&output=embed"
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

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
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [message, setMessage] = useState("");
  const [rsvpGuests, setRsvpGuests] = useState<RsvpGuest[]>([
    { id: "guest-1", firstName: "", lastName: "", attending: "yes" },
  ]);
  const weddingDate = new Date("2026-09-25T09:30:00");
  const [countdownNow, setCountdownNow] = useState<Date>(() => new Date(weddingDate.getTime()));

  // Configurable scroll threshold for nav bar visibility (in pixels)
  const NAV_SCROLL_THRESHOLD = 100;
  const navLinkStyle = {
    fontSize: "clamp(0.5rem, 3vw, 1rem)",
    fontWeight: 600,
    lineHeight: 1.5,
    color: themeColor,
  };
  const rsvpLinkStyle = {
    ...navLinkStyle,
    color: "#deaa00",
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdownNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const countdownMs = Math.max(0, weddingDate.getTime() - countdownNow.getTime());
  const countdownDays = Math.floor(countdownMs / (1000 * 60 * 60 * 24));
  const countdownHours = Math.floor((countdownMs / (1000 * 60 * 60)) % 24);
  const countdownMinutes = Math.floor((countdownMs / (1000 * 60)) % 60);
  const countdownSeconds = Math.floor((countdownMs / 1000) % 60);

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
            start: "top bottom",
            end: "center bottom",
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
    const payload = {
      guests: rsvpGuests,
      message,
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

      setRsvpGuests([{ id: "guest-1", firstName: "", lastName: "", attending: "yes" }]);
      setMessage("");
      setRsvpStatus(data.message || "RSVP saved. Thank you!");
      setShowRsvpModal(true);
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

  function scrollToSection(targetId: string) {
    const target = document.getElementById(targetId);

    if (!target) return;

    const navOffset = 96;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2 + target.offsetHeight / 2 + navOffset / 2;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth",
    });
  }

  function closeRsvpModal() {
    setShowRsvpModal(false);
  }

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col" style={{ backgroundColor: ivoryColor }}>
      {/* Fixed Navigation Bar - appears on scroll */}
      <nav
        className="fixed top-0 left-0 w-full z-40 px-3 sm:px-6 md:px-8 py-5 md:py-6 flex justify-center md:justify-start gap-6 sm:gap-6 md:gap-6 transition-all duration-300"
        style={{
          backgroundColor: scrollY > NAV_SCROLL_THRESHOLD ? "white" : "transparent",
          boxShadow: scrollY > NAV_SCROLL_THRESHOLD ? "0 2px 8px rgba(0, 0, 0, 0.1)" : "none",
        }}
      >
        <a href="#home" className="tracking-wide transition-colors" style={navLinkStyle}>
          Top
        </a>
        <a
          href="#countdown"
          className="tracking-wide transition-colors"
          style={navLinkStyle}
          onClick={(event) => {
            event.preventDefault();
            scrollToSection("countdown");
          }}
        >
          Wedding Details
        </a>
        <a href="#dress" className="tracking-wide transition-colors" style={navLinkStyle}>
          Dress Code
        </a>
        <a href="#rsvp" className="tracking-wide transition-colors" style={rsvpLinkStyle}>
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
          <div className="hero-text absolute z-10 w-1/2" style={{ color: themeColor, opacity: 0, right: 0, top: "50%", transform: "translateY(-50%)", paddingRight: "clamp(0.5rem, 12vw, 14rem)" }}>
            <h1 className="text-right" style={{ color: themeColor, fontFamily: "var(--font-cormorant)", fontSize: "clamp(3.5rem, 8vw, 4.5rem)", fontWeight: 700, letterSpacing: "clamp(0.06em, 0.8vw, 0.2em)", lineHeight: "1", marginBottom: "clamp(0.375rem, 1.5vw, 1rem)" }}>
              Luc & Gail
            </h1>
            <p className="text-right" style={{ color: themeColor, fontFamily: "var(--font-italianno)", fontSize: "clamp(2.5rem, 7vw, 3.75rem)", fontWeight: 400, lineHeight: "1", marginRight: "clamp(0rem, 1vw, 1.125rem)", textShadow: "0 0 0.35px currentColor" }} >
              are getting married!
              {/* Under Jehovah's blessing, they begin their life as one. */}
            </p>
          </div>
        </div>

      </section>

      {/* Story Section 2 */}
      <section
        id="story"
        className="flex min-h-[100svh] w-full items-center justify-center px-4 py-6 sm:px-6 lg:px-8"
        style={{ backgroundColor: ivoryColor }}
      >
        <div className="mx-auto flex w-full max-w-8xl flex-1 flex-col gap-4 lg:flex-row lg:items-stretch">
          <div className="flex-1 overflow-hidden rounded-[2rem] bg-white/70 shadow-sm">
            <Image
              src="/images/story3.jpg"
              alt="Story photo 3"
              width={1200}
              height={1600}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-1 flex-col gap-4">
            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              <div className="overflow-hidden rounded-[1.5rem] bg-white/70 shadow-sm sm:col-span-2">
                <Image
                  src="/images/story2.jpg"
                  alt="Story photo 2"
                  width={1600}
                  height={900}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-[1.5rem] bg-white/70 shadow-sm">
                <Image
                  src="/images/story1.jpg"
                  alt="Story photo 1"
                  width={900}
                  height={1200}
                  className="h-56 w-full object-cover sm:h-72"
                />
              </div>
              <div className="overflow-hidden rounded-[1.5rem] bg-white/70 shadow-sm">
                <Image
                  src="/images/story4.jpg"
                  alt="Story photo 4"
                  width={900}
                  height={1200}
                  className="h-56 w-full object-cover sm:h-72"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] bg-white/70 shadow-sm">
              <Image
                src="/images/story5.jpg"
                alt="Story photo 5"
                width={1600}
                height={900}
                className="h-56 w-full object-cover sm:h-72"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section id="countdown" className="w-full flex items-center justify-center px-6 py-8" style={{ backgroundColor: countdownSectionColor }}>
        <div className="w-full max-w-3xl text-center">
          <div style={{ backgroundColor: countdownSectionColor }}>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: themeColor }}>
              Countdown to the big day
            </p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-2xl bg-gray-50 px-4 py-5">
                <div className="text-4xl font-semibold" style={{ color: themeColor }}>{countdownDays}</div>
                <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: themeColor }}>Days</div>
              </div>
              <div className="rounded-2xl bg-gray-50 px-4 py-5">
                <div className="text-4xl font-semibold" style={{ color: themeColor }}>{countdownHours}</div>
                <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: themeColor }}>Hours</div>
              </div>
              <div className="rounded-2xl bg-gray-50 px-4 py-5">
                <div className="text-4xl font-semibold" style={{ color: themeColor }}>{countdownMinutes}</div>
                <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: themeColor }}>Minutes</div>
              </div>
              <div className="rounded-2xl bg-gray-50 px-4 py-5">
                <div className="text-4xl font-semibold" style={{ color: themeColor }}>{countdownSeconds}</div>
                <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: themeColor }}>Seconds</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Details Section */}
      <section id="details" className="w-full flex items-center justify-center px-6 py-16" style={{ backgroundColor: ivoryColor }}>
        <div className="w-full max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-wide" style={{ color: themeColor }}>
            Wedding Details
          </h2>
          <p className="mx-auto max-w-2xl text-lg md:text-xl font-light leading-relaxed mb-8" style={{ color: themeColor }}>
            Explore the venue, program, and our entourage through the tabs below.
          </p>
          <WeddingDetailsTabs />
        </div>
      </section>

      {/* Dress Code Section */}
      <section id="dress" className="min-h-screen w-full flex items-center justify-center px-6 py-20" style={{ backgroundColor: "#A78A9C" }}>
        <div className="w-full max-w-4xl rounded-[2rem] border border-white/40 bg-white/60 px-6 py-10 text-center shadow-lg backdrop-blur-sm sm:px-10 md:px-14 md:py-14">
          <p className="mb-4 text-l font-extrabold uppercase tracking-[0.35em]" style={{ color: "#000000" }}>
            DRESS CODE
          </p>
          <div className="mx-auto max-w-3xl space-y-5 text-lg leading-relaxed" style={{ color: "#000000" }}>
            <p>
              We would be delighted to have you join us in your finest attire, dressed in the following colors, as we celebrate this special occasion in elegance, beauty, and harmony.
            </p>
            <p>
              Gentlemen are invited to wear a black suit, coat, or long-sleeved dress shirt with a tie, while ladies are encouraged to wear long, elegant dresses in satin or other formal fabrics.
            </p>
            <p>
              In keeping with the spirit of 1 Timothy 2:9, we kindly request modest and dignified attire and grooming.
            </p>
          </div>

          <div className="mt-10 rounded-[1.5rem] border border-white/40 bg-white/40 p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: "#000000" }}>
              Dress Code Colors
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-start">
              {[
                { color: "#E4BEB4", name: "Rose Pink" },
                { color: "#DA979B", name: "Dusty Rose" },
                { color: "#9C5C62", name: "Muted Burgundy" },
              ].map((swatch) => (
                <div key={swatch.color} className="flex flex-1 items-center justify-start gap-3 rounded-2xl bg-white/80 px-4 py-4 shadow-sm">
                  <div className="h-10 w-10" style={{ backgroundColor: swatch.color }} />
                  <div className="text-left">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: "#000000" }}>
                      {swatch.color}
                    </p>
                    <p className="text-sm" style={{ color: "#000000" }}>
                      {swatch.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {showRsvpModal ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: themeColor }}>
              Thank You
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-wide" style={{ color: themeColor }}>
              Thank you for sending your RSVP
            </h3>
            <p className="mt-4 text-base leading-relaxed" style={{ color: themeColor }}>
              We truly appreciate your response and are so grateful to celebrate with you.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href="/files/Luc & Gail's RSVP.pdf"
                download
                className="rounded-full px-6 py-3 font-semibold transition-colors"
                style={{ backgroundColor: themeColor, color: "white" }}
              >
                Download RSVP
              </a>
              <button
                type="button"
                onClick={closeRsvpModal}
                className="rounded-full border border-[#521322]/20 px-6 py-3 font-semibold transition-colors"
                style={{ color: themeColor }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* RSVP Section */}
      <section id="rsvp" className="min-h-screen w-full flex items-center justify-center px-6 py-24" style={{ backgroundColor: ivoryColor }}>
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-wide" style={{ color: themeColor }}>
              RSVP
            </h2>
            <p className="text-lg md:text-xl font-light leading-relaxed" style={{ color: themeColor }}>
              We would love to know if you can celebrate with us.
            </p>
          </div>

          <form onSubmit={handleRsvpSubmit} className="bg-white shadow-lg rounded-3xl p-6 md:p-8 space-y-6">
            <div className="space-y-4">
              {rsvpGuests.map((guest, index) => (
                <div key={guest.id} className="rounded-2xl border border-gray-200 p-4 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-xl font-semibold tracking-wide" style={{ color: themeColor }}>
                      Guest {index + 1}
                    </h3>
                    {rsvpGuests.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeRsvpGuest(guest.id)}
                        className="text-sm font-semibold transition-colors hover:text-red-500"
                        style={{ color: themeColor }}
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor={`${guest.id}-first-name`} className="block text-sm font-semibold tracking-wide mb-2" style={{ color: themeColor }}>
                        First Name
                      </label>
                      <input
                        id={`${guest.id}-first-name`}
                        type="text"
                        required
                        value={guest.firstName}
                        onChange={(event) => updateRsvpGuest(guest.id, "firstName", event.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-gray-500"
                        style={{ color: themeColor }}
                      />
                    </div>

                    <div>
                      <label htmlFor={`${guest.id}-last-name`} className="block text-sm font-semibold tracking-wide mb-2" style={{ color: themeColor }}>
                        Last Name
                      </label>
                      <input
                        id={`${guest.id}-last-name`}
                        type="text"
                        required
                        value={guest.lastName}
                        onChange={(event) => updateRsvpGuest(guest.id, "lastName", event.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-gray-500"
                        style={{ color: themeColor }}
                      />
                    </div>
                  </div>

                  <fieldset>
                    <legend className="block text-sm font-semibold tracking-wide mb-2" style={{ color: themeColor }}>
                      Will this person attend?
                    </legend>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`cursor-pointer rounded-full border px-4 py-3 text-center text-sm font-semibold transition-colors ${guest.attending === "yes" ? "text-white" : "border-gray-200"}`} style={{ borderColor: guest.attending === "yes" ? themeColor : undefined, backgroundColor: guest.attending === "yes" ? themeColor : undefined, color: guest.attending === "yes" ? "white" : themeColor }}>
                        <input
                          type="radio"
                          name={`${guest.id}-attending`}
                          value="yes"
                          checked={guest.attending === "yes"}
                          onChange={(event) => updateRsvpGuest(guest.id, "attending", event.target.value)}
                          className="sr-only"
                        />
                        Yes, I will attend
                      </label>
                      <label className={`cursor-pointer rounded-full border px-4 py-3 text-center text-sm font-semibold transition-colors ${guest.attending === "no" ? "text-white" : "border-gray-200"}`} style={{ borderColor: guest.attending === "no" ? themeColor : undefined, backgroundColor: guest.attending === "no" ? themeColor : undefined, color: guest.attending === "no" ? "white" : themeColor }}>
                        <input
                          type="radio"
                          name={`${guest.id}-attending`}
                          value="no"
                          checked={guest.attending === "no"}
                          onChange={(event) => updateRsvpGuest(guest.id, "attending", event.target.value)}
                          className="sr-only"
                        />
                        No, I will join through Zoom instead
                      </label>
                    </div>
                  </fieldset>
                </div>
              ))}

              <button
                type="button"
                onClick={addRsvpGuest}
                className="w-full rounded-2xl border border-dashed border-gray-300 px-4 py-4 text-lg font-semibold transition-colors hover:border-gray-500"
                style={{ color: themeColor }}
              >
                + Add Another Person
              </button>
            </div>

            <div>
              {/* <label htmlFor="attendeeCount" className="block text-sm font-semibold tracking-wide text-gray-700 mb-2">
                Number of Attendees
              </label>
              <input
                id="attendeeCount"
                name="attendeeCount"
                type="number"
                min="0"
                required
                value={attendeeCount}
                onChange={(event) => setAttendeeCount(event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-gray-500"
              /> */}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold tracking-wide mb-2" style={{ color: themeColor }}>
                Optional Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-gray-500"
                style={{ color: themeColor }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingRsvp}
              className="w-full rounded-full px-6 py-3 text-white font-semibold tracking-wide transition-colors disabled:cursor-not-allowed disabled:bg-gray-400"
              style={{ backgroundColor: themeColor }}
            >
              {isSubmittingRsvp ? "Sending..." : "Send RSVP"}
            </button>

            <a
              href="/files/Luc & Gail's RSVP.pdf"
              download
              className="block text-center text-sm font-semibold underline transition-opacity hover:opacity-80"
              style={{ color: themeColor }}
            >
              Download soft copy of RSVP
            </a>

            {rsvpStatus ? (
              <p className="text-center text-sm font-medium" style={{ color: themeColor }} aria-live="polite">
                {rsvpStatus}
              </p>
            ) : null}
          </form>
        </div>
      </section>
    </div>
    
  );
}
