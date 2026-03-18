import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import { OrbitControls } from "three-stdlib";
import toast from "react-hot-toast";
import { useDesign } from "../context/DesignContext";
import { getModelById } from "../utils/modelRegistry";
import api from "../services/api";


const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%25' height='100%25' fill='%23f3f4f6'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='Arial' font-size='20'>Furniture</text></svg>";

const DEFAULT_MODEL_SIZE = { w: 1.2, d: 1.2, h: 1.0 };

const resolveModelData = (designItem) => {
  if (designItem?.customModel?.modelPath) {
    const custom = designItem.customModel;
    return {
      id: custom.id || `custom-${designItem.id}`,
      name: custom.name || "Furniture",
      category: custom.category || "furniture",
      modelPath: custom.modelPath,
      size: custom.size || DEFAULT_MODEL_SIZE,
      defaultRotationY: custom.defaultRotationY || 0,
      price: Number(custom.price) || 0,
      image: custom.image || FALLBACK_IMAGE,
    };
  }

  return getModelById(designItem?.modelId);
};

export default function Viewer3D() {
  const mountRef = useRef(null);
  const missingModelWarnedRef = useRef(new Set());
  const navigate = useNavigate();
  const { room, items, designName, setDesignName, updateItem } = useDesign();

  const handleAddToCart = () => {
    if (!items.length) {
      toast.error("No furniture in this design to add");
      return;
    }

    try {
      const cart = JSON.parse(localStorage.getItem("furnitureCart")) || [];
      let addedCount = 0;

      items.forEach((placedItem) => {
        const model = resolveModelData(placedItem);
        if (!model) {
          return;
        }

        const cartId = placedItem.sourceFurnitureId
          ? `furniture-${placedItem.sourceFurnitureId}`
          : `model-${model.id}`;
        const existingIndex = cart.findIndex((cartItem) => cartItem._id === cartId);

        if (existingIndex > -1) {
          cart[existingIndex].quantity += 1;
        } else {
          cart.push({
            _id: cartId,
            name: model.name,
            category: model.category || "Furniture",
            price: Number(model.price) || 0,
            quantity: 1,
            image: model.image || FALLBACK_IMAGE,
          });
        }

        addedCount += 1;
      });

      localStorage.setItem("furnitureCart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success(`Added ${addedCount} item(s) to cart`);
      navigate("/cart");
    } catch (error) {
      console.error("Error adding design items to cart:", error);
      toast.error("Failed to add items to cart");
    }
  };

  const saveDesign = async () => {
    const designData = { name: designName?.trim() || "My Design", room, items };

    try {
      await api.post("/designs", designData);
      alert("Design saved successfully!");
    } catch (error) {
      console.error("Error saving design:", error);
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to save design.";
      alert(message);
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(
      room.width / 2,
      room.height * 1.5,
      room.length + room.length * 0.8
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(room.width, room.height * 2, room.length);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.4);
    pointLight.position.set(room.width / 2, room.height - 0.3, room.length / 2);
    scene.add(pointLight);

    // Floor
    const floorGeo = new THREE.PlaneGeometry(room.width, room.length);
    const floorMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(room.floorColor),
      roughness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(room.width / 2, 0, room.length / 2);
    floor.receiveShadow = true;
    floor.name = "__floor__";
    scene.add(floor);

    // Walls
    const wallMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(room.wallColor),
      roughness: 0.9,
      side: THREE.DoubleSide,
    });

    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(room.width, room.height, 0.05),
      wallMat
    );
    backWall.position.set(room.width / 2, room.height / 2, 0);
    backWall.receiveShadow = true;
    scene.add(backWall);

    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, room.height, room.length),
      wallMat
    );
    leftWall.position.set(0, room.height / 2, room.length / 2);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, room.height, room.length),
      wallMat
    );
    rightWall.position.set(room.width, room.height / 2, room.length / 2);
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(room.width / 2, room.height / 4, room.length / 2);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1;
    controls.maxDistance = 30;
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.update();

    // === MOVE / DRAG SUPPORT ===
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // y = 0
    const planeHit = new THREE.Vector3();
    const dragOffset = new THREE.Vector3();

    let isDragging = false;
    let draggedGroup = null;

    const setMouseFromEvent = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const findTaggedRoot = (obj) => {
      let cur = obj;
      while (cur) {
        if (cur.userData && cur.userData.__designItemId) return cur;
        cur = cur.parent;
      }
      return null;
    };

    // ✅ NEW: Clamp taking the model's footprint into account
    // We store half-extents (x/z) on the group when it is loaded.
    const clampToRoomWithExtents = (group, pos) => {
      const ext = group?.userData?.__halfExtentsXZ || { x: 0, z: 0 };

      // room min/max in world coords (your room is 0..width, 0..length)
      const minX = 0 + ext.x;
      const maxX = room.width - ext.x;
      const minZ = 0 + ext.z;
      const maxZ = room.length - ext.z;

      // If an object is larger than the room in that axis, keep it centered
      if (minX > maxX) pos.x = room.width / 2;
      else pos.x = Math.max(minX, Math.min(maxX, pos.x));

      if (minZ > maxZ) pos.z = room.length / 2;
      else pos.z = Math.max(minZ, Math.min(maxZ, pos.z));
    };

    const onPointerDown = (e) => {
      if (e.button !== 0) return;
      setMouseFromEvent(e);
      raycaster.setFromCamera(mouse, camera);

      const hits = raycaster.intersectObjects(scene.children, true);
      if (!hits.length) return;

      const hit = hits.find((h) => h.object && h.object.name !== "__floor__");
      if (!hit) return;

      const root = findTaggedRoot(hit.object);
      if (!root) return;

      isDragging = true;
      draggedGroup = root;
      controls.enabled = false;

      raycaster.ray.intersectPlane(dragPlane, planeHit);
      dragOffset.copy(draggedGroup.position).sub(planeHit);
    };

    const onPointerMove = (e) => {
      if (!isDragging || !draggedGroup) return;

      setMouseFromEvent(e);
      raycaster.setFromCamera(mouse, camera);

      if (raycaster.ray.intersectPlane(dragPlane, planeHit)) {
        const next = planeHit.clone().add(dragOffset);

        // preserve Y
        next.y = draggedGroup.position.y;

        // ✅ prevent crossing room boundaries
        clampToRoomWithExtents(draggedGroup, next);

        draggedGroup.position.copy(next);
      }
    };

    const finishDrag = () => {
      if (!isDragging || !draggedGroup) return;

      const id = draggedGroup.userData.__designItemId;
      const newX = Number(draggedGroup.position.x.toFixed(3));
      const newZ = Number(draggedGroup.position.z.toFixed(3));

      updateItem(id, { x: newX, z: newZ });

      isDragging = false;
      draggedGroup = null;
      controls.enabled = true;
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", finishDrag);
    renderer.domElement.addEventListener("pointercancel", finishDrag);
    renderer.domElement.addEventListener("pointerleave", finishDrag);

    // === LOAD FURNITURE ===
    const loader = new GLTFLoader();

    const addFallbackProxy = (designItem, modelData) => {
      const modelSize = modelData?.size || DEFAULT_MODEL_SIZE;
      const fallbackColorByCategory = {
        seating: 0x8b5cf6,
        bedroom: 0x2563eb,
        table: 0x16a34a,
        decor: 0xf59e0b,
        lighting: 0xeab308,
        furniture: 0x64748b,
      };

      const colorKey = String(modelData?.category || "furniture").toLowerCase();
      const proxyMaterial = new THREE.MeshStandardMaterial({
        color: fallbackColorByCategory[colorKey] || fallbackColorByCategory.furniture,
        roughness: 0.6,
        metalness: 0.1,
      });

      const proxyMesh = new THREE.Mesh(
        new THREE.BoxGeometry(modelSize.w, modelSize.h, modelSize.d),
        proxyMaterial
      );
      proxyMesh.castShadow = true;
      proxyMesh.receiveShadow = true;

      const group = new THREE.Group();
      group.add(proxyMesh);

      const yPos =
        String(modelData?.category || "").toLowerCase() === "lighting"
          ? room.height - modelSize.h / 2
          : modelSize.h / 2;

      group.position.set(designItem.x, yPos, designItem.z);
      group.rotation.y =
        THREE.MathUtils.degToRad(designItem.rotation) + (modelData?.defaultRotationY || 0);

      group.userData.__designItemId = designItem.id;
      group.userData.__halfExtentsXZ = {
        x: modelSize.w / 2,
        z: modelSize.d / 2,
      };

      const clamped = group.position.clone();
      clampToRoomWithExtents(group, clamped);
      group.position.copy(clamped);
      scene.add(group);
    };

    items.forEach((item) => {
      const modelData = resolveModelData(item);
      if (!modelData) return;

      loader.load(
        modelData.modelPath,
        (gltf) => {
          const model = gltf.scene;

          const rawBox = new THREE.Box3().setFromObject(model);
          const rawSize = new THREE.Vector3();
          const rawCenter = new THREE.Vector3();
          rawBox.getSize(rawSize);
          rawBox.getCenter(rawCenter);

          const modelSize = modelData.size || DEFAULT_MODEL_SIZE;
          const desiredW = modelSize.w;
          const desiredH = modelSize.h;
          const desiredD = modelSize.d;

          const scaleForW = desiredW / rawSize.x;
          const scaleForH = desiredH / rawSize.y;
          const scaleForD = desiredD / rawSize.z;
          const autoScale = Math.min(scaleForW, scaleForH, scaleForD);

          const finalScale = autoScale * item.scale;

          model.position.set(-rawCenter.x, -rawBox.min.y, -rawCenter.z);

          const group = new THREE.Group();
          group.add(model);
          group.scale.set(finalScale, finalScale, finalScale);

          let yPos = 0;
          if (modelData.category === "lighting") {
            const scaledHeight = rawSize.y * finalScale;
            yPos = room.height - scaledHeight;
          }

          group.position.set(item.x, yPos, item.z);

          group.rotation.y =
            THREE.MathUtils.degToRad(item.rotation) + (modelData.defaultRotationY || 0);

          group.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          group.userData.__designItemId = item.id;

          // ✅ NEW: compute footprint extents in world space for boundary clamping
          // Use the group's bounding box (after scaling/centering) and store half-extents.
          const groupBox = new THREE.Box3().setFromObject(group);
          const groupSize = new THREE.Vector3();
          groupBox.getSize(groupSize);
          group.userData.__halfExtentsXZ = {
            x: groupSize.x / 2,
            z: groupSize.z / 2,
          };

          // Optional: if the loaded position is already out-of-bounds, clamp it once
          const clamped = group.position.clone();
          clampToRoomWithExtents(group, clamped);
          group.position.copy(clamped);

          scene.add(group);
        },
        undefined,
        (error) => {
          console.error(`Error loading ${modelData.name}:`, error);

          if (!missingModelWarnedRef.current.has(modelData.modelPath)) {
            missingModelWarnedRef.current.add(modelData.modelPath);
            toast.error(`3D file missing for ${modelData.name}. Showing preview shape.`);
          }

          addFallbackProxy(item, modelData);
        }
      );
    });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);

      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", finishDrag);
      renderer.domElement.removeEventListener("pointercancel", finishDrag);
      renderer.domElement.removeEventListener("pointerleave", finishDrag);

      cancelAnimationFrame(animationId);
      controls.dispose();
      renderer.dispose();
      if (
        mountRef.current &&
        renderer.domElement.parentNode === mountRef.current
      ) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [room, items, updateItem]);

  return (
    <div style={{ position: "relative" }}>
      <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />

      {/* Back button */}
      <button
        onClick={() => navigate("/editor-2d")}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          padding: "10px 20px",
          background: "rgba(0,0,0,0.7)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 600,
          zIndex: 10,
        }}
      >
        ← Back to Editor
      </button>

      {/* Design name */}
      <div
        style={{
          position: "absolute",
          top: 130,
          right: 20,
          zIndex: 10,
          background: "rgba(0,0,0,0.7)",
          padding: 10,
          borderRadius: 8,
          width: 300,
        }}
      >
        <div style={{ color: "#fff", fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
          3D Design Name
        </div>
        <input
          value={designName || ""}
          onChange={(e) => setDesignName(e.target.value)}
          placeholder="e.g. Living Room #1"
          style={{
            width: "100%",
            padding: "8px 10px",
            borderRadius: 6,
            border: "1px solid rgba(255,255,255,0.25)",
            background: "rgba(255,255,255,0.08)",
            color: "#fff",
            outline: "none",
            fontSize: 13,
          }}
        />
      </div>

      {/* Save Button */}
      <button
        onClick={saveDesign}
        style={{
          position: "absolute",
          bottom: 25,
          right: 150,
          padding: "10px 20px",
          background: "rgba(46, 204, 113, 0.9)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 600,
          zIndex: 10,
        }}
      >
        💾 Save Design
      </button>

      {/* Add To Cart Button */}
      <button
        onClick={handleAddToCart}
        
        style={{
          position: "absolute",
          bottom: 25,
          right: 20,
          padding: "10px 20px",
          background: "rgba(245, 158, 11, 0.95)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 600,
          zIndex: 10,
        }}
      >
        Add To Cart
        
      </button>

      {/* Info panel */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          padding: 15,
          background: "rgba(0,0,0,0.7)",
          color: "#fff",
          borderRadius: 8,
          fontSize: 14,
          zIndex: 10,
        }}
      >
        <div>
          <strong>Room:</strong> {room.width}m × {room.length}m × {room.height}m
        </div>
        <div>
          <strong>Items:</strong> {items.length}
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: "#aaa" }}>
          Drag to rotate • Scroll to zoom • Right-click to pan
        </div>
      </div>

      {/* Debug panel */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          padding: 15,
          background: "rgba(0,0,0,0.7)",
          color: "#fff",
          borderRadius: 8,
          fontSize: 11,
          maxWidth: 400,
          maxHeight: 200,
          overflow: "auto",
          zIndex: 10,
        }}
      >
        <strong>Items ({items.length}):</strong>
        {items.length === 0 && (
          <div style={{ color: "#e74c3c" }}>
            No items! Place furniture in 2D Editor first.
          </div>
        )}
        {items.map((item, idx) => {
          const model = resolveModelData(item);
          return (
            <div key={idx} style={{ marginTop: 4 }}>
              {model?.name}: x={item.x.toFixed(2)}m, z={item.z.toFixed(2)}m,
              rot={item.rotation}°, scale={item.scale}x
            </div>
          );
        })}
      </div>
    </div>
  );
}