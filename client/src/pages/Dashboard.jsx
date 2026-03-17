import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { furnitureService } from "../services/furnitureService.js";
import Navbar from "../components/Navbar.jsx";
import Landing from "../components/Landing.jsx";
import FurnitureCard from "../components/furniturecard.jsx";
import { IoHome, IoChevronForward } from "react-icons/io5";
import { FaBed } from "react-icons/fa";
import { PiDeskFill } from "react-icons/pi";
import { GiSofa } from "react-icons/gi";
import { MdChairAlt } from "react-icons/md";
import Footer from "../components/footer.jsx";

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [popularFurniture, setPopularFurniture] = useState([]);
  const [allFurniture, setAllFurniture] = useState([]);
  const [furnitureLoading, setFurnitureLoading] = useState(true);
  const navigate = useNavigate();

  const categoryIcons = {
    All: <IoHome />,
    Sofa: <GiSofa />,
    Chair: <MdChairAlt />,
    Table: <PiDeskFill />,
    Desk: <PiDeskFill />,
    Bed: <FaBed />,
    Bedroom: <FaBed />,
    "Living Room": <GiSofa />,
    Dining: <PiDeskFill />,
  };

  const loadFurniture = useCallback(async () => {
    try {
      setFurnitureLoading(true);
      const [popular, all] = await Promise.all([
        furnitureService.getPopular(8),
        furnitureService.getAll(),
      ]);
      setPopularFurniture(popular || []);
      setAllFurniture(all || []);
    } catch (err) {
      console.error("Failed to load furniture", err);
    } finally {
      setFurnitureLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFurniture();
  }, [loadFurniture]);

  const getDynamicCategories = useMemo(() => {
    if (!allFurniture.length) {
      return [{ name: "All", icon: categoryIcons.All, count: "0 Items" }];
    }

    const categoryCount = allFurniture.reduce((acc, item) => {
      const category = item.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const categories = [
      {
        name: "All",
        icon: categoryIcons.All,
        count: `${allFurniture.length} Items`,
      },
    ];

    Object.entries(categoryCount).forEach(([category, count]) => {
      categories.push({
        name: category,
        icon: categoryIcons[category] || "📦",
        count: `${count} Items`,
      });
    });

    return categories;
  }, [allFurniture]);

  const getFilteredFurniture = (furnitureArray, limit = null) => {
    const filtered =
      activeCategory === "All"
        ? furnitureArray
        : furnitureArray.filter((item) => item.category === activeCategory);

    return limit ? filtered.slice(0, limit) : filtered;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <Navbar />
      <Landing />

      {/* CATEGORY SECTION */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8 lg:px-16">
        <div className="mb-10 flex flex-col items-center text-center">
          <span className="mb-3 inline-flex rounded-full bg-teal-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#0F766E]">
            Shop by Category
          </span>

          <h2 className="font-kufam text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
            Discover Furniture For Every Space
          </h2>

          <p className="mt-4 max-w-[680px] text-sm leading-7 text-slate-500 sm:text-base">
            Explore carefully selected categories designed to fit your lifestyle,
            from cozy bedrooms to stylish living spaces.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {getDynamicCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`group rounded-3xl border p-5 text-left transition-all duration-300 ${
                activeCategory === cat.name
                  ? "border-[#0F766E] bg-[#0F766E] text-white shadow-lg shadow-teal-900/10"
                  : "border-slate-200 bg-white text-slate-800 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
              }`}
            >
              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-[26px] transition-all ${
                  activeCategory === cat.name
                    ? "bg-white/15 text-white"
                    : "bg-slate-100 text-[#0F766E] group-hover:bg-teal-50"
                }`}
              >
                {cat.icon}
              </div>

              <h3 className="text-lg font-bold">{cat.name}</h3>
              <p
                className={`mt-1 text-sm ${
                  activeCategory === cat.name ? "text-white/80" : "text-slate-500"
                }`}
              >
                {cat.count}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* POPULAR PRODUCTS */}
      <section className="mx-auto max-w-[1440px] px-4 pb-20 sm:px-8 lg:px-16">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-3 inline-flex rounded-full bg-amber-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#B45309]">
              Featured Products
            </span>
            <h2 className="mt-2 font-kufam text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
              Popular Products
            </h2>
            <p className="mt-3 max-w-[560px] text-sm leading-7 text-slate-500 sm:text-base">
              Browse the most popular furniture picks curated for modern homes and stylish interiors.
            </p>
          </div>

          <button
            onClick={() =>
              navigate(
                `/furniture${
                  activeCategory !== "All"
                    ? `?category=${encodeURIComponent(activeCategory)}`
                    : ""
                }`
              )
            }
            className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:self-auto"
          >
            See all
            <IoChevronForward />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {furnitureLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[420px] animate-pulse rounded-3xl bg-slate-200"
              />
            ))
          ) : getFilteredFurniture(popularFurniture, 4).length > 0 ? (
            getFilteredFurniture(popularFurniture, 4).map((item) => (
              <FurnitureCard key={item._id} furniture={item} />
            ))
          ) : (
            <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
              No products found for this category.
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}