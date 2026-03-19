import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDesign } from "../context/DesignContext"; // Import your context
import api from "../services/api";

export default function SavedDesigns() {
  const [designs, setDesigns] = useState([]);
  const navigate = useNavigate();
  
  // Get the setters from your context
  const { setRoom, setItems, setDesignName } = useDesign();

  useEffect(() => {
    api
      .get("/designs")
      .then((res) => setDesigns(res.data))
      .catch((err) => console.error("Error fetching designs:", err));
  }, []);

  const loadDesign = (design) => {
    const normalizedItems = Array.isArray(design.items)
      ? design.items.map((item, index) => ({
          ...item,
          id: item?.id || `${design._id}-item-${index}`,
        }))
      : [];

    // 1. Overwrite current workspace with the saved room and items
    setRoom(design.room);
    setItems(normalizedItems);
    setDesignName(design.name || "My Design");
    
    // 2. Redirect back to the 3D Viewer to see the loaded design!
    navigate("/viewer-3d");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>My Saved Designs</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
        {designs.map((design) => (
          <div key={design._id} style={{ border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}>
            
            {/* Display Thumbnail */}
            {design.thumbnail ? (
              <img 
                src={design.thumbnail} 
                alt={design.name} 
                style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }} 
              />
            ) : (
               <div style={{ height: "200px", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
                No Image
              </div>
            )}

            <div style={{ padding: "1rem" }}>
              <h3 style={{ margin: "0 0 10px 0" }}>{design.name}</h3>
              <p style={{ margin: "5px 0" }}>Room: {design.room.width}m x {design.room.length}m</p>
              <p style={{ margin: "5px 0 15px 0" }}>Items: {design.items.length}</p>
              <button 
                onClick={() => loadDesign(design)}
                style={{ background: "#3498db", color: "white", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", width: "100%" }}
              >
                Load Design
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}