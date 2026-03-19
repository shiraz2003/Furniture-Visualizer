import { useState, useRef, useEffect } from "react";

export default function ImageSlider({ images }) {
    const imageList = images || [];
    const [activeIndex, setActiveIndex] = useState(0);
    const thumbnailContainerRef = useRef(null);

    // Scroll functions for arrow navigation
    const scrollLeft = () => {
        if (thumbnailContainerRef.current) {
            thumbnailContainerRef.current.scrollBy({ left: -120, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (thumbnailContainerRef.current) {
            thumbnailContainerRef.current.scrollBy({ left: 120, behavior: 'smooth' });
        }
    };

    // Add passive touch event listeners to prevent scroll blocking
    useEffect(() => {
        const container = thumbnailContainerRef.current;
        if (container) {
            const handleTouchStart = (e) => {
                // Handle touch start passively
            };

            const handleTouchMove = (e) => {
                // Handle touch move passively
            };

            // Add passive listeners to prevent scroll blocking warnings
            container.addEventListener('touchstart', handleTouchStart, { passive: true });
            container.addEventListener('touchmove', handleTouchMove, { passive: true });

            return () => {
                container.removeEventListener('touchstart', handleTouchStart);
                container.removeEventListener('touchmove', handleTouchMove);
            };
        }
    }, []);
    
    if (!imageList || imageList.length === 0) {
        return <div className="w-full h-96 flex justify-center items-center rounded-lg" style={{ backgroundColor: 'var(--card-background)', color: '#6B7280' }}>No images available</div>;
    }
    
    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-4 p-4">
            {/* Active Image Display */}
            <div className="w-full max-w-lg h-[600px] flex justify-center items-center rounded-lg overflow-hidden" style={{ backgroundColor: '#F3F4F6', boxShadow: '0 4px 12px var(--shadow-color)' }}>
                <img 
                    src={imageList[activeIndex]} 
                    className="w-full h-full object-cover object-center" 
                    alt={`Bike image ${activeIndex + 1}`}
                />
            </div>
            
            {/* Thumbnail Navigation */}
            <div className="w-full relative">
                {/* Left Arrow */}
                {imageList.length > 3 && (
                    <button
                        onClick={scrollLeft}
                        className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200"
                        style={{ 
                            border: '1px solid var(--section-divider)',
                            color: 'var(--brand-primary)'
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                        </svg>
                    </button>
                )}
                
                <div 
                    ref={thumbnailContainerRef}
                    className="flex gap-3 overflow-x-auto pb-3 px-4 mx-auto scrollbar-hide"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        maxWidth: '320px',
                        width: '100%',
                        touchAction: 'pan-x', // Allow only horizontal panning
                        WebkitOverflowScrolling: 'touch' // Smooth scrolling on iOS
                    }}
                >
                    {imageList.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            className="w-24 h-24 object-cover object-center rounded-lg cursor-pointer shrink-0 hover:opacity-75 hover:scale-105 transform transition-all duration-300"
                            style={{
                                border: index === activeIndex 
                                    ? '3px solid var(--brand-primary)' 
                                    : '1px solid var(--section-divider)',
                                boxShadow: index === activeIndex 
                                    ? '0 4px 12px var(--shadow-color)' 
                                    : '0 2px 4px rgba(0,0,0,0.1)',
                                minWidth: '96px'
                            }}
                            onClick={() => setActiveIndex(index)}
                            alt={`Thumbnail ${index + 1}`}
                        />
                    ))}
                </div>
                
                {/* Right Arrow */}
                {imageList.length > 3 && (
                    <button
                        onClick={scrollRight}
                        className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200"
                        style={{ 
                            border: '1px solid var(--section-divider)',
                            color: 'var(--brand-primary)'
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                        </svg>
                    </button>
                )}
                
                <style >{`
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                    .scrollbar-hide {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
            </div>
        </div>
    );
}