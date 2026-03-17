import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { IoArrowForward, IoEyeOutline } from "react-icons/io5";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%25' height='100%25' fill='%23f1f5f9'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='Arial' font-size='20'>No Image</text></svg>";

const getFinalImage = (imageData) => {
  if (!imageData) return null;

  if (Array.isArray(imageData)) {
    return imageData.length > 0 ? imageData[imageData.length - 1] : null;
  }

  if (typeof imageData === "string") {
    try {
      const parsed = JSON.parse(imageData);
      if (Array.isArray(parsed)) {
        return parsed.length > 0 ? parsed[parsed.length - 1] : null;
      }
    } catch (e) {
      return imageData;
    }
    return imageData;
  }

  return null;
};

export default function FurnitureCard(props) {
  const furniture = props.furniture || props.item || {};
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const displayImage = useMemo(() => {
    return getFinalImage(furniture?.image);
  }, [furniture?.image]);

  useEffect(() => {
    setImageError(false);
    setImageLoading(true);

    const loadTimeout = setTimeout(() => {
      setImageLoading(false);
    }, 5000);

    return () => clearTimeout(loadTimeout);
  }, [displayImage]);

  if (!furniture || Object.keys(furniture).length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex min-h-[320px] items-center justify-center text-center text-slate-400">
          No furniture data available
        </div>
      </div>
    );
  }

  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative h-[260px] overflow-hidden bg-slate-100 sm:h-[280px]">
        {imageLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
          </div>
        )}

        <img
          key={displayImage || "fallback"}
          src={imageError || !displayImage ? FALLBACK_IMAGE : displayImage}
          alt={furniture?.name || "Furniture item"}
          className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
            imageLoading && displayImage && !imageError ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => {
            setImageLoading(false);
            setImageError(false);
          }}
          onError={() => {
            setImageError(true);
            setImageLoading(false);
          }}
        />

        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#0F766E] shadow-sm backdrop-blur-md">
          {furniture?.category || "Furniture"}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-3">
          <h3 className="line-clamp-2 text-xl font-bold text-slate-900">
            {furniture?.name || "Unnamed Furniture"}
          </h3>
        </div>

        <div className="mb-5 space-y-2 text-sm text-slate-500">
          <p>
            <span className="font-semibold text-slate-700">Category:</span>{" "}
            {furniture?.category || "Unknown"}
          </p>

          {furniture?.dimensions && (
            <p>
              <span className="font-semibold text-slate-700">Dimensions:</span>{" "}
              {furniture.dimensions}
            </p>
          )}
        </div>

        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
              Price
            </p>
            <p className="text-2xl font-bold text-[#0F766E]">
              Rs.{furniture?.price ? Number(furniture.price).toFixed(2) : "0.00"}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/furniture/${furniture._id}`)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
        >
          <IoEyeOutline size={18} />
          View Details
          <IoArrowForward size={18} />
        </button>
      </div>
    </div>
  );
}