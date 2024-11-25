import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

function WishListDetailModal({ setIsModalOpen, name }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const goToNextSlide = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === (name.images?.length - 1) ? 0 : prevIndex + 1
        );
    };

    const goToPrevSlide = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? (name.images?.length - 1) : prevIndex - 1
        );
    };

    // Function to convert comma-separated string to array and clean up items
    const getWishListItems = () => {
        if (!name.wishList) return [];
        return name.wishList.split(',').map(item => item.trim()).filter(item => item);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* Close button - now in top right corner */}
                <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute right-2 top-2 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close modal"
                >
                    <X size={20} className="text-gray-500 hover:text-gray-700" />
                </button>

                {/* Header - adjusted padding for mobile */}
                <div className="p-4 sm:p-6">
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-4 text-center">
                        {name.name}
                    </h3>
                    <div className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                        <p className="font-medium mb-2 text-center">Wish List:</p>
                        {getWishListItems().length > 0 ? (
                            <div className="grid grid-cols-1 gap-x-8 gap-y-1 max-w-2xl mx-auto px-4 max-h-60 overflow-y-auto">
                                {getWishListItems().map((item, index) => (
                                    <div key={index} className="flex items-start">
                                        <span className="text-gray-400 mr-2">•</span>
                                        <span className="whitespace-normal break-words">{item}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center">No wishlist provided yet</p>
                        )}
                    </div>
                </div>

                {/* Carousel */}
                {name.images && name.images.length > 0 && (
                    <div className="relative bg-gray-100 px-2 py-4 sm:p-6">
                        <div className="relative flex justify-center items-center min-h-[200px] sm:min-h-[400px]">
                            {/* Image Container */}
                            <div className="relative w-full h-[200px] sm:h-[400px] flex items-center justify-center">
                                {name.images.map((url, index) => (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 transition-opacity duration-300 flex items-center justify-center
                                            ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                                    >
                                        <img
                                            src={url}
                                            alt={`Item ${index + 1}`}
                                            className="max-h-full max-w-full object-contain rounded-lg px-8 sm:px-12"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Navigation Buttons - Adjusted for mobile */}
                            <button
                                onClick={goToPrevSlide}
                                className="absolute left-1 sm:left-4 bg-white/90 hover:bg-white text-gray-800 rounded-full 
                                    p-1.5 sm:p-2 shadow-lg transition-all hover:scale-110"
                                aria-label="Previous image"
                            >
                                <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
                            </button>
                            <button
                                onClick={goToNextSlide}
                                className="absolute right-1 sm:right-4 bg-white/90 hover:bg-white text-gray-800 rounded-full 
                                    p-1.5 sm:p-2 shadow-lg transition-all hover:scale-110"
                                aria-label="Next image"
                            >
                                <ChevronRight size={20} className="sm:w-6 sm:h-6" />
                            </button>
                        </div>

                        {/* Indicators - Made smaller on mobile */}
                        <div className="flex justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                            {name.images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`h-1.5 sm:h-2 rounded-full transition-all
                                        ${index === currentImageIndex
                                            ? 'bg-gray-800 w-4 sm:w-6'
                                            : 'bg-gray-400 w-1.5 sm:w-2 hover:bg-gray-600'
                                        }`}
                                    aria-label={`Go to image ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer Button */}
                <div className="p-4 sm:p-6">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="w-full px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 
                            font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WishListDetailModal;