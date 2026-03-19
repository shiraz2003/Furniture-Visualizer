import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import ImageSlider from "../components/imageslider";
import { useDesign } from "../context/DesignContext";

export default function FurnitureOverviewPage() {
    const { furnitureId } = useParams();
    const navigate = useNavigate();
    const { room, setItems, setSelectedItemId, setDesignName } = useDesign();

    const [item, setItem] = useState(null);
    const [status, setStatus] = useState("loading");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            setIsLoggedIn(Boolean(token));
        };

        checkAuth();
        window.addEventListener("storage", checkAuth);
        const interval = setInterval(checkAuth, 1000);

        return () => {
            window.removeEventListener("storage", checkAuth);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const fetchFurniture = async () => {
            try {
                setStatus("loading");
                let furniture = null;

                try {
                    const response = await axios.get(
                        `${import.meta.env.VITE_BACKEND_URL}/api/furniture/${furnitureId}`,
                    );
                    furniture = response.data?.data;
                } catch (singleError) {
                    if (singleError?.response?.status === 404) {
                        const allResponse = await axios.get(
                            `${import.meta.env.VITE_BACKEND_URL}/api/furniture/all`,
                        );
                        const items = Array.isArray(allResponse.data) ? allResponse.data : [];
                        furniture = items.find((entry) => String(entry?._id) === String(furnitureId));

                        if (!furniture) {
                            throw new Error("Furniture item not found");
                        }
                    } else {
                        throw singleError;
                    }
                }

                setItem(furniture);

                const cart = JSON.parse(localStorage.getItem("furnitureCart")) || [];
                const existing = cart.find((cartItem) => cartItem._id === furniture?._id);

                if (existing) {
                    setQuantity(existing.quantity || 1);
                } else {
                    setQuantity(1);
                }

                setStatus("success");
            } catch (error) {
                console.error("Error fetching furniture details:", error);
                toast.error(error?.message || "Error fetching furniture details");
                setStatus("error");
            }
        };

        if (furnitureId) {
            fetchFurniture();
        }
    }, [furnitureId]);

    useEffect(() => {
        const syncCartState = () => {
            const cart = JSON.parse(localStorage.getItem("furnitureCart")) || [];
            if (!item) return;

            const existing = cart.find((cartItem) => cartItem._id === item._id);
            if (existing) {
                setQuantity(existing.quantity || 1);
            } else {
                setQuantity(1);
            }
        };

        window.addEventListener("cartUpdated", syncCartState);
        return () => {
            window.removeEventListener("cartUpdated", syncCartState);
        };
    }, [item]);

    const imageList = useMemo(() => {
        if (!item?.image) return [];
        return Array.isArray(item.image) ? item.image.filter(Boolean) : [item.image];
    }, [item]);

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

    const getPreviewSizeByCategory = (category) => {
        const key = String(category || "").toLowerCase();
        const sizeByCategory = {
            sofa: { w: 2.1, d: 0.95, h: 0.85 },
            chair: { w: 0.6, d: 0.6, h: 0.95 },
            desk: { w: 1.4, d: 0.7, h: 0.75 },
            cupboard: { w: 1.6, d: 0.6, h: 2.1 },
            table: { w: 1.4, d: 0.8, h: 0.75 },
            bed: { w: 1.8, d: 2.1, h: 0.7 }
        };

        return sizeByCategory[key] || { w: 1.2, d: 1.2, h: 1.0 };
    };

    const totalPrice = (item?.price || 0) * quantity;

    const handleAddToCart = () => {
        if (!isLoggedIn) {
            toast.error("Please login first to add items to cart");
            navigate("/login");
            return;
        }

        if (!item) return;

        const cart = JSON.parse(localStorage.getItem("furnitureCart")) || [];
        const existingIndex = cart.findIndex((cartItem) => cartItem._id === item._id);

        if (existingIndex > -1) {
            cart[existingIndex].quantity = quantity;
            toast.success("Cart quantity updated");
        } else {
            cart.push({ ...item, quantity });
            toast.success("Furniture added to cart");
        }

        localStorage.setItem("furnitureCart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const handleBuyNow = () => {
        if (!isLoggedIn) {
            toast.error("Please login first to continue");
            navigate("/login");
            return;
        }

        handleAddToCart();
        navigate("/cart");
    };

    const handleViewIn3D = () => {
        if (!item) {
            toast.error("Furniture item is not ready yet");
            return;
        }

        const modelPath = normalizeModelPath(item.model3DUrl);
        if (!modelPath) {
            toast.error("3D model is not available for this item");
            return;
        }

        const previewItemId = `preview-${item._id || Date.now()}`;
        const previewItem = {
            id: previewItemId,
            modelId: null,
            x: room.width / 2,
            z: room.length / 2,
            rotation: 0,
            scale: 1,
            sourceFurnitureId: item._id,
            customModel: {
                name: item.name || "Furniture",
                category: String(item.category || "furniture").toLowerCase(),
                modelPath,
                size: getPreviewSizeByCategory(item.category),
                defaultRotationY: 0,
                price: Number(item.price) || 0,
                image: Array.isArray(item.image) ? item.image[0] : item.image || null
            }
        };

        setItems([previewItem]);
        setSelectedItemId(previewItemId);
        setDesignName(`${item.name || "Furniture"} Preview`);
        navigate("/viewer-3d");
    };

    return (
        <div className="min-h-screen bg-[#fbfbfe] text-[#050315] font-sans selection:bg-[#2f27ce] selection:text-white">
            <Navbar />

            <div className="w-full h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide pt-24 pb-12 px-4 sm:px-6 md:px-8">
                
                {status === "loading" && (
                    <div className="flex justify-center items-center min-h-[60vh]">
                        <div className="w-16 h-16 border-4 border-[#dedcff] border-t-[#2f27ce] rounded-full animate-spin"></div>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex justify-center items-center min-h-[60vh]">
                        <div className="bg-rose-50 text-rose-600 px-6 py-3 rounded-xl border-2 border-rose-200 font-bold text-sm">
                            Error loading furniture item.
                        </div>
                    </div>
                )}

                {status === "success" && item && (
                    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                            
                            <div className="bg-white rounded-3xl p-2 sm:p-5 border border-[#dedcff]/50 shadow-[0_8px_30px_rgb(5,3,21,0.04)]">
                                <ImageSlider images={imageList} />
                            </div>

                            <div className="space-y-6">
                                
                                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#dedcff]/50 shadow-[0_8px_30px_rgb(5,3,21,0.04)]">
                                    <h1 className="text-2xl sm:text-3xl font-black text-[#050315] mb-3 tracking-tight">
                                        {item.name}
                                    </h1>
                                    <span className="inline-block px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-[#dedcff] text-[#2f27ce]">
                                        {item.category}
                                    </span>
                                    {item.description?.trim() && (
                                        <p className="text-[#050315]/70 mt-5 leading-relaxed text-sm sm:text-base font-medium wrap-break-word whitespace-pre-line max-h-36 overflow-y-auto pr-1">
                                            {item.description}
                                        </p>
                                    )}
                                </div>

                                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#dedcff]/50 shadow-[0_8px_30px_rgb(5,3,21,0.04)]">
                                    <h3 className="text-[11px] font-black text-[#050315]/50 uppercase tracking-widest mb-2">Pricing</h3>
                                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                        <p className="text-3xl font-black text-[#2f27ce] tracking-tighter">
                                            Rs. {(item.price || 0).toLocaleString()}
                                        </p>
                                        <p className="text-[#050315]/40 text-xs font-bold">Base unit price</p>
                                    </div>

                                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border border-[#dedcff] rounded-xl p-1.5 ">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-[#050315]/50 ">
                                            Quantity
                                        </label>
                                        <div className="flex items-center gap-3 bg-[#fbfbfe]">
                                            <button
                                                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-[#dedcff] text-[#2f27ce] font-black text-xl hover:bg-[#dedcff] active:scale-95 transition-all"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                max="99"
                                                value={quantity}
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value, 10);
                                                    if (!Number.isNaN(value) && value >= 1 && value <= 99) {
                                                        setQuantity(value);
                                                    }
                                                }}
                                                className="w-16 px-1 text-center rounded-lg bg-transparent text-[#050315] font-black text-lg focus:outline-none focus:ring-2 focus:ring-[#2f27ce]/30"
                                            />
                                            <button
                                                onClick={() => setQuantity((prev) => Math.min(99, prev + 1))}
                                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-[#dedcff] text-[#2f27ce] font-black text-xl hover:bg-[#dedcff] active:scale-95 transition-all"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-6 border-t border-[#dedcff]/50 pt-5">
                                        <p className="text-[11px] font-black text-[#050315]/50 uppercase tracking-widest mb-1">Total Price</p>
                                        <p className="text-xl font-black text-[#050315]">
                                            Rs. {totalPrice.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-6 border border-[#dedcff]/50 shadow-[0_8px_30px_rgb(5,3,21,0.04)]">
                                    <h3 className="text-[11px] font-black text-[#050315]/50 uppercase tracking-widest mb-4">Actions</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                                        <button
                                            onClick={handleBuyNow}
                                            disabled={!isLoggedIn}
                                            className="w-full font-semibold py-3 rounded-xl transition-all duration-300 disabled:bg-[#dedcff] disabled:text-[#050315]/40 disabled:cursor-not-allowed bg-[#2f27ce] hover:bg-[#433bff] text-white shadow-lg shadow-[#2f27ce]/20 disabled:shadow-none"
                                        >
                                            {!isLoggedIn ? "Login to Continue" : "Buy Now"}
                                        </button>

                                        <button
                                            onClick={() => navigate("/furniture")}
                                            className="w-full font-medium py-3 rounded-xl border-2 border-[#dedcff] text-[#050315] hover:bg-white/10 transition-colors duration-200"
                                        >
                                            Back to Furniture List
                                        </button>

                                        <button
                                            onClick={handleViewIn3D}
                                            className="w-full font-medium py-3 rounded-xl border-2 border-[#dedcff] text-[#050315] hover:bg-white/10 transition-colors duration-200 flex items-center justify-center gap-2 text-sm md:col-span-2 lg:col-span-1"
                                        >
                                            View in 3D <span className="text-xl leading-none">&rarr;</span>
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}