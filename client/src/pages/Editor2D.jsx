// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDesign } from "../context/DesignContext";
// import {
//   getModelById,
//   getFurnitureModels,
//   getFurnitureCategories,
// } from "../utils/modelRegistry";
// import toast from "react-hot-toast";
// import Navbar from "../components/Navbar";

// // Constants
// const CANVAS_WIDTH = 800;
// const CANVAS_HEIGHT = 600;
// const GRID_SIZE_METERS = 0.1; // 10cm grid
// const MIN_SCALE = 0.5;
// const MAX_SCALE = 2.0;

// export default function Editor2D() {
//   const navigate = useNavigate();
//   const canvasRef = useRef(null);
//   const {
//     room,
//     items,
//     addItem,
//     updateItem,
//     deleteItem,
//     selectedItemId,
//     setSelectedItemId,
//     clearItems,
//   } = useDesign();

//   // Local state
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
//   const [placingModelId, setPlacingModelId] = useState(null);
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [isOutOfBounds, setIsOutOfBounds] = useState(false);

//   // Calculate scale: pixels per meter
//   // Use the same scale for both axes to maintain proportions
//   const scaleX = CANVAS_WIDTH / room.width;
//   const scaleZ = CANVAS_HEIGHT / room.length;
//   const pixelsPerMeter = Math.min(scaleX, scaleZ) * 0.85; // 85% to leave padding

//   // Room dimensions in pixels
//   const roomPixelWidth = room.width * pixelsPerMeter;
//   const roomPixelHeight = room.length * pixelsPerMeter;

//   // Offset to center the room in canvas
//   const offsetX = (CANVAS_WIDTH - roomPixelWidth) / 2;
//   const offsetY = (CANVAS_HEIGHT - roomPixelHeight) / 2;

//   // Convert meters to canvas pixels
//   const metersToPixels = (xMeters, zMeters) => ({
//     px: offsetX + xMeters * pixelsPerMeter,
//     py: offsetY + zMeters * pixelsPerMeter,
//   });

//   // Convert canvas pixels to meters
//   const pixelsToMeters = (px, py) => ({
//     x: (px - offsetX) / pixelsPerMeter,
//     z: (py - offsetY) / pixelsPerMeter,
//   });

//   // Snap to grid (in meters)
//   const snapToGrid = (value) => {
//     return Math.round(value / GRID_SIZE_METERS) * GRID_SIZE_METERS;
//   };

//   // Check if position is within room bounds
//   const isWithinBounds = (x, z, modelSize) => {
//     const halfW = (modelSize?.w || 0.5) / 2;
//     const halfD = (modelSize?.d || 0.5) / 2;
//     return (
//       x - halfW >= 0 &&
//       x + halfW <= room.width &&
//       z - halfD >= 0 &&
//       z + halfD <= room.length
//     );
//   };

//   // Clamp position to room bounds
//   const clampToBounds = (x, z, modelSize) => {
//     const halfW = (modelSize?.w || 0.5) / 2;
//     const halfD = (modelSize?.d || 0.5) / 2;
//     return {
//       x: Math.max(halfW, Math.min(x, room.width - halfW)),
//       z: Math.max(halfD, Math.min(z, room.length - halfD)),
//     };
//   };

//   // Get furniture models filtered by category
//   const furnitureModels = getFurnitureModels();
//   const categories = ["all", ...getFurnitureCategories()];
//   const filteredModels =
//     categoryFilter === "all"
//       ? furnitureModels
//       : furnitureModels.filter((m) => m.category === categoryFilter);

//   // Handle canvas click (place new item)
//   const handleCanvasClick = (e) => {
//     if (!placingModelId) return;

//     const rect = canvasRef.current.getBoundingClientRect();
//     const px = e.clientX - rect.left;
//     const py = e.clientY - rect.top;
//     const { x, z } = pixelsToMeters(px, py);

//     const model = getModelById(placingModelId);
//     const snappedX = snapToGrid(x);
//     const snappedZ = snapToGrid(z);

//     console.log(
//       `Placing ${model?.name} at meters: x=${snappedX.toFixed(2)}, z=${snappedZ.toFixed(2)} | Room: ${room.width}x${room.length}`,
//     );

//     if (!isWithinBounds(snappedX, snappedZ, model?.size)) {
//       toast.error("Cannot place outside room boundary");
//       return;
//     }

//     addItem({
//       modelId: placingModelId,
//       x: snappedX,
//       z: snappedZ,
//       rotation: 0,
//       scale: 1,
//     });

//     toast.success(
//       `Placed ${model?.name} at (${snappedX.toFixed(1)}m, ${snappedZ.toFixed(1)}m)`,
//     );
//     setPlacingModelId(null);
//   };

//   // Handle item mouse down (start drag)
//   const handleItemMouseDown = (e, item) => {
//     e.stopPropagation();
//     setSelectedItemId(item.id);
//     setIsDragging(true);

//     const rect = canvasRef.current.getBoundingClientRect();
//     const { px, py } = metersToPixels(item.x, item.z);
//     setDragOffset({
//       x: e.clientX - rect.left - px,
//       y: e.clientY - rect.top - py,
//     });
//   };

//   // Handle mouse move (dragging)
//   const handleMouseMove = (e) => {
//     if (!isDragging || !selectedItemId) return;

//     const rect = canvasRef.current.getBoundingClientRect();
//     const px = e.clientX - rect.left - dragOffset.x;
//     const py = e.clientY - rect.top - dragOffset.y;
//     const { x, z } = pixelsToMeters(px, py);

//     const item = items.find((i) => i.id === selectedItemId);
//     const model = getModelById(item?.modelId);

//     const snappedX = snapToGrid(x);
//     const snappedZ = snapToGrid(z);

//     // Check bounds
//     const inBounds = isWithinBounds(snappedX, snappedZ, model?.size);
//     setIsOutOfBounds(!inBounds);

//     // Clamp and update
//     const clamped = clampToBounds(snappedX, snappedZ, model?.size);
//     updateItem(selectedItemId, { x: clamped.x, z: clamped.z });
//   };

