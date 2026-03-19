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
import { MdChairAlt, MdTableRestaurant } from "react-icons/md";
import Footer from "../components/footer.jsx";

// Warning එක අයින් කිරීමට සහ performance වැඩි කිරීමට Icons object එක එලියට ගත්තා
const CATEGORY_ICONS = {
  All: <IoHome />,
  Sofa: <GiSofa />,
  Chair: <MdChairAlt />,
  Table: <MdTableRestaurant />,
  Desk: <PiDeskFill />,
  Bed: <FaBed />,
  Cupboard: <PiDeskFill />,
  Bedroom: <FaBed />,
  "Living Room": <GiSofa />,
  Dining: <PiDeskFill />,
};

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [allFurniture, setAllFurniture] = useState([]);
  const [furnitureLoading, setFurnitureLoading] = useState(true);
  const navigate = useNavigate();

  const loadFurniture = useCallback(async () => {
    try {
      setFurnitureLoading(true);
      const all = await furnitureService.getAll();
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
      return [{ name: "All", icon: CATEGORY_ICONS.All, count: "0 Items" }];
    }

    const categoryCount = allFurniture.reduce((acc, item) => {
      let category = item.category ? item.category.trim().toLowerCase() : "uncategorized";
      category = category.charAt(0).toUpperCase() + category.slice(1);
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const categories = [
      {
        name: "All",
        icon: CATEGORY_ICONS.All,
        count: `${allFurniture.length} Items`,
      },
    ];

    Object.entries(categoryCount).forEach(([category, count]) => {
      categories.push({
        name: category,
        icon: CATEGORY_ICONS[category] || "📦",
        count: `${count} Items`,
      });
    });

    return categories;
  }, [allFurniture]);

  const getFilteredFurniture = (furnitureArray, limit = null) => {
    const filtered =
      activeCategory === "All"
        ? furnitureArray
        : furnitureArray.filter((item) => {
            const itemCat = item.category ? item.category.trim().toLowerCase() : "";
            const activeCat = activeCategory.trim().toLowerCase();
            return itemCat === activeCat;
          });

    return limit ? filtered.slice(0, limit) : filtered;
  };

  const itemsToDisplay = getFilteredFurniture(allFurniture, 4);

  return (
    <div className="min-h-screen bg-[#fbfbfe] text-[#050315]">
      <Navbar />
      <Landing />

      {/* CATEGORY SECTION */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8 lg:px-16">
        <div className="mb-10 flex flex-col items-center text-center">
          <span className="mb-3 inline-flex rounded-full bg-[#dedcff] px-4 py-1.5 text-xs font-black uppercase tracking-[0.22em] text-[#2f27ce]">
            Shop by Category
          </span>

          <h2 className="text-2xl font-black text-[#050315] sm:text-3xl lg:text-4xl tracking-tight">
            Discover Furniture For Every Space
          </h2>

          <p className="mt-4 max-w-[680px] text-sm leading-7 text-[#050315]/60 sm:text-base">
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
                  ? "border-[#2f27ce] bg-[#2f27ce] text-[#fbfbfe] shadow-xl shadow-[#2f27ce]/20"
                  : "border-[#dedcff] bg-white text-[#050315] hover:-translate-y-1 hover:border-[#433bff]/50 hover:shadow-md"
              }`}
            >
              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-[26px] transition-all ${
                  activeCategory === cat.name
                    ? "bg-white/20 text-white"
                    : "bg-[#fbfbfe] text-[#2f27ce] group-hover:bg-[#dedcff]"
                }`}
              >
                {cat.icon}
              </div>

              <h3 className="text-lg font-black">{cat.name}</h3>
              <p
                className={`mt-1 text-sm font-bold ${
                  activeCategory === cat.name ? "text-[#fbfbfe]/70" : "text-[#050315]/40"
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
            <span className="mb-3 inline-flex rounded-full bg-[#dedcff] px-4 py-1.5 text-xs font-black uppercase tracking-[0.22em] text-[#433bff]">
              Featured Products
            </span>
            <h2 className="mt-2 text-2xl font-black text-[#050315] sm:text-3xl lg:text-4xl tracking-tight">
              Popular Selections
            </h2>
            <p className="mt-3 max-w-[560px] text-sm leading-7 text-[#050315]/60 sm:text-base">
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
            className="inline-flex items-center gap-2 self-start rounded-full border-2 border-[#2f27ce] bg-white px-6 py-3 text-sm font-black text-[#2f27ce] transition hover:bg-[#2f27ce] hover:text-white sm:self-auto active:scale-95"
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
                className="h-[420px] animate-pulse rounded-3xl bg-[#dedcff]/40"
              />
            ))
          ) : itemsToDisplay.length > 0 ? (
            itemsToDisplay.map((item) => (
              <FurnitureCard key={item._id} furniture={item} />
            ))
          ) : (
            <div className="col-span-full rounded-[2rem] border-2 border-dashed border-[#dedcff] bg-white p-12 text-center">
              <p className="text-[#050315]/40 font-black uppercase tracking-widest text-sm">
                No products found for this category.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}