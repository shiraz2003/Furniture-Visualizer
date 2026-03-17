import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { IoArrowForward, IoEyeOutline } from "react-icons/io5";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%25' height='100%25' fill='%23dedcff'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23050315' fill-opacity='0.4' font-family='Arial' font-weight='bold' font-size='16'>No Image</text></svg>";

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
      <div className="rounded-2xl border border-[#dedcff] bg-white p-6 shadow-sm">
        <div className="flex min-h-[250px] items-center justify-center text-center font-bold text-[#050315]/40 text-sm">
          No furniture data available
        </div>
      </div>
    );
  }

  return (
    <div className="group overflow-hidden rounded-2xl border border-[#dedcff] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(47,39,206,0.12)] hover:border-[#FBBF24]/30 flex flex-col h-full">
      
      {/* Image Section - Reduced Height */}
      <div className="relative h-[200px] overflow-hidden bg-[#fbfbfe] sm:h-[220px]">
        {imageLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#fbfbfe]">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#dedcff] border-t-[#FBBF24]"></div>
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

        {/* Category Badge */}
        <div className="absolute left-3 top-3 rounded-md bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-[#FBBF24] shadow-sm backdrop-blur-md border border-[#dedcff]/50">
          {furniture?.category || "Furniture"}
        </div>
      </div>

      {/* Content Section - Tighter Spacing */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        
        {/* Title */}
        <div className="mb-2">
          <h3 className="line-clamp-2 text-lg font-black leading-tight text-[#050315] group-hover:text-[#FBBF24] transition-colors">
            {furniture?.name || "Unnamed Furniture"}
          </h3>
        </div>

        {/* Details */}
        <div className="mb-4 space-y-1 text-xs text-[#050315]/60 flex-1">
          <p>
            <span className="font-bold text-[#050315]/80">Category:</span>{" "}
            {furniture?.category || "Unknown"}
          </p>
          {furniture?.dimensions && (
            <p className="truncate">
              <span className="font-bold text-[#050315]/80">Dimensions:</span>{" "}
              {furniture.dimensions}
            </p>
          )}
        </div>

        {/* Price & Action Area */}
        <div className="mt-auto">
            <div className="mb-4">
              <p className="mb-0.5 text-[9px] font-black uppercase tracking-widest text-[#050315]/40">
                Price
              </p>
              <p className="text-xl font-black text-[#FBBF24]">
                ${furniture?.price ? Number(furniture.price).toFixed(2) : "0.00"}
              </p>
            </div>

            <button
              onClick={() => navigate(`/furniture/${furniture._id}`)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#fbfbfe] border border-[#dedcff] px-4 py-2.5 text-xs font-bold text-[#050315] transition-all duration-300 hover:bg-[#FBBF24] hover:border-[#FBBF24] hover:text-white active:scale-95 group/btn"
            >
              <IoEyeOutline size={16} className="text-[#050315]/50 group-hover/btn:text-white transition-colors" />
              View Details
              <IoArrowForward size={14} className="opacity-0 -ml-4 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all duration-300" />
            </button>
        </div>

      </div>
    </div>
  );
}