//   // Handle mouse up (end drag)
//   const handleMouseUp = () => {
//     if (isDragging && isOutOfBounds) {
//       toast.error("Item clamped to room boundary");
//     }
//     setIsDragging(false);
//     setIsOutOfBounds(false);
//   };

//   // Handle rotation
//   const handleRotate = (degrees) => {
//     if (!selectedItemId) return;
//     const item = items.find((i) => i.id === selectedItemId);
//     if (item) {
//       updateItem(selectedItemId, { rotation: (item.rotation + degrees) % 360 });
//       toast.success(`Rotated ${degrees}°`);
//     }
//   };

//   // Handle scale change
//   const handleScaleChange = (delta) => {
//     if (!selectedItemId) return;
//     const item = items.find((i) => i.id === selectedItemId);
//     if (item) {
//       const newScale = Math.max(
//         MIN_SCALE,
//         Math.min(MAX_SCALE, item.scale + delta),
//       );
//       updateItem(selectedItemId, { scale: newScale });
//     }
//   };

//   // Handle delete
//   const handleDelete = () => {
//     if (!selectedItemId) return;
//     const item = items.find((i) => i.id === selectedItemId);
//     const model = getModelById(item?.modelId);
//     deleteItem(selectedItemId);
//     toast.success(`Deleted ${model?.name || "item"}`);
//   };

//   // Handle keyboard shortcuts
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "Delete" || e.key === "Backspace") {
//         handleDelete();
//       } else if (e.key === "Escape") {
//         setPlacingModelId(null);
//         setSelectedItemId(null);
//       } else if (e.key === "r" || e.key === "R") {
//         handleRotate(90);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [selectedItemId, items]);

//   // Get selected item details
//   const selectedItem = items.find((i) => i.id === selectedItemId);
//   const selectedModel = selectedItem
//     ? getModelById(selectedItem.modelId)
//     : null;

//   return (
//     <div style={styles.pageContainer}>
//       <Navbar />
//       <div style={styles.container}>
//         {/* Left Panel - Furniture Palette */}
//         <div style={styles.leftPanel}>
//           <h2 style={styles.panelTitle}>Furniture</h2>

//           {/* Category Filter */}
//           <div style={styles.categoryFilter}>
//             {categories.map((cat) => (
//               <button
//                 key={cat}
//                 onClick={() => setCategoryFilter(cat)}
//                 style={{
//                   ...styles.categoryButton,
//                   background: categoryFilter === cat ? "#667eea" : "#f0f0f0",
//                   color: categoryFilter === cat ? "#fff" : "#333",
//                 }}
//               >
//                 {cat.charAt(0).toUpperCase() + cat.slice(1)}
//               </button>
//             ))}
//           </div>

//           {/* Furniture List */}
//           <div style={styles.furnitureList}>
//             {filteredModels.map((model) => (
//               <div
//                 key={model.id}
//                 onClick={() => setPlacingModelId(model.id)}
//                 style={{
//                   ...styles.furnitureItem,
//                   background: placingModelId === model.id ? "#667eea" : "#fff",
//                   color: placingModelId === model.id ? "#fff" : "#333",
//                 }}
//               >
//                 <div style={styles.furnitureName}>{model.name}</div>
//                 <div
//                   style={{
//                     ...styles.furnitureSize,
//                     color: placingModelId === model.id ? "#ddd" : "#888",
//                   }}
//                 >
//                   {model.size?.w}m × {model.size?.d}m × {model.size?.h}m
//                 </div>
//               </div>
//             ))}
//           </div>

//           {placingModelId && (
//             <div style={styles.placingInfo}>
//               Click on canvas to place:{" "}
//               <strong>{getModelById(placingModelId)?.name}</strong>
//               <button
//                 onClick={() => setPlacingModelId(null)}
//                 style={styles.cancelButton}
//               >
//                 Cancel
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Center - Canvas */}
//         <div style={styles.centerPanel}>
//           <div style={styles.canvasHeader}>
//             <h2 style={styles.panelTitle}>2D Editor</h2>
//             <div style={styles.roomInfo}>
//               Room: {room.width}m × {room.length}m | Scale: 1m ={" "}
//               {pixelsPerMeter.toFixed(0)}px
//             </div>
//           </div>

//           <div
//             ref={canvasRef}
//             onClick={handleCanvasClick}
//             onMouseMove={handleMouseMove}
//             onMouseUp={handleMouseUp}
//             onMouseLeave={handleMouseUp}
//             style={{
//               ...styles.canvas,
//               cursor: placingModelId ? "crosshair" : "default",
//             }}
//           >
//             {/* Room Floor */}
//             <div
//               style={{
//                 position: "absolute",
//                 left: offsetX,
//                 top: offsetY,
//                 width: roomPixelWidth,
//                 height: roomPixelHeight,
//                 backgroundColor: room.floorColor,
//                 border: `3px solid ${room.wallColor}`,
//                 boxSizing: "border-box",
//               }}
//             >
//               {/* Grid Lines - 0.5m spacing for visibility */}
//               <svg
//                 width={roomPixelWidth}
//                 height={roomPixelHeight}
//                 style={{
//                   position: "absolute",
//                   top: 0,
//                   left: 0,
//                   pointerEvents: "none",
//                 }}
//               >
//                 {/* Vertical grid lines every 0.5m */}
//                 {Array.from({ length: Math.floor(room.width / 0.5) + 1 }).map(
//                   (_, i) => (
//                     <line
//                       key={`v${i}`}
//                       x1={i * 0.5 * pixelsPerMeter}
//                       y1={0}
//                       x2={i * 0.5 * pixelsPerMeter}
//                       y2={roomPixelHeight}
//                       stroke="rgba(0,0,0,0.08)"
//                       strokeWidth="1"
//                     />
//                   ),
//                 )}
//                 {/* Horizontal grid lines every 0.5m */}
//                 {Array.from({ length: Math.floor(room.length / 0.5) + 1 }).map(
//                   (_, i) => (
//                     <line
//                       key={`h${i}`}
//                       x1={0}
//                       y1={i * 0.5 * pixelsPerMeter}
//                       x2={roomPixelWidth}
//                       y2={i * 0.5 * pixelsPerMeter}
//                       stroke="rgba(0,0,0,0.08)"
//                       strokeWidth="1"
//                     />
//                   ),
//                 )}
//                 {/* 1m grid lines (thicker) */}
//                 {Array.from({ length: Math.floor(room.width) + 1 }).map(
//                   (_, i) => (
//                     <line
//                       key={`vm${i}`}
//                       x1={i * pixelsPerMeter}
//                       y1={0}
//                       x2={i * pixelsPerMeter}
//                       y2={roomPixelHeight}
//                       stroke="rgba(0,0,0,0.15)"
//                       strokeWidth="1"
//                     />
//                   ),
//                 )}
//                 {Array.from({ length: Math.floor(room.length) + 1 }).map(
//                   (_, i) => (
//                     <line
//                       key={`hm${i}`}
//                       x1={0}
//                       y1={i * pixelsPerMeter}
//                       x2={roomPixelWidth}
//                       y2={i * pixelsPerMeter}
//                       stroke="rgba(0,0,0,0.15)"
//                       strokeWidth="1"
//                     />
//                   ),
//                 )}
//               </svg>

