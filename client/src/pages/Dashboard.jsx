import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { designService } from "../services/designService.js";
import { furnitureService } from "../services/furnitureService.js";
import Navbar from "../components/Navbar.jsx";
import Furniture from "./furniture.jsx";
import FurnitureCard from "../components/FurnitureCard.jsx";
import { IoHome } from "react-icons/io5";
import { FaBed } from "react-icons/fa";
import { PiDeskFill } from "react-icons/pi";
import { GiSofa } from "react-icons/gi"

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
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section
        className="w-full h-[616px] -mt-[80px] relative flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1440&h=696&fit=crop')`,
        }}
      >
        <h1 className="font-kufam font-medium text-[48px] leading-[62px] text-center text-[#F5F5F5] max-w-[824px] px-4">
          Elevate Your Home Decor with Our Premium Furniture Collection
        </h1>
        <button className="mt-[18px] w-[192px] h-[59px] bg-white rounded-[5px] flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
          <span className="font-kufam font-medium text-[24px] leading-[31px] text-black">
            Contact Us
          </span>
        </button>
      </section>

      {/* ===== CATEGORY SECTION ===== */}
      <section className="max-w-[1440px] mx-auto pt-[40px] pb-[40px] ">
        <h2 className="font-kufam font-medium text-[24px] leading-[31px] text-black text-center mb-[40px] ">
          Category
        </h2>
        <div className="flex justify-center gap-[25px] px-[50px] overflow-x-auto p-6">
          {getDynamicCategories().map((cat) => (
            <div
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`min-w-[248px] h-[162px] rounded-[10px] flex flex-col items-center justify-center cursor-pointer transition-colors
                ${
                  activeCategory === cat.name
                    ? "bg-[#527A9A] text-white shadow-[0_0_16px_rgba(9,43,66,0.25)]"
                    : "bg-[#F7FBFF] text-black shadow-[0_0_16px_rgba(9,43,66,0.25)]"
                }`}
            >
              <div
                className={`text-[40px] mb-[6px] ${
                  activeCategory === cat.name ? "text-white" : "text-[#092B42]"
                }`}
              >
                {cat.icon}
              </div>
              <p className="font-kufam font-medium text-[20px] leading-[26px] text-center">
                {cat.name}
              </p>
              <p className="font-kufam font-normal text-[14px] leading-[18px] mt-[6px] text-center">
                {cat.count}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== POPULAR PRODUCT ===== */}
      <section className="max-w-[1440px] mx-auto px-[50px] pb-[40px]">
        <div className="flex justify-between items-center mb-[40px]">
          <h2 className="font-kufam font-medium text-[24px] leading-[31px] text-black">
            Popular Product
          </h2>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate(
                "/furniture"
              );
            }}
            className="font-kufam font-normal text-[20px] leading-[26px] text-black hover:underline cursor-pointer"
          >
            See all
          </a>
        </div>
        <div className="flex justify-between gap-6">
          {furnitureLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="w-[308px] min-h-[440px] bg-gray-200 animate-pulse rounded-[10px]"
              >
                <div className="w-[240px] h-[240px] bg-gray-300 rounded-lg mx-auto mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
            ))
          ) : getFilteredFurniture(popularFurniture, 4).length > 0 ? (
            getFilteredFurniture(popularFurniture, 4).map((furniture) => (
              <FurnitureCard key={furniture._id} furniture={furniture} />
            ))
          ) : (
            <div className="w-full text-center py-8">
              <p className="text-gray-500">
                {activeCategory === "All"
                  ? "No popular furniture available"
                  : `No ${activeCategory} furniture in popular section`}
              </p>
            </div>
          )}
        </div>
      </section>

      
    </div>
  );
}
