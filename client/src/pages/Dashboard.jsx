import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { designService } from "../services/designService.js";
import { furnitureService } from "../services/furnitureService.js";
import Navbar from "../components/Navbar.jsx";
import Furniture from "./furniture.jsx";
import FurnitureCard from "../components/furniturecard.jsx";
import { IoHome } from "react-icons/io5";
import { FaBed } from "react-icons/fa";
import { PiDeskFill } from "react-icons/pi";
import { GiSofa } from "react-icons/gi";

import Footer from "../components/footer.jsx";

export default function Dashboard() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDesignName, setNewDesignName] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [popularFurniture, setPopularFurniture] = useState([]);
  const [latestFurniture, setLatestFurniture] = useState([]);
  const [allFurniture, setAllFurniture] = useState([]);
  const [furnitureLoading, setFurnitureLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Hero carousel slides data
  const heroSlides = [
    {
      id: 1,
      image: "/carosel01.jpg",
      title: "Elevate Your Home Decor with Our Premium Furniture Collection",
      subtitle: "Transform Your Living Space",
      buttonText: "Shop Now",
    },
    {
      id: 2,
      image: "/carosel02.jpg",
      title: "Modern Comfort Meets Timeless Design",
      subtitle: "Discover Our Latest Collection",
      buttonText: "Explore",
    },
    {
      id: 3,
      image: "/Carosel03.jpg",
      title: "Create Your Perfect Living Space",
      subtitle: "Quality Furniture for Every Room",
      buttonText: "View Catalog",
    },
    {
      id: 4,
      image: "/carosel04.jpg",
      title: "Furniture That Tells Your Story",
      subtitle: "Personalized Interior Solutions",
      buttonText: "Get Started",
    },
  ];

  // Category icon mapping
  const categoryIcons = {
    Chair: <GiSofa />,
    Sofa: <GiSofa />,
    Table: <PiDeskFill />,
    Bed: <FaBed />,
    Lamp: "💡",
    Desk: <PiDeskFill />,
    Cabinet: "🗄️",
    Bookshelf: "📚",
    Dining: "🍽️",
    "Living Room": "🛋️",
    Bedroom: <FaBed />,
    Office: "🏢",
    All: <IoHome />,
  };

  // Generate dynamic categories from furniture data
  const getDynamicCategories = () => {
    if (!allFurniture.length)
      return [{ name: "All", icon: "🏠", count: "0 Items Available" }];

    // Count furniture by category
    const categoryCount = allFurniture.reduce((acc, item) => {
      const category = item.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    // Create category objects with All option
    const categories = [
      {
        name: "All",
        icon: categoryIcons["All"],
        count: `${allFurniture.length} Items Available`,
      },
    ];

    Object.entries(categoryCount).forEach(([category, count]) => {
      categories.push({
        name: category,
        icon: categoryIcons[category] || "📦", // Default icon for unknown categories
        count: `${count} ${count === 1 ? "Item" : "Items"} Available`,
      });
    });

    return categories;
  };

  // Filter furniture by selected category
  const getFilteredFurniture = (furnitureArray, limit = null) => {
    let filtered =
      activeCategory === "All"
        ? furnitureArray
        : furnitureArray.filter((item) => item.category === activeCategory);

    return limit ? filtered.slice(0, limit) : filtered;
  };

  useEffect(() => {
    loadDesigns();
    loadFurniture();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Carousel navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  async function loadDesigns() {
    try {
      setLoading(true);
      const data = await designService.list();
      setDesigns(data);
    } catch (err) {
      console.error("Failed to load designs", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadFurniture() {
    try {
      setFurnitureLoading(true);
      const [popular, latest, all] = await Promise.all([
        furnitureService.getPopular(4),
        furnitureService.getLatest(4),
        furnitureService.getAll(),
      ]);
      setPopularFurniture(popular);
      setLatestFurniture(latest);
      setAllFurniture(all);
    } catch (err) {
      console.error("Failed to load furniture", err);
    } finally {
      setFurnitureLoading(false);
    }
  }

  async function handleCreateDesign(e) {
    e.preventDefault();
    if (!newDesignName.trim()) return;
    try {
      const design = await designService.create({
        name: newDesignName,
        room: { width: 800, height: 600, gridSize: 50 },
        items: [],
      });
      setDesigns([design, ...designs]);
      setNewDesignName("");
      setShowCreateModal(false);
      navigate(`/editor-2d?id=${design._id}`);
    } catch (err) {
      alert("Failed to create design");
    }
  }

  async function handleDeleteDesign(id) {
    if (!window.confirm("Delete this design?")) return;
    try {
      await designService.remove(id);
      setDesigns(designs.filter((d) => d._id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  }

  async function handleDuplicateDesign(design) {
    try {
      const copy = await designService.create({
        name: `${design.name} (Copy)`,
        room: design.room,
        items: design.items,
      });
      setDesigns([copy, ...designs]);
    } catch (err) {
      alert("Failed to duplicate");
    }
  }

  const filteredDesigns = designs.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const recentCount = designs.filter((d) => {
    const updated = new Date(d.updatedAt);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return updated > weekAgo;
  }).length;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ===== HERO CAROUSEL SECTION ===== */}
      <section className="w-full h-[400px] sm:h-[500px] lg:h-[616px] -mt-[80px] relative overflow-hidden">
        {/* Carousel slides */}
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className="w-full h-full flex-shrink-0 relative flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat px-4"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${slide.image}')`,
              }}
            >
              <div className="text-center max-w-[900px] mx-auto">
                <p className="font-kufam font-normal text-[14px] sm:text-[16px] lg:text-[18px] leading-tight text-secondary mb-2 sm:mb-3 animate-fade-in">
                  {slide.subtitle}
                </p>
                <h1 className="font-kufam font-medium text-[28px] sm:text-[36px] lg:text-[48px] leading-tight text-center text-white px-4 mb-6 sm:mb-8 animate-slide-up">
                  {slide.title}
                </h1>
                <button
                  className="btn-primary animate-fade-in"
                  onClick={() => navigate("/furniture")}
                >
                  <span className="font-kufam font-medium text-[16px] sm:text-[18px] lg:text-[20px] leading-tight">
                    {slide.buttonText}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 sm:left-6 lg:left-8 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-2 sm:p-3 transition-all duration-300 group"
          aria-label="Previous slide"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-accent transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 sm:right-6 lg:right-8 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-2 sm:p-3 transition-all duration-300 group"
          aria-label="Next slide"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-accent transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white scale-110 shadow-lg"
                  : "bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slide counter */}
        <div className="absolute top-4 sm:top-6 lg:top-8 right-4 sm:right-6 lg:right-8 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1 sm:px-4 sm:py-2">
          <span className="text-white font-kufam text-[12px] sm:text-[14px]">
            {currentSlide + 1} / {heroSlides.length}
          </span>
        </div>
      </section>

      {/* ===== CATEGORY SECTION ===== */}
      <section className="max-w-[1440px] mx-auto pt-[20px] sm:pt-[30px] lg:pt-[40px] pb-[20px] sm:pb-[30px] lg:pb-[40px]">
        <h2 className="font-kufam font-medium text-[20px] sm:text-[22px] lg:text-[24px] leading-tight text-primary text-center mb-[20px] sm:mb-[30px] lg:mb-[40px] px-4">
          Category
        </h2>
        <div className="flex justify-start sm:justify-center gap-[15px] sm:gap-[20px] lg:gap-[25px] px-4 sm:px-[25px] lg:px-[50px] overflow-x-auto pb-4">
          {getDynamicCategories().map((cat) => (
            <div
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`min-w-[180px] sm:min-w-[200px] lg:min-w-[248px] h-[120px] sm:h-[140px] lg:h-[162px] rounded-[10px] flex flex-col items-center justify-center cursor-pointer transition-colors flex-shrink-0
                ${
                  activeCategory === cat.name
                    ? "bg-primary text-white shadow-primary"
                    : "bg-accent-50 text-primary shadow-soft border border-accent-200"
                }`}
            >
              <div
                className={`text-[28px] sm:text-[32px] lg:text-[40px] mb-[4px] sm:mb-[6px] ${
                  activeCategory === cat.name ? "text-white" : "text-primary"
                }`}
              >
                {cat.icon}
              </div>
              <p className="font-kufam font-medium text-[16px] sm:text-[18px] lg:text-[20px] leading-tight text-center px-2">
                {cat.name}
              </p>
              <p className="font-kufam font-normal text-[12px] sm:text-[13px] lg:text-[14px] leading-tight mt-[4px] sm:mt-[6px] text-center px-2">
                {cat.count}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== POPULAR PRODUCT ===== */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-[25px] lg:px-[50px] pb-[20px] sm:pb-[30px] lg:pb-[40px]">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-[20px] sm:mb-[30px] lg:mb-[40px] gap-4">
          <h2 className="font-kufam font-medium text-[20px] sm:text-[22px] lg:text-[24px] leading-tight text-primary">
            Popular Product
          </h2>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate(
                `/furniture${activeCategory !== "All" ? `?category=${encodeURIComponent(activeCategory)}` : ""}`,
              );
            }}
            className="font-kufam font-normal text-[16px] sm:text-[18px] lg:text-[20px] leading-tight text-secondary hover:text-primary hover:underline cursor-pointer self-start sm:self-auto transition-colors"
          >
            See all
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {furnitureLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="w-full min-h-[380px] sm:min-h-[400px] lg:min-h-[440px] bg-gray-200 animate-pulse rounded-[10px]"
              >
                <div className="w-full h-[200px] sm:h-[220px] lg:h-[240px] bg-gray-300 rounded-lg mx-auto mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2 mx-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-4 w-3/4 mx-4"></div>
                <div className="h-8 bg-gray-300 rounded mx-4"></div>
              </div>
            ))
          ) : getFilteredFurniture(popularFurniture, 4).length > 0 ? (
            getFilteredFurniture(popularFurniture, 4).map((furniture) => (
              <FurnitureCard key={furniture._id} furniture={furniture} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 text-[14px] sm:text-[16px]">
                {activeCategory === "All"
                  ? "No popular furniture available"
                  : `No ${activeCategory} furniture in popular section`}
              </p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