//               {/* Dimension labels */}
//               <div
//                 style={{
//                   position: "absolute",
//                   bottom: "-25px",
//                   left: "50%",
//                   transform: "translateX(-50%)",
//                   color: "#aaa",
//                   fontSize: "12px",
//                 }}
//               >
//                 {room.width}m
//               </div>
//               <div
//                 style={{
//                   position: "absolute",
//                   right: "-35px",
//                   top: "50%",
//                   transform: "translateY(-50%) rotate(90deg)",
//                   color: "#aaa",
//                   fontSize: "12px",
//                 }}
//               >
//                 {room.length}m
//               </div>
//             </div>

//             {/* Placed Items */}
//             {items.map((item) => {
//               const model = getModelById(item.modelId);
//               const { px, py } = metersToPixels(item.x, item.z);
//               const itemW =
//                 (model?.size?.w || 0.5) * pixelsPerMeter * item.scale;
//               const itemH =
//                 (model?.size?.d || 0.5) * pixelsPerMeter * item.scale;
//               const isSelected = item.id === selectedItemId;

//               // Color by category
//               const categoryColors = {
//                 seating: "#8b4513",
//                 bedroom: "#4a6fa5",
//                 table: "#6b8e23",
//                 decor: "#9370db",
//                 lighting: "#ffd700",
//               };
//               const itemColor = categoryColors[model?.category] || "#666";

//               return (
//                 <div
//                   key={item.id}
//                   onMouseDown={(e) => handleItemMouseDown(e, item)}
//                   style={{
//                     position: "absolute",
//                     left: px - itemW / 2,
//                     top: py - itemH / 2,
//                     width: itemW,
//                     height: itemH,
//                     backgroundColor: isSelected ? "#667eea" : itemColor,
//                     border: isSelected
//                       ? "3px solid #fff"
//                       : "2px solid rgba(0,0,0,0.3)",
//                     borderRadius: "4px",
//                     transform: `rotate(${item.rotation}deg)`,
//                     cursor: "move",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     boxShadow: isSelected
//                       ? "0 0 12px rgba(102,126,234,0.6)"
//                       : "0 2px 4px rgba(0,0,0,0.2)",
//                     zIndex: isSelected ? 100 : 1,
//                     transition: isDragging ? "none" : "box-shadow 0.2s",
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontSize: Math.max(9, Math.min(12, itemW / 8)) + "px",
//                       color: "#fff",
//                       textAlign: "center",
//                       transform: `rotate(-${item.rotation}deg)`,
//                       pointerEvents: "none",
//                       textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
//                       lineHeight: "1.2",
//                       padding: "2px",
//                     }}
//                   >
//                     {model?.name}
//                   </span>
//                 </div>
//               );
//             })}

//             {/* Out of bounds indicator */}
//             {isOutOfBounds && (
//               <div style={styles.outOfBoundsWarning}>⚠️ Outside boundary!</div>
//             )}
//           </div>

//           {/* Canvas Actions */}
//           <div style={styles.canvasActions}>
//             <button onClick={clearItems} style={styles.actionButton}>
//               🗑️ Clear All
//             </button>
//             <div style={styles.itemCount}>
//               {items.length} item{items.length !== 1 ? "s" : ""} placed
//             </div>
//             <button
//               onClick={() => navigate("/viewer-3d")}
//               style={styles.primaryButton}
//             >
//               View in 3D →
//             </button>
//           </div>
//         </div>

//         {/* Right Panel - Properties */}
//         <div style={styles.rightPanel}>
//           <h2 style={styles.panelTitle}>Properties</h2>

//           {selectedItem ? (
//             <div style={styles.propertiesContent}>
//               <div style={styles.propertyGroup}>
//                 <label style={styles.propertyLabel}>Item</label>
//                 <div style={styles.propertyValue}>{selectedModel?.name}</div>
//               </div>

//               <div style={styles.propertyGroup}>
//                 <label style={styles.propertyLabel}>Category</label>
//                 <div style={styles.propertyValue}>
//                   {selectedModel?.category}
//                 </div>
//               </div>

//               <div style={styles.propertyGroup}>
//                 <label style={styles.propertyLabel}>Size (W × D × H)</label>
//                 <div style={styles.propertyValue}>
//                   {selectedModel?.size?.w}m × {selectedModel?.size?.d}m ×{" "}
//                   {selectedModel?.size?.h}m
//                 </div>
//               </div>

//               <div style={styles.propertyGroup}>
//                 <label style={styles.propertyLabel}>Position (meters)</label>
//                 <div style={styles.propertyValue}>
//                   X: {selectedItem.x.toFixed(2)}m, Z:{" "}
//                   {selectedItem.z.toFixed(2)}m
//                 </div>
//               </div>

//               <div style={styles.propertyGroup}>
//                 <label style={styles.propertyLabel}>Rotation</label>
//                 <div style={styles.rotationControls}>
//                   <button
//                     onClick={() => handleRotate(-45)}
//                     style={styles.controlButton}
//                   >
//                     -45°
//                   </button>
//                   <span style={styles.rotationValue}>
//                     {selectedItem.rotation}°
//                   </span>
//                   <button
//                     onClick={() => handleRotate(45)}
//                     style={styles.controlButton}
//                   >
//                     +45°
//                   </button>
//                 </div>
//               </div>

