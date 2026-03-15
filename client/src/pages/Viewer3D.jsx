import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import { OrbitControls } from "three-stdlib";
import { useDesign } from "../context/DesignContext";
import { getModelById } from "../utils/modelRegistry";
import api from "../services/api";

export default function Viewer3D() {
  const mountRef = useRef(null);
  const navigate = useNavigate();
  const { room, items, designName, setDesignName } = useDesign();

  const saveDesign = async () => {
    const designData = { name: designName?.trim() || "My Design", room, items };

    try {
      // Use configured axios instance so auth token is sent
      await api.post("/designs", designData);
      alert("Design saved successfully!");
    } catch (error) {
      console.error("Error saving design:", error);
      const message = error?.response?.data?.error || error?.response?.data?.message || "Failed to save design.";
      alert(message);
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Clear existing
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(
      room.width / 2,
      room.height * 1.5,
      room.length + room.length * 0.8
    );

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // === LIGHTS ===
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

    // === ROOM ===
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
    scene.add(floor);

    // Walls
    const wallMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(room.wallColor),
      roughness: 0.9,
      side: THREE.DoubleSide,
    });

    // Back wall (z=0)
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(room.width, room.height, 0.05),
      wallMat
    );
    backWall.position.set(room.width / 2, room.height / 2, 0);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left wall (x=0)
    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, room.height, room.length),
      wallMat
    );
    leftWall.position.set(0, room.height / 2, room.length / 2);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Right wall (x=room.width)
    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, room.height, room.length),
      wallMat
    );
    rightWall.position.set(room.width, room.height / 2, room.length / 2);
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    // === CONTROLS ===
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(room.width / 2, room.height / 4, room.length / 2);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1;
    controls.maxDistance = 30;
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.update();

    // === LOAD FURNITURE ===
    const loader = new GLTFLoader();

    console.log("=== 3D VIEWER ===");
    console.log(`Room: ${room.width}m x ${room.length}m x ${room.height}m`);
    console.log(`Items to load: ${items.length}`);

    items.forEach((item, index) => {
      const modelData = getModelById(item.modelId);
      if (!modelData) {
        console.warn(`[${index}] Model not found: ${item.modelId}`);
        return;
      }

      console.log(`[${index}] Loading ${modelData.name} | 2D pos: x=${item.x.toFixed(2)}, z=${item.z.toFixed(2)}`);

      loader.load(
        modelData.modelPath,
        (gltf) => {
          const model = gltf.scene;

          // --- Step 1: Measure raw model ---
          const rawBox = new THREE.Box3().setFromObject(model);
          const rawSize = new THREE.Vector3();
          const rawCenter = new THREE.Vector3();
          rawBox.getSize(rawSize);
          rawBox.getCenter(rawCenter);

          console.log(`  Raw size: w=${rawSize.x.toFixed(2)}, h=${rawSize.y.toFixed(2)}, d=${rawSize.z.toFixed(2)}`);

          // --- Step 2: Calculate auto-scale to match desired size ---
          const desiredW = modelData.size.w;
          const desiredH = modelData.size.h;
          const desiredD = modelData.size.d;

          // Scale each axis to fit desired dimensions, use uniform (smallest) scale
          const scaleForW = desiredW / rawSize.x;
          const scaleForH = desiredH / rawSize.y;
          const scaleForD = desiredD / rawSize.z;
          const autoScale = Math.min(scaleForW, scaleForH, scaleForD);

          // Apply item.scale on top (user scaling from editor)
          const finalScale = autoScale * item.scale;

          // --- Step 3: Recenter model ---
          // Move model so its bottom-center is at (0, 0, 0)
          model.position.set(-rawCenter.x, -rawBox.min.y, -rawCenter.z);

          // --- Step 4: Wrap in group ---
          const group = new THREE.Group();
          group.add(model);
          group.scale.set(finalScale, finalScale, finalScale);

          // --- Step 5: Position in room ---
          // X and Z come directly from 2D editor (in meters)
          // Y depends on category:
          //   - lighting: hang from ceiling
          //   - everything else: sit on floor (y=0)
          let yPos = 0;
          if (modelData.category === "lighting") {
            // Hang from ceiling: room height minus scaled model height
            const scaledHeight = rawSize.y * finalScale;
            yPos = room.height - scaledHeight;
          }

          group.position.set(item.x, yPos, item.z);

          // --- Step 6: Rotation ---
          group.rotation.y =
            THREE.MathUtils.degToRad(item.rotation) +
            modelData.defaultRotationY;

          // --- Step 7: Shadows ---
          group.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          scene.add(group);

          // --- Debug ---
          const scaledW = (rawSize.x * finalScale).toFixed(2);
          const scaledH = (rawSize.y * finalScale).toFixed(2);
          const scaledD = (rawSize.z * finalScale).toFixed(2);
          console.log(
            `  ✓ ${modelData.name} | ` +
            `3D pos(${group.position.x.toFixed(2)}, ${group.position.y.toFixed(2)}, ${group.position.z.toFixed(2)}) | ` +
            `autoScale=${autoScale.toFixed(4)} finalScale=${finalScale.toFixed(4)} | ` +
            `scaled size(${scaledW}, ${scaledH}, ${scaledD})`
          );
        },
        undefined,
        (error) => {
          console.error(`  ✗ Error loading ${modelData.name}:`, error);
        }
      );
    });

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Animate
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
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
  }, [room, items]);

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
          top: 70,
          left: 20,
          zIndex: 10,
          background: "rgba(0,0,0,0.7)",
          padding: 10,
          borderRadius: 8,
          width: 260,
        }}
      >
        <div style={{ color: "#fff", fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
          Design name
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
          top: 150,
          left: 20,
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
          const model = getModelById(item.modelId);
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