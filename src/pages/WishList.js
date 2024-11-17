import React, { useState } from 'react';
import useRetrieveWishList from '../hooks/useRetrieveNameDetails';
import Loading from '../components/Loading';
import Invalid from '../components/Invalid';
import WishListDetailModal from '../components/WishListDetailModal';
import { Gift, Image as ImageIcon, ChevronRight } from 'lucide-react';

function WishList() {
  const urlParts = window.location.pathname.split('/');
  const firstId = urlParts[urlParts.length - 2];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedName, setSelectedName] = useState('');

  const { names, isValid, isLoading } = useRetrieveWishList(firstId);

  if (isLoading) {
    return <Loading />;
  }

  if (!isValid) {
    return <Invalid />;
  }

  const handleSelectedName = (name) => {
    setSelectedName(name);
    setIsModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-red-50 to-white py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Gift className="w-16 h-16 text-[#D2042D] mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everyone's Wishlist
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore gift ideas and wishes from your loved ones. Make this holiday season special!
            </p>
          </div>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {names.map((name) => (
            <div
              key={name.id}
              onClick={() => handleSelectedName(name)}
              className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 
                        overflow-hidden cursor-pointer border border-gray-100"
            >
              {/* Card Header */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {name.name}
                    </h3>
                    {name.images && name.images.length > 0 && (
                      <span className="inline-flex items-center text-sm text-gray-500">
                        <ImageIcon size={16} className="mr-1" />
                        {name.images.length} {name.images.length === 1 ? 'image' : 'images'}
                      </span>
                    )}
                  </div>
                  <ChevronRight 
                    className="text-gray-400 group-hover:text-cherry-red group-hover:translate-x-1 transition-all" 
                    size={20} 
                  />
                </div>

                {/* Wishlist Text */}
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {name.wishList || 'No wishlist provided yet'}
                </p>

                {/* Image Preview */}
                {name.images && name.images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {name.images.slice(0, 4).map((url, index) => (
                      <div key={index} className="relative flex-none">
                        <img
                          src={url}
                          alt={`${name.name}'s wish ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        {index === 3 && name.images.length > 4 && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                            <span className="text-white font-medium">
                              +{name.images.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="px-6 py-4 bg-gray-50 group-hover:bg-gray-100 transition-colors">
                <span className="text-sm text-gray-600 group-hover:text-gray-900">
                  Click to view details
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <WishListDetailModal
          setIsModalOpen={setIsModalOpen}
          name={selectedName}
        />
      )}
    </div>
  );
}

export default WishList;