//               <div style={styles.propertyGroup}>
//                 <label style={styles.propertyLabel}>Scale</label>
//                 <div style={styles.scaleControls}>
//                   <button
//                     onClick={() => handleScaleChange(-0.1)}
//                     style={styles.controlButton}
//                   >
//                     -
//                   </button>
//                   <span style={styles.scaleValue}>
//                     {selectedItem.scale.toFixed(1)}x
//                   </span>
//                   <button
//                     onClick={() => handleScaleChange(0.1)}
//                     style={styles.controlButton}
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>

//               <button onClick={handleDelete} style={styles.deleteButton}>
//                 🗑️ Delete Item
//               </button>
//             </div>
//           ) : (
//             <div style={styles.noSelection}>
//               <p>Select an item to edit its properties</p>
//               <p style={{ fontSize: "12px", marginTop: "10px" }}>
//                 Or click a furniture item from the left panel to place it
//               </p>
//             </div>
//           )}

//           <div style={styles.shortcuts}>
//             <h3 style={styles.shortcutsTitle}>Keyboard Shortcuts</h3>
//             <div style={styles.shortcutItem}>
//               <kbd style={styles.kbd}>R</kbd> Rotate 90°
//             </div>
//             <div style={styles.shortcutItem}>
//               <kbd style={styles.kbd}>Del</kbd> Delete
//             </div>
//             <div style={styles.shortcutItem}>
//               <kbd style={styles.kbd}>Esc</kbd> Deselect / Cancel
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   pageContainer: {
//     minHeight: "100vh",
//     display: "flex",
//     flexDirection: "column",
//     background: "#1a1a2e",
//   },
//   container: {
//     display: "flex",
//     flex: 1,
//     minHeight: 0,
//   },
//   leftPanel: {
//     width: "250px",
//     background: "#16213e",
//     padding: "20px",
//     overflowY: "auto",
//     borderRight: "1px solid #0f3460",
//   },
//   centerPanel: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     padding: "20px",
//     alignItems: "center",
//   },
//   rightPanel: {
//     width: "280px",
//     background: "#16213e",
//     padding: "20px",
//     overflowY: "auto",
//     borderLeft: "1px solid #0f3460",
//   },
//   panelTitle: {
//     margin: "0 0 20px 0",
//     color: "#fff",
//     fontSize: "18px",
//     fontWeight: "600",
//   },
//   categoryFilter: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: "5px",
//     marginBottom: "15px",
//   },
//   categoryButton: {
//     padding: "6px 10px",
//     border: "none",
//     borderRadius: "4px",
//     fontSize: "11px",
//     cursor: "pointer",
//     transition: "all 0.2s",
//   },
//   furnitureList: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "8px",
//   },
//   furnitureItem: {
//     padding: "12px",
//     borderRadius: "8px",
//     cursor: "pointer",
//     transition: "all 0.2s",
//     border: "1px solid #0f3460",
//   },
//   furnitureName: {
//     fontSize: "14px",
//     fontWeight: "500",
//   },
//   furnitureSize: {
//     fontSize: "11px",
//     marginTop: "4px",
//   },
//   placingInfo: {
//     marginTop: "15px",
//     padding: "10px",
//     background: "#0f3460",
//     borderRadius: "8px",
//     color: "#fff",
//     fontSize: "12px",
//   },
//   cancelButton: {
//     display: "block",
//     marginTop: "8px",
//     padding: "6px 12px",
//     background: "#e74c3c",
//     color: "#fff",
//     border: "none",
//     borderRadius: "4px",
//     cursor: "pointer",
//     fontSize: "12px",
//   },
//   canvasHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "15px",
//     width: CANVAS_WIDTH + "px",
//   },
//   roomInfo: {
//     color: "#aaa",
//     fontSize: "13px",
//   },
//   canvas: {
//     width: CANVAS_WIDTH,
//     height: CANVAS_HEIGHT,
//     background: "#2a2a4a",
//     borderRadius: "8px",
//     position: "relative",
//     overflow: "hidden",
//     boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
//   },
//   outOfBoundsWarning: {
//     position: "absolute",
//     top: "10px",
//     left: "50%",
//     transform: "translateX(-50%)",
//     background: "#e74c3c",
//     color: "#fff",
//     padding: "8px 16px",
//     borderRadius: "4px",
//     fontSize: "14px",
//     fontWeight: "600",
//     zIndex: 1000,
//   },
//   canvasActions: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: "15px",
//     width: CANVAS_WIDTH + "px",
//   },
//   actionButton: {
//     padding: "10px 20px",
//     background: "#0f3460",
//     color: "#fff",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontSize: "14px",
//   },
//   itemCount: {
//     color: "#aaa",
//     fontSize: "14px",
//   },
//   primaryButton: {
//     padding: "10px 20px",
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     color: "#fff",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: "600",
//   },
//   propertiesContent: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "20px",
//   },
//   propertyGroup: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "8px",
//   },
//   propertyLabel: {
//     color: "#aaa",
//     fontSize: "12px",
//     textTransform: "uppercase",
//   },
//   propertyValue: {
//     color: "#fff",
//     fontSize: "14px",
//   },
//   rotationControls: {
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//   },
//   rotationValue: {
//     color: "#fff",
//     fontSize: "16px",
//     fontWeight: "600",
//     minWidth: "50px",
//     textAlign: "center",
//   },
//   scaleControls: {
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//   },
//   scaleValue: {
//     color: "#fff",
//     fontSize: "16px",
//     fontWeight: "600",
//     minWidth: "50px",
//     textAlign: "center",
//   },
//   controlButton: {
//     padding: "8px 12px",
//     background: "#0f3460",
//     color: "#fff",
//     border: "none",
//     borderRadius: "4px",
//     cursor: "pointer",
//     fontSize: "14px",
//   },
//   deleteButton: {
//     padding: "12px",
//     background: "#e74c3c",
//     color: "#fff",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: "600",
//     marginTop: "10px",
//   },
//   noSelection: {
//     color: "#666",
//     fontSize: "14px",
//     textAlign: "center",
//     padding: "40px 20px",
//   },
//   shortcuts: {
//     marginTop: "30px",
//     padding: "15px",
//     background: "#0f3460",
//     borderRadius: "8px",
//   },
//   shortcutsTitle: {
//     color: "#fff",
//     fontSize: "14px",
//     margin: "0 0 15px 0",
//   },
//   shortcutItem: {
//     color: "#aaa",
//     fontSize: "12px",
//     marginBottom: "8px",
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//   },
//   kbd: {
//     background: "#16213e",
//     padding: "4px 8px",
//     borderRadius: "4px",
//     fontSize: "11px",
//     color: "#fff",
//   },
// };

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDesign } from "../context/DesignContext";
import { getModelById } from "../utils/modelRegistry";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import api from "../services/api";

