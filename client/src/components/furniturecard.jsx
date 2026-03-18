import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react"; // useEffect දැන් ඕනේ නැහැ
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
    } catch {
      return imageData;
    }
    return imageData;
  }

  return null;
};

export default function FurnitureCard(props) {
  const furniture = props.furniture || props.item || {};
  const navigate = useNavigate();
  
  const displayImage = useMemo(() => {
    return getFinalImage(furniture?.image);
  }, [furniture?.image]);

  // useEffect ඇතුළේ setState කරනවා වෙනුවට, කෙලින්ම initial value එක මෙහෙම දෙන්න
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(!!displayImage); 

  if (!furniture || Object.keys(furniture).length === 0) {
    return (
      <div className="rounded-2xl border border-[#dedcff] bg-white p-6 shadow-sm">
        <div className="flex min-h-[250px] items-center justify-center text-center font-bold text-[#050315]/40 text-sm uppercase tracking-widest">
          No furniture data
        </div>
      </div>
    );
  }

  return (
    <div className="group overflow-hidden rounded-[1.5rem] border border-[#dedcff]/60 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#2f27ce]/5 hover:border-[#2f27ce]/30 flex flex-col h-full">
      
      {/* Image Section */}
      <div className="relative h-[200px] overflow-hidden bg-[#fbfbfe] sm:h-[220px]">
        {imageLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#fbfbfe]">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#dedcff] border-t-[#2f27ce]"></div>
          </div>
        )}

        <img
          key={displayImage || "fallback"} // Image එක මාරු වන විට state එක reset වීමට මෙය උදව් වේ
          src={imageError || !displayImage ? FALLBACK_IMAGE : displayImage}
          alt={furniture?.name || "Furniture item"}
          className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-110 ${
            imageLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageError(true);
            setImageLoading(false);
          }}
        />

        <div className="absolute left-3 top-3 rounded-lg bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#2f27ce] shadow-sm backdrop-blur-md border border-[#dedcff]/50">
          {furniture?.category || "Furniture"}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="line-clamp-2 text-lg font-black leading-tight text-[#050315] group-hover:text-[#2f27ce] transition-colors duration-300">
            {furniture?.name || "Unnamed Furniture"}
          </h3>
        </div>

        <div className="mb-6 space-y-1.5 text-[11px] font-bold uppercase tracking-wide text-[#050315]/40 flex-1">
          <p className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-[#2f27ce]"></span>
            {furniture?.category || "General"}
          </p>
          {furniture?.dimensions && (
            <p className="flex items-center gap-2 truncate">
              <span className="h-1 w-1 rounded-full bg-[#dedcff]"></span>
              {furniture.dimensions}
            </p>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-[#dedcff]/40">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="mb-0.5 text-[9px] font-black uppercase tracking-[0.2em] text-[#050315]/30">
                  Price
                </p>
                <p className="text-xl font-black text-[#050315]">
                  Rs. {furniture?.price ? Number(furniture.price).toLocaleString() : "0.00"}
                </p>
              </div>
              <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">
                Available
              </div>
            </div>

            <button
              onClick={() => navigate(`/furniture/${furniture._id}`)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2f27ce] px-4 py-3 text-xs font-black uppercase tracking-widest text-white transition-all duration-300 hover:bg-[#433bff] hover:shadow-lg hover:shadow-[#2f27ce]/20 active:scale-95 group/btn"
            >
              <IoEyeOutline size={16} className="transition-transform group-hover/btn:scale-110" />
              View Item
              <IoArrowForward size={14} className="transition-all duration-300 group-hover/btn:translate-x-1" />
            </button>
        </div>
      </div>
    </div>
  );
}