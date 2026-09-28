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
  { layout: "single", label: "OFFICIANT", values: ["[Officiant Name]"] },
  {
    layout: "double",
    label: "PARENTS OF THE GROOM",
    values: ["[Parent Name]", "[Parent Name]"],
    secondaryLabel: "PARENTS OF THE BRIDE",
    secondaryValues: ["[Parent Name]", "[Parent Name]"],
  },
  {
    layout: "double",
    label: "BEST MAN",
    values: ["[Name]"],
    secondaryLabel: "MAID OF HONOR",
    secondaryValues: ["[Name]"],
  },
  {
    layout: "double-six",
    label: "GROOMSMEN",
    values: ["[Name]", "[Name]", "[Name]", "[Name]", "[Name]", "[Name]"],
    secondaryLabel: "BRIDESMAIDS",
    secondaryValues: ["[Name]", "[Name]", "[Name]", "[Name]", "[Name]", "[Name]"],
  },
  { layout: "double-center", label: "RING BEARER", values: ["[Name]"], secondaryLabel: "FLOWER GIRL", secondaryValues: ["[Name]"] },
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
      { label: "Date", value: "June 12, 2027 (sample date)" },
      { label: "Time", value: "[Start Time]" },
      { label: "Location", value: "[Street Address, City, Region]" },
      { label: "Venue", value: "[Venue Name]" },
    ],
  },
  {
    key: "Program",
    label: "Program",
    title: "The Day's Events",
    description: "A simple and heartfelt celebration with meaningful moments throughout the day.",
    items: [
      { label: "Ceremony", value: "[Start Time] — [Add ceremony details]" },
      { label: "Photos", value: "[Photo Time] — [Add photo session details]" },
      { label: "Gather and Mingle", value: "[Time] — [Add guest gathering details]" },
      { label: "Meal", value: "[Meal Time] — [Add meal details]" },
      { label: "Reception", value: "[Reception Time] — [Add reception details]" },

    ],
  },
  {
    key: "Entourage",
    label: "Entourage",
    title: "Our Wedding",
    description: "Meet the friends and family who will be part of the celebration.",
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
          {item.values.map((value, index) => (
            <p key={`${item.label}-${index}`} className="text-base leading-relaxed" style={{ color: themeColor }}>
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
            {item.values.map((value, index) => (
              <p key={`${item.label}-${index}`} className="text-base leading-relaxed" style={{ color: themeColor }}>
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
            {item.secondaryValues?.map((value, index) => (
              <p key={`${item.secondaryLabel}-${index}`} className="text-base leading-relaxed" style={{ color: themeColor }}>
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
          {item.values.map((value, index) => (
            <p key={`${item.label}-${index}`} className="text-sm leading-relaxed" style={{ color: themeColor }}>
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
          {item.secondaryValues?.map((value, index) => (
            <p key={`${item.secondaryLabel}-${index}`} className="text-sm leading-relaxed" style={{ color: themeColor }}>
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
            ? entourageItems.map((item, index) => <div key={`${item.label}-${index}`}>{renderEntourageCard(item)}</div>)
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
                  [Venue Name]
                </p>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: themeColor }}>
                  [Street Address, City, Region]
                </p>
              </div>
              <iframe
                title="Wedding venue map"
                src="https://www.google.com/maps?q=Wedding+venue&output=embed"
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
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [rsvpGuests, setRsvpGuests] = useState<RsvpGuest[]>([
    { id: "guest-1", firstName: "", lastName: "", attending: "yes" },
  ]);
  const weddingDate = new Date("2027-06-12T15:00:00");
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
    fontSize: navLinkStyle.fontSize,
    fontWeight: navLinkStyle.fontWeight,
    lineHeight: navLinkStyle.lineHeight,
    color: "white",
    backgroundColor: themeColor,
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    display: "inline-block",
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

    // Handle scroll event
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

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

    // Determine nav height dynamically so the scroll offset is correct across devices
    const navEl = document.querySelector("nav") as HTMLElement | null;
    const navHeight = navEl ? navEl.offsetHeight : 0;
    const extraOffset = 0; // extra space so content isn't flush with the nav

    const offset = navHeight + extraOffset;

    const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;

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
        className="fixed top-0 left-0 w-full z-40 px-3 sm:px-6 md:px-8 py-3 md:py-4 flex flex-nowrap justify-center md:justify-between items-center gap-4 sm:gap-5 md:gap-6 transition-all duration-300 overflow-x-auto"
        style={{
          backgroundColor: scrollY > NAV_SCROLL_THRESHOLD ? "white" : "transparent",
          boxShadow: scrollY > NAV_SCROLL_THRESHOLD ? "0 2px 8px rgba(0, 0, 0, 0.1)" : "none",
        }}
      >
        <div className="flex flex-nowrap justify-center md:justify-start gap-5 sm:gap-5 md:gap-6">
          <a
            href="#countdown"
            className="tracking-wide whitespace-nowrap transition-colors"
            style={navLinkStyle}
            onClick={(event) => {
              event.preventDefault();
              scrollToSection("countdown");
            }}
          >
            Wedding Details
          </a>
          <a
            href="#dress"
            className="tracking-wide whitespace-nowrap transition-colors"
            style={navLinkStyle}
            onClick={(event) => {
              event.preventDefault();
              scrollToSection("dress");
            }}
          >
            Dress Code
          </a>
          <a
            href="#faq"
            className="tracking-wide whitespace-nowrap transition-colors"
            style={navLinkStyle}
            onClick={(event) => {
              event.preventDefault();
              scrollToSection("faq");
            }}
          >
            Reminders
          </a>
        </div>
        <a href="#rsvp" className="tracking-wide transition-colors hidden md:inline-block" style={rsvpLinkStyle}
            onClick={(event) => {
              event.preventDefault();
              scrollToSection("rsvp");
            }}
            >
          RSVP
        </a>
      </nav>

      {scrollY > 20 ? (
        <button
          type="button"
          onClick={() => scrollToSection("home")}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 shadow-xl transition-transform duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#521322]/50"
          style={{ color: themeColor }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 15l7-7 7 7" />
          </svg>
        </button>
      ) : null}

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
          <div className="hero-text absolute z-10" style={{ width: "min(90vw, 42rem)", color: themeColor, right: "clamp(1rem, 6vw, 6rem)", top: "50%", transform: "translateY(-50%)" }}>
            <h1 className="text-right" style={{ color: themeColor, fontFamily: "var(--font-cormorant)", fontSize: "clamp(3.5rem, 8vw, 4.5rem)", fontWeight: 700, letterSpacing: "clamp(0.06em, 0.8vw, 0.2em)", lineHeight: "1", marginBottom: "clamp(0.375rem, 1.5vw, 1rem)", textShadow: "0 1px 10px rgba(255, 255, 240, 0.8)" }}>
              [Partner One] & [Partner Two]
            </h1>
            <p className="text-right" style={{ color: themeColor, fontFamily: "var(--font-italianno)", fontSize: "clamp(2.5rem, 7vw, 3.75rem)", fontWeight: 400, lineHeight: "1", marginRight: "clamp(0rem, 1vw, 1.125rem)", textShadow: "0 1px 8px rgba(255, 255, 240, 0.8)" }} >
              are getting married!
            </p>
            <p className="mt-3 mr-1 text-right text-sm font-semibold uppercase tracking-[0.35em] sm:mr-2 sm:text-base" style={{ color: themeColor, textShadow: "0 1px 8px rgba(255, 255, 240, 0.8)" }}>
              <span className="sm:hidden">06.12.27*</span>
              <span className="hidden sm:inline">June 12, 2027 (sample date)</span>
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
              unoptimized
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
                  unoptimized
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-[1.5rem] bg-white/70 shadow-sm">
                <Image
                  src="/images/story1.jpg"
                  alt="Story photo 1"
                  width={900}
                  height={1200}
                  unoptimized
                  className="h-56 w-full object-cover sm:h-72"
                />
              </div>
              <div className="overflow-hidden rounded-[1.5rem] bg-white/70 shadow-sm">
                <Image
                  src="/images/story4.jpg"
                  alt="Story photo 4"
                  width={900}
                  height={1200}
                  unoptimized
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
                unoptimized
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
            <div className="overflow-hidden rounded-[2rem] border border-[#521322]/15 bg-gray-50 px-5 py-4 shadow-sm sm:px-6">
              <div className="grid min-w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2 text-center text-[0.72rem] sm:gap-3 sm:text-[0.78rem]">
                <div className="min-w-0 flex flex-col items-center justify-start px-1.5">
                  <p className="text-2xl font-semibold sm:text-3xl" style={{ color: themeColor }}>{countdownDays}</p>
                  <span className="mt-2 text-[0.65rem] uppercase tracking-[0.22em] text-[#4b2d3d]">Days</span>
                </div>
                <span className="self-start mt-2 text-2xl font-semibold text-[#4b2d3d] sm:text-3xl">:</span>
                <div className="min-w-0 flex flex-col items-center justify-start px-1.5">
                  <p className="text-2xl font-semibold sm:text-3xl" style={{ color: themeColor }}>{countdownHours}</p>
                  <span className="mt-2 text-[0.65rem] uppercase tracking-[0.22em] text-[#4b2d3d]">Hours</span>
                </div>
                <span className="self-start mt-2 text-2xl font-semibold text-[#4b2d3d] sm:text-3xl">:</span>
                <div className="min-w-0 flex flex-col items-center justify-start px-1.5">
                  <p className="text-2xl font-semibold sm:text-3xl" style={{ color: themeColor }}>{countdownMinutes}</p>
                  <span className="mt-2 text-[0.65rem] uppercase tracking-[0.22em] text-[#4b2d3d]">Minutes</span>
                </div>
                <span className="self-start mt-2 text-2xl font-semibold text-[#4b2d3d] sm:text-3xl">:</span>
                <div className="min-w-0 flex flex-col items-center justify-start px-1.5">
                  <p className="text-2xl font-semibold sm:text-3xl" style={{ color: themeColor }}>{countdownSeconds}</p>
                  <span className="mt-2 text-[0.65rem] uppercase tracking-[0.22em] text-[#4b2d3d]">Seconds</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Details Section */}
      <section id="details" className="w-full flex items-center justify-center px-6 py-16" style={{ backgroundColor: ivoryColor }}>
        <div className="w-full max-w-4xl text-center">
          <p className="mb-4 text-xl font-extrabold uppercase tracking-[0.35em]" style={{ color: "#000000" }}>
            WEDDING DETAILS
          </p>
          <p className="mx-auto max-w-2xl text-lg md:text-xl font-light leading-relaxed mb-8" style={{ color: themeColor }}>
            Explore the venue, program, and our entourage through the tabs below.
          </p>
          <WeddingDetailsTabs />
        </div>
      </section>

      {/* Dress Code Section */}
      <section id="dress" className="min-h-screen w-full flex items-center justify-center px-6 py-20" style={{ backgroundColor: "#A78A9C" }}>
        <div className="w-full max-w-4xl rounded-[2rem] border border-white/40 bg-white/60 px-6 py-10 text-center shadow-lg backdrop-blur-sm sm:px-10 md:px-14 md:py-14">
          <p className="mb-4 text-xl font-extrabold uppercase tracking-[0.35em]" style={{ color: "#000000" }}>
            DRESS CODE
          </p>
          <div className="mx-auto max-w-3xl space-y-5 text-lg leading-relaxed" style={{ color: "#000000" }}>
            <p>
              [Add a short description of the dress code and the tone of your celebration.]
            </p>
            <p>
              [Add any specific attire guidance for your guests.]
            </p>
            <p>
              [Add any additional dress-code notes, or remove this paragraph.]
            </p>
          </div>

          <div className="mt-10 p-6 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.3em]" style={{ color: "#000000" }}>
              Dress Code Colors
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-start">
              {[
                { color: "#E4BEB4", name: "Sample Color 1" },
                { color: "#DA979B", name: "Sample Color 2" },
                { color: "#926063", name: "Sample Color 3" },
              ].map((swatch) => (
                <div key={swatch.color} className="flex flex-1 items-center justify-start gap-3 rounded-2xl bg-white/80 px-4 py-4 shadow-sm">
                  <div className="h-10 w-10 rounded-full" style={{ backgroundColor: swatch.color }} />
                  <div className="text-left">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: "#000000" }}>
                      {swatch.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Important Reminders Section */}
      <section id="faq" className="w-full flex items-center justify-center px-6 py-20" style={{ backgroundColor: ivoryColor }} >
        <div className="w-full max-w-5xl rounded-[2rem] border border-[#521322]/10 bg-white/80 px-6 py-10 shadow-lg backdrop-blur-sm sm:px-10 md:px-14 md:py-14">
          <div className="text-center">
            <p className="mb-4 text-xl font-extrabold uppercase tracking-[0.35em]" style={{ color: themeColor }}>
              WEDDING REMINDERS
            </p>
            <h2 className="text-1xl md:text-2xl font-light tracking-wide" style={{ color: themeColor }}>
              Please Read Before the Event
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed" style={{ color: themeColor }}>
              A few important notes to help make the day meaningful, respectful, and enjoyable for everyone.
            </p>
          </div>

          <div className="mt-10 space-y-6">
            {[
              {
                question: "What time should I arrive?",
                answer:
                  "[Add the recommended arrival time and any entry instructions.]",
              },
              {
                question: "Can I bring a plus one?",
                answer:
                  "[Explain your guest and plus-one policy.]",
              },
              {
                question: "Can I take photos during the ceremony?",
                answer:
                  "[Add your preferences for guest photography and video.]",
              },
              {
                question: "Are children welcome?",
                answer:
                  "[Add your note about children or age restrictions.]",
              },
              {
                question: "What if I can't attend?",
                answer:
                  "[Add instructions for guests who cannot attend in person.]",
              },
              {
                question: "Are there any event traditions guests should know about?",
                answer:
                  "[Add any event traditions or activities guests should know about.]",
              },
            ].map((item) => (
              <div key={item.question} className="rounded-[1.5rem] border border-[#521322]/10 bg-[#FFF1E1]/60 p-6 text-left shadow-sm">
                <p className="text-xl font-semibold" style={{ color: themeColor }}>
                  {item.question}
                </p>
                <p className="mt-3 text-base leading-relaxed" style={{ color: themeColor }}>
                  {item.answer}
                </p>
              </div>
            ))}
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

      {/* Gifts Section */}
      <section id="gifts" className="w-full flex items-center justify-center px-6 py-24" style={{ backgroundColor: "#FFF1E1" }}>
        <div className="w-full max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 tracking-wide" style={{ color: themeColor }}>
              A note on <span style={{ fontFamily: "var(--font-italianno)", fontSize: "2em", fontWeight: 700 }}>Gifts</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg md:text-xl font-light leading-relaxed" style={{ color: themeColor }}>
              Your presence at our celebration is the gift we truly treasure. [Add a note about gifts or your registry.]
            </p>
            <p className="mt-6 text-base font-medium tracking-[0.25em]" style={{ color: themeColor }}>
              [Add gift or registry details below, or remove this section.]
            </p>
          </div>

          <div className="grid gap-6">
            {[
              {
                image: "/images/bdo.jpg",
                accountNumber: "[Account Number]",
                accountName: "[Account Holder]",
                label: "BDO",
              },
              {
                image: "/images/unionbank.jpg",
                accountNumber: "[Account Number]",
                accountName: "[Account Holder]",
                label: "UnionBank",
              },
              {
                image: "/images/gcash.jpg",
                accountNumber: "[Account Number]",
                accountName: "[Account Holder]",
                label: "GCash",
              },
              {
                image: "/images/gotyme.jpg",
                accountNumber: "[Account Number]",
                accountName: "[Account Holder]",
                label: "GoTyme",
              },
            ].map((account) => (
              <div key={account.label} className="flex flex-col gap-4 rounded-[1.75rem] border border-[#521322]/15 bg-white/90 p-6 shadow-sm sm:flex-row sm:items-center">
                <div className="ml-3 sm:ml-0 flex h-28 w-28 sm:h-20 sm:w-20 flex-none items-center justify-center overflow-hidden rounded-xl bg-[#FFF1E1]/80">
                  <Image
                    src={account.image}
                    alt={`${account.label} logo`}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-h-20 flex flex-col justify-center text-left">
                  <p className="text-l font-bold uppercase tracking-[0.10em] leading-none" style={{ color: themeColor, lineHeight: "0.5" }}>
                    {account.label}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <p className="text-l font-medium" style={{ color: themeColor }}>
                      {account.accountNumber}
                    </p>
                    <button
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard.writeText(account.accountNumber);
                        setCopiedAccount(account.accountNumber);
                        window.setTimeout(() => setCopiedAccount((current) => (current === account.accountNumber ? null : current)), 2000);
                      }}
                      aria-label={`Copy ${account.label} account number`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#521322]/20 bg-[#521322] text-white transition-colors hover:bg-[#42101c]"
                    >
                      {copiedAccount === account.accountNumber ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-base leading-relaxed" style={{ color: themeColor }}>
                    Account Name: {account.accountName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="min-h-screen w-full flex items-center justify-center px-6 py-24"  style={{ backgroundColor: "#A78A9C" }}>
        <div className="w-full max-w-2xl">
          <form onSubmit={handleRsvpSubmit} className="bg-white shadow-lg rounded-3xl p-6 md:p-8 space-y-6">
            <div className="text-center mb-10">
            <p className="mb-4 text-xl font-extrabold uppercase tracking-[0.35em]" style={{ color: themeColor }}>
              RSVP
            </p>
              <p className="text-lg md:text-l font-light leading-relaxed" style={{ color: themeColor }}>
                We would love to know if you can celebrate with us.
              </p>
            </div>

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className={`w-full cursor-pointer rounded-full border px-4 py-3 text-center text-sm font-semibold transition-colors ${guest.attending === "yes" ? "text-white" : "border-gray-200"}`} style={{ borderColor: guest.attending === "yes" ? themeColor : undefined, backgroundColor: guest.attending === "yes" ? themeColor : undefined, color: guest.attending === "yes" ? "white" : themeColor }}>
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
                      <label className={`w-full cursor-pointer rounded-full border px-4 py-3 text-center text-sm font-semibold transition-colors ${guest.attending === "no" ? "text-white" : "border-gray-200"}`} style={{ borderColor: guest.attending === "no" ? themeColor : undefined, backgroundColor: guest.attending === "no" ? themeColor : undefined, color: guest.attending === "no" ? "white" : themeColor }}>
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