// Constants (Logic stays exactly the same)
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const GRID_SIZE_METERS = 0.1; // 10cm grid
const MIN_SCALE = 0.5;
const MAX_SCALE = 2.0;

const DEFAULT_MODEL_SIZE = { w: 1.2, d: 1.2, h: 1.0 };

const getCategoryDefaultSize = (category) => {
  const key = String(category || "").toLowerCase();
  const sizeMap = {
    sofa: { w: 2.1, d: 0.95, h: 0.85 },
    chair: { w: 0.6, d: 0.6, h: 0.95 },
    desk: { w: 1.4, d: 0.7, h: 0.75 },
    cupboard: { w: 1.6, d: 0.6, h: 2.1 },
    table: { w: 1.4, d: 0.8, h: 0.75 },
    bed: { w: 1.8, d: 2.1, h: 0.7 },
  };

  return sizeMap[key] || DEFAULT_MODEL_SIZE;
};

const normalizeModelPath = (rawPath) => {
  if (!rawPath || typeof rawPath !== "string") {
    return null;
  }

  if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
    return rawPath;
  }

  const normalized = rawPath.replace(/\\/g, "/");
  const uploadIndex = normalized.indexOf("/uploads/");
  const modelPath = uploadIndex >= 0 ? normalized.slice(uploadIndex) : normalized;

  if (!modelPath) {
    return null;
  }

  if (modelPath.startsWith("/")) {
    return `${import.meta.env.VITE_BACKEND_URL}${modelPath}`;
  }

  return `${import.meta.env.VITE_BACKEND_URL}/${modelPath}`;
};

const resolveDesignItemModel = (item) => {
  if (item?.customModel?.modelPath) {
    return {
      id: item.customModel.id || `custom-${item.id}`,
      name: item.customModel.name || "Furniture",
      category: item.customModel.category || "furniture",
      size: item.customModel.size || DEFAULT_MODEL_SIZE,
      defaultRotationY: item.customModel.defaultRotationY || 0,
      modelPath: item.customModel.modelPath,
      price: Number(item.customModel.price) || 0,
      image: item.customModel.image || null,
    };
  }

  return getModelById(item?.modelId);
};

export default function Editor2D() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const {
    room,
    items,
    addItem,
    updateItem,
    deleteItem,
    selectedItemId,
    setSelectedItemId,
    clearItems,
  } = useDesign();

  // Local state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [placingModelId, setPlacingModelId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isOutOfBounds, setIsOutOfBounds] = useState(false);
  const [adminModels, setAdminModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminModels = async () => {
      try {
        setModelsLoading(true);
        const response = await api.get("/furniture/all");
        const list = Array.isArray(response.data) ? response.data : [];

        const normalizedModels = list
          .map((entry) => {
            const modelPath = normalizeModelPath(entry?.model3DUrl);
            if (!entry?._id || !modelPath) {
              return null;
            }

            return {
              id: `admin-${entry._id}`,
              sourceFurnitureId: entry._id,
              name: entry.name || "Furniture",
              category: String(entry.category || "furniture").toLowerCase(),
              size: getCategoryDefaultSize(entry.category),
              defaultRotationY: 0,
              modelPath,
              price: Number(entry.price) || 0,
              image: Array.isArray(entry.image) ? entry.image[0] : entry.image || null,
            };
          })
          .filter(Boolean);

        setAdminModels(normalizedModels);
      } catch (error) {
        console.error("Failed to load admin furniture models:", error);
        toast.error("Failed to load furniture models from admin panel");
        setAdminModels([]);
      } finally {
        setModelsLoading(false);
      }
    };

    fetchAdminModels();
  }, []);

  // Calculate scale: pixels per meter
  const scaleX = CANVAS_WIDTH / room.width;
  const scaleZ = CANVAS_HEIGHT / room.length;
  const pixelsPerMeter = Math.min(scaleX, scaleZ) * 0.85;

  // Room dimensions in pixels
  const roomPixelWidth = room.width * pixelsPerMeter;
  const roomPixelHeight = room.length * pixelsPerMeter;

  // Offset to center the room in canvas
  const offsetX = (CANVAS_WIDTH - roomPixelWidth) / 2;
  const offsetY = (CANVAS_HEIGHT - roomPixelHeight) / 2;

  // Convert meters to canvas pixels
  const metersToPixels = (xMeters, zMeters) => ({
    px: offsetX + xMeters * pixelsPerMeter,
    py: offsetY + zMeters * pixelsPerMeter,
  });

  // Convert canvas pixels to meters
  const pixelsToMeters = (px, py) => ({
    x: (px - offsetX) / pixelsPerMeter,
    z: (py - offsetY) / pixelsPerMeter,
  });

  // Snap to grid (in meters)
  const snapToGrid = (value) => {
    return Math.round(value / GRID_SIZE_METERS) * GRID_SIZE_METERS;
  };

  // Check if position is within room bounds
  const isWithinBounds = (x, z, modelSize) => {
    const halfW = (modelSize?.w || 0.5) / 2;
    const halfD = (modelSize?.d || 0.5) / 2;
    return (
      x - halfW >= 0 &&
      x + halfW <= room.width &&
      z - halfD >= 0 &&
      z + halfD <= room.length
    );
  };

  // Clamp position to room bounds
  const clampToBounds = (x, z, modelSize) => {
    const halfW = (modelSize?.w || 0.5) / 2;
    const halfD = (modelSize?.d || 0.5) / 2;
    return {
      x: Math.max(halfW, Math.min(x, room.width - halfW)),
      z: Math.max(halfD, Math.min(z, room.length - halfD)),
    };
  };

  // Get furniture models filtered by category
  const furnitureModels = adminModels;
  const categories = [
    "all",
    ...Array.from(new Set(furnitureModels.map((model) => model.category))),
  ];
  const filteredModels =
    categoryFilter === "all"
      ? furnitureModels
      : furnitureModels.filter((m) => m.category === categoryFilter);

  // Handle canvas click (place new item)
  const handleCanvasClick = (e) => {
    if (!placingModelId) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const { x, z } = pixelsToMeters(px, py);

    const model = furnitureModels.find((entry) => entry.id === placingModelId);
    if (!model) {
      toast.error("Selected model is no longer available");
      setPlacingModelId(null);
      return;
    }

    const snappedX = snapToGrid(x);
    const snappedZ = snapToGrid(z);

    if (!isWithinBounds(snappedX, snappedZ, model?.size)) {
      toast.error("Cannot place outside room boundary");
      return;
    }

    addItem({
      modelId: null,
      x: snappedX,
      z: snappedZ,
      rotation: 0,
      scale: 1,
      sourceFurnitureId: model.sourceFurnitureId,
      customModel: {
        id: model.id,
        name: model.name,
        category: model.category,
        modelPath: model.modelPath,
        size: model.size,
        defaultRotationY: model.defaultRotationY || 0,
        price: model.price,
        image: model.image,
      },
    });

    toast.success(
      `Placed ${model?.name} at (${snappedX.toFixed(1)}m, ${snappedZ.toFixed(1)}m)`
    );
    setPlacingModelId(null);
  };

  // Handle item mouse down (start drag)
  const handleItemMouseDown = (e, item) => {
    e.stopPropagation();
    setSelectedItemId(item.id);
    setIsDragging(true);

    const rect = canvasRef.current.getBoundingClientRect();
    const { px, py } = metersToPixels(item.x, item.z);
    setDragOffset({
      x: e.clientX - rect.left - px,
      y: e.clientY - rect.top - py,
    });
  };

  // Handle mouse move (dragging)
  const handleMouseMove = (e) => {
    if (!isDragging || !selectedItemId) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left - dragOffset.x;
    const py = e.clientY - rect.top - dragOffset.y;
    const { x, z } = pixelsToMeters(px, py);

    const item = items.find((i) => i.id === selectedItemId);
    const model = resolveDesignItemModel(item);

    const snappedX = snapToGrid(x);
    const snappedZ = snapToGrid(z);

    const inBounds = isWithinBounds(snappedX, snappedZ, model?.size);
    setIsOutOfBounds(!inBounds);

    const clamped = clampToBounds(snappedX, snappedZ, model?.size);
    updateItem(selectedItemId, { x: clamped.x, z: clamped.z });
  };

  // Handle mouse up (end drag)
  const handleMouseUp = () => {
    if (isDragging && isOutOfBounds) {
      toast.error("Item clamped to room boundary");
    }
    setIsDragging(false);
    setIsOutOfBounds(false);
  };

  // Handle rotation
  const handleRotate = (degrees) => {
    if (!selectedItemId) return;
    const item = items.find((i) => i.id === selectedItemId);
    if (item) {
      updateItem(selectedItemId, { rotation: (item.rotation + degrees) % 360 });
    }
  };

  // Handle scale change
  const handleScaleChange = (delta) => {
    if (!selectedItemId) return;
    const item = items.find((i) => i.id === selectedItemId);
    if (item) {
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, item.scale + delta));
      updateItem(selectedItemId, { scale: newScale });
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (!selectedItemId) return;
    const item = items.find((i) => i.id === selectedItemId);
    const model = resolveDesignItemModel(item);
    deleteItem(selectedItemId);
    toast.success(`Deleted ${model?.name || "item"}`);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        handleDelete();
      } else if (e.key === "Escape") {
        setPlacingModelId(null);
        setSelectedItemId(null);
      } else if (e.key === "r" || e.key === "R") {
        handleRotate(90);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItemId, items]);

  const selectedItem = items.find((i) => i.id === selectedItemId);
  const selectedModel = selectedItem ? resolveDesignItemModel(selectedItem) : null;

  return (
    <div className="h-screen bg-[#fbfbfe] text-[#050315] font-sans flex flex-col selection:bg-[#2f27ce] selection:text-[#fbfbfe] overflow-hidden">
      <Navbar />
      
      {/* pt-20 accounts for the fixed Navbar height */}
      <div className="flex flex-1 pt-20 overflow-hidden">
        
        {/* Left Panel - Furniture Palette */}
        <div className="w-80 bg-white border-r border-[#dedcff] p-6 overflow-y-auto flex flex-col z-10 shadow-[4px_0_24px_rgb(5,3,21,0.02)]">
          <h2 className="text-lg font-black uppercase tracking-wider text-[#050315] mb-6">Furniture</h2>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all capitalize ${
                  categoryFilter === cat
                    ? "bg-[#2f27ce] text-[#fbfbfe] shadow-md shadow-[#2f27ce]/20"
                    : "bg-[#fbfbfe] text-[#050315]/60 hover:bg-[#dedcff] hover:text-[#2f27ce]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Furniture List */}
          <div className="flex flex-col gap-3">
            {modelsLoading && (
              <div className="p-4 rounded-xl border border-[#dedcff] bg-[#fbfbfe] text-xs font-bold text-[#050315]/50 uppercase tracking-widest text-center">
                Loading models...
              </div>
            )}

            {!modelsLoading && filteredModels.length === 0 && (
              <div className="p-4 rounded-xl border border-[#dedcff] bg-[#fbfbfe] text-xs font-bold text-[#050315]/50 uppercase tracking-widest text-center">
                No admin models found
              </div>
            )}

            {filteredModels.map((model) => (
              <div
                key={model.id}
                onClick={() => setPlacingModelId(model.id)}
                className={`p-4 rounded-xl cursor-pointer border-2 transition-all ${
                  placingModelId === model.id
                    ? "border-[#2f27ce] bg-[#dedcff]/30 shadow-sm"
                    : "border-[#dedcff]/50 bg-[#fbfbfe] hover:border-[#433bff]/40 hover:shadow-sm"
                }`}
              >
                <div className="font-bold text-sm text-[#050315]">{model.name}</div>
                <div className={`text-[10px] font-black mt-1 uppercase tracking-wider ${placingModelId === model.id ? "text-[#2f27ce]" : "text-[#050315]/40"}`}>
                  {model.size?.w}m × {model.size?.d}m × {model.size?.h}m
                </div>
              </div>
            ))}
          </div>

          {placingModelId && (
            <div className="mt-6 p-5 bg-[#dedcff]/40 border border-[#dedcff] rounded-2xl text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#050315]/50 mb-2">Placing Item</p>
              <p className="text-sm font-black text-[#2f27ce] mb-4">{furnitureModels.find((entry) => entry.id === placingModelId)?.name}</p>
              <button
                onClick={() => setPlacingModelId(null)}
                className="w-full py-2.5 bg-white border-2 border-rose-200 text-rose-600 text-xs font-bold rounded-xl hover:bg-rose-50 hover:border-rose-300 transition-colors"
              >
                Cancel Placement
              </button>
            </div>
          )}
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 flex flex-col p-6 items-center justify-center bg-[#fbfbfe] relative overflow-hidden">
          
          <div className="w-200 flex justify-between items-end mb-4">
            <h2 className="text-2xl font-black tracking-tight text-[#050315]">2D Floor Plan</h2>
            <div className="text-xs font-bold text-[#050315]/60 bg-[#dedcff]/50 px-4 py-1.5 rounded-full border border-[#dedcff]">
              Room: {room.width}m × {room.length}m <span className="mx-2 opacity-50">|</span> 1m = {pixelsPerMeter.toFixed(0)}px
            </div>
          </div>

          {/* Canvas Container */}
          <div
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`relative bg-white rounded-3xl shadow-2xl shadow-[#050315]/5 border-2 border-[#dedcff] overflow-hidden ${
              placingModelId ? "cursor-crosshair" : "cursor-default"
            }`}
            style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
          >
            {/* Out of bounds indicator */}
            {isOutOfBounds && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-rose-500 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg z-1000 animate-pulse">
                Boundary Warning
              </div>
            )}

            {/* Room Floor */}
            <div
              style={{
                position: "absolute",
                left: offsetX,
                top: offsetY,
                width: roomPixelWidth,
                height: roomPixelHeight,
                backgroundColor: room.floorColor,
                border: `4px solid ${room.wallColor}`,
                boxSizing: "border-box",
                boxShadow: "inset 0 0 40px rgba(0,0,0,0.03)"
              }}
            >
              {/* Grid Lines */}
              <svg
                width={roomPixelWidth}
                height={roomPixelHeight}
                style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
              >
                {/* 0.5m grid */}
                {Array.from({ length: Math.floor(room.width / 0.5) + 1 }).map((_, i) => (
                  <line key={`v${i}`} x1={i * 0.5 * pixelsPerMeter} y1={0} x2={i * 0.5 * pixelsPerMeter} y2={roomPixelHeight} stroke="rgba(5,3,21,0.04)" strokeWidth="1" />
                ))}
                {Array.from({ length: Math.floor(room.length / 0.5) + 1 }).map((_, i) => (
                  <line key={`h${i}`} x1={0} y1={i * 0.5 * pixelsPerMeter} x2={roomPixelWidth} y2={i * 0.5 * pixelsPerMeter} stroke="rgba(5,3,21,0.04)" strokeWidth="1" />
                ))}
                {/* 1m grid */}
                {Array.from({ length: Math.floor(room.width) + 1 }).map((_, i) => (
                  <line key={`vm${i}`} x1={i * pixelsPerMeter} y1={0} x2={i * pixelsPerMeter} y2={roomPixelHeight} stroke="rgba(5,3,21,0.1)" strokeWidth="1.5" />
                ))}
                {Array.from({ length: Math.floor(room.length) + 1 }).map((_, i) => (
                  <line key={`hm${i}`} x1={0} y1={i * pixelsPerMeter} x2={roomPixelWidth} y2={i * pixelsPerMeter} stroke="rgba(5,3,21,0.1)" strokeWidth="1.5" />
                ))}
              </svg>

              {/* Dimension labels */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[#050315]/40 font-black text-xs bg-[#fbfbfe] px-2 py-0.5 rounded border border-[#dedcff]">
                {room.width}m
              </div>
              <div className="absolute -right-10 top-1/2 -translate-y-1/2 rotate-90 text-[#050315]/40 font-black text-xs bg-[#fbfbfe] px-2 py-0.5 rounded border border-[#dedcff]">
                {room.length}m
              </div>
            </div>

            {/* Placed Items */}
            {items.map((item) => {
              const model = resolveDesignItemModel(item);
              const { px, py } = metersToPixels(item.x, item.z);
              const itemW = (model?.size?.w || 0.5) * pixelsPerMeter * item.scale;
              const itemH = (model?.size?.d || 0.5) * pixelsPerMeter * item.scale;
              const isSelected = item.id === selectedItemId;

              // Keep logic colors for identification, but styled nicely
              const categoryColors = {
                seating: "#8b4513",
                bedroom: "#4a6fa5",
                table: "#6b8e23",
                decor: "#9370db",
                lighting: "#ffd700",
              };
              const itemColor = categoryColors[model?.category?.toLowerCase()] || "#a0aec0";

              return (
                <div
                  key={item.id}
                  onMouseDown={(e) => handleItemMouseDown(e, item)}
                  style={{
                    position: "absolute",
                    left: px - itemW / 2,
                    top: py - itemH / 2,
                    width: itemW,
                    height: itemH,
                    backgroundColor: isSelected ? "#2f27ce" : itemColor,
                    border: isSelected ? "3px solid #fbfbfe" : "2px solid rgba(5,3,21,0.2)",
                    borderRadius: "6px",
                    transform: `rotate(${item.rotation}deg)`,
                    cursor: "move",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: isSelected ? "0 0 0 4px rgba(47,39,206,0.3)" : "0 4px 6px rgba(5,3,21,0.1)",
                    zIndex: isSelected ? 100 : 1,
                    transition: isDragging ? "none" : "all 0.15s ease-out",
                  }}
                >
                  <span
                    style={{
                      fontSize: Math.max(9, Math.min(12, itemW / 8)) + "px",
                      color: "#fff",
                      textAlign: "center",
                      transform: `rotate(-${item.rotation}deg)`,
                      pointerEvents: "none",
                      fontWeight: "900",
                      textShadow: "0px 1px 3px rgba(0,0,0,0.6)",
                      lineHeight: "1.2",
                      padding: "2px",
                    }}
                  >
                    {model?.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Canvas Actions */}
          <div className="flex justify-between items-center w-full max-w-200 mt-6">
            <button
              onClick={clearItems}
              className="px-5 py-3 bg-white border-2 border-[#dedcff] text-[#050315] hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 rounded-xl font-bold text-sm transition-colors"
            >
              Clear Canvas
            </button>
            <div className="text-sm font-black text-[#050315]/50 uppercase tracking-widest">
              {items.length} Item{items.length !== 1 ? "s" : ""}
            </div>
            <button
              onClick={() => navigate("/viewer-3d")}
              className="px-8 py-3 bg-[#2f27ce] text-white hover:bg-[#433bff] rounded-xl font-bold text-sm shadow-lg shadow-[#2f27ce]/30 active:scale-95 transition-all flex items-center gap-2"
            >
              View in 3D <span className="text-lg leading-none">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div className="w-80 bg-white border-l border-[#dedcff] p-6 overflow-y-auto flex flex-col z-10 shadow-[-4px_0_24px_rgb(5,3,21,0.02)]">
          <h2 className="text-lg font-black uppercase tracking-wider text-[#050315] mb-6">Properties</h2>

          {selectedItem ? (
            <div className="flex flex-col gap-6">
              
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-[#050315]/50 block mb-1.5 ml-1">Selected Item</label>
                <div className="text-sm font-bold text-[#050315] bg-[#fbfbfe] px-4 py-3 rounded-xl border-2 border-[#dedcff]/50">
                  {selectedModel?.name}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#050315]/50 block mb-1.5 ml-1">Category</label>
                  <div className="text-sm font-bold text-[#050315] bg-[#fbfbfe] px-4 py-3 rounded-xl border-2 border-[#dedcff]/50 capitalize">
                    {selectedModel?.category}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#050315]/50 block mb-1.5 ml-1">Size</label>
                  <div className="text-xs font-bold text-[#050315] bg-[#fbfbfe] px-3 py-3 rounded-xl border-2 border-[#dedcff]/50 text-center">
                    {selectedModel?.size?.w}×{selectedModel?.size?.d}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-[#050315]/50 block mb-1.5 ml-1">Position (X, Z)</label>
                <div className="text-sm font-bold text-[#050315] bg-[#fbfbfe] px-4 py-3 rounded-xl border-2 border-[#dedcff]/50">
                  {selectedItem.x.toFixed(2)}m, {selectedItem.z.toFixed(2)}m
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-[#050315]/50 block mb-1.5 ml-1">Rotation</label>
                <div className="flex items-center justify-between bg-[#fbfbfe] p-1.5 rounded-xl border-2 border-[#dedcff]/50">
                  <button onClick={() => handleRotate(-45)} className="w-10 h-10 flex items-center justify-center bg-white rounded-lg border border-[#dedcff] text-[#2f27ce] font-black hover:bg-[#dedcff] transition-colors">-45°</button>
                  <span className="font-black text-[#050315] text-base">{selectedItem.rotation}°</span>
                  <button onClick={() => handleRotate(45)} className="w-10 h-10 flex items-center justify-center bg-white rounded-lg border border-[#dedcff] text-[#2f27ce] font-black hover:bg-[#dedcff] transition-colors">+45°</button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-[#050315]/50 block mb-1.5 ml-1">Scale</label>
                <div className="flex items-center justify-between bg-[#fbfbfe] p-1.5 rounded-xl border-2 border-[#dedcff]/50">
                  <button onClick={() => handleScaleChange(-0.1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-lg border border-[#dedcff] text-[#2f27ce] font-black hover:bg-[#dedcff] text-lg transition-colors">-</button>
                  <span className="font-black text-[#050315] text-base">{selectedItem.scale.toFixed(1)}x</span>
                  <button onClick={() => handleScaleChange(0.1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-lg border border-[#dedcff] text-[#2f27ce] font-black hover:bg-[#dedcff] text-lg transition-colors">+</button>
                </div>
              </div>

              <button
                onClick={handleDelete}
                className="w-full mt-4 py-3.5 bg-rose-50 border-2 border-rose-100 text-rose-600 font-bold rounded-xl hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all"
              >
                Delete Item
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 bg-[#fbfbfe] border-2 border-dashed border-[#dedcff] rounded-2xl p-6 text-center">
              <p className="text-sm font-bold text-[#050315]/60 mb-2">No Item Selected</p>
              <p className="text-[10px] font-medium text-[#050315]/40 uppercase tracking-widest">Click on a placed furniture item to edit properties</p>
            </div>
          )}

          {/* Shortcuts */}
          <div className="mt-auto pt-8">
            <div className="p-5 bg-[#fbfbfe] rounded-2xl border border-[#dedcff]/50">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[#050315]/50 mb-4">Shortcuts</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs font-bold text-[#050315]/70">
                  <kbd className="px-2.5 py-1 bg-white border border-[#dedcff] rounded-md text-[#2f27ce] shadow-sm">R</kbd> Rotate 90°
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-[#050315]/70">
                  <kbd className="px-2.5 py-1 bg-white border border-[#dedcff] rounded-md text-[#2f27ce] shadow-sm">Del</kbd> Delete Item
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-[#050315]/70">
                  <kbd className="px-2.5 py-1 bg-white border border-[#dedcff] rounded-md text-[#2f27ce] shadow-sm">Esc</kbd> Deselect
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

