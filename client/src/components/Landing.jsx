import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronForward } from "react-icons/io5";

export default function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const heroSlides = [
    {
      id: 1,
      image: "/landingone.png",
      subtitle: "PREMIUM INTERIOR COLLECTION",
      title: "Design Your Dream Space With Modern Furniture",
      description:
        "Discover elegant furniture pieces crafted to transform your home into a stylish and comfortable living space.",
    },
    {
      id: 2,
      image: "/landingtwo.jpeg",
      subtitle: "TIMELESS COMFORT",
      title: "Bring Luxury And Warmth Into Every Room",
      description:
        "Shop premium beds, tables, sofas, and décor designed for modern living and lasting comfort.",
    },
    {
      id: 3,
      image: "/landingthree.jpeg",
      subtitle: "MODERN LIVING",
      title: "Furniture That Matches Your Lifestyle",
      description:
        "From bedrooms to dining spaces, find pieces that combine beauty, quality, and everyday function.",
    },
    {
      id: 4,
      image: "/landingfour.jpeg",
      subtitle: "CRAFTED ELEGANCE",
      title: "Upgrade Your Home With Statement Pieces",
      description:
        "Create inviting spaces with furniture that feels premium, practical, and visually stunning.",
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, [heroSlides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  const activeSlide = heroSlides[currentSlide];

  return (
    <section className="relative w-full min-h-screen h-screen overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(
                to right,
                rgba(5, 8, 12, 0.86) 0%,
                rgba(5, 8, 12, 0.68) 28%,
                rgba(5, 8, 12, 0.42) 55%,
                rgba(5, 8, 12, 0.36) 100%
              ), linear-gradient(
                to top,
                rgba(0, 0, 0, 0.42) 0%,
                rgba(0, 0, 0, 0.10) 35%,
                rgba(0, 0, 0, 0.08) 100%
              ), url('${slide.image}')`,
            }}
          />
        </div>
      ))}

      <div className="relative z-20 flex h-full items-center">
        <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-16">
          <div className="max-w-[720px] pt-24 sm:pt-28">
            <p className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[9px] font-semibold tracking-[0.22em] text-violet-50 backdrop-blur-md sm:px-4 sm:text-[10px] md:text-[11px]">
              {activeSlide.subtitle}
            </p>

            <h1 className="mb-4 font-kufam text-[22px] font-bold leading-[1.12] text-white sm:text-[34px] md:text-[48px] lg:text-[72px]">
              {activeSlide.title}
            </h1>

            <p className="mb-6 max-w-[620px] text-[13px] leading-6 text-white/90 sm:text-sm sm:leading-7 md:text-base lg:text-lg">
              {activeSlide.description}
            </p>

            <button
              onClick={() => navigate("/furniture")}
              className="inline-flex min-w-[180px] items-center justify-center gap-2 rounded-xl bg-[#2f27ce] px-5 py-3 text-[13px] font-bold text-white transition hover:bg-[#2f27ce] active:scale-[0.98] sm:min-w-[200px] sm:px-6 sm:py-3.5 sm:text-sm md:min-w-[220px] md:px-7 md:py-4 md:text-base shadow-2xl"
            >
              Explore Collection
              <IoChevronForward className="shrink-0 text-[16px] sm:text-[18px]" />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2.5 sm:gap-3">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`rounded-full transition-all duration-300 ${
              i === currentSlide
                ? "h-2.5 w-9 bg-[#2f27ce] sm:w-10"
                : "h-2.5 w-2.5 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}