import React, { useState } from 'react';
import useRetrieveWishList from '../hooks/useRetrieveNameDetails';
import Loading from '../components/Loading';
import Invalid from '../components/Invalid';
import WishListDetailModal from '../components/WishListDetailModal';

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
    return (
      <Invalid />
    );
  }

  const handleSelectedName = (name) => {
    setSelectedName(name);
    setIsModalOpen(true);
  }

  const handleModalOpen = () => {
    setIsModalOpen(true);
  }

  return (
    <div className="max-w-full mx-auto p-6 bg-off-white rounded-lg shadow-lg">

      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold text-[#D2042D]">Everyone's Wishlist</h2>
        <p className="text-gray-600">Explore the wishes and gift ideas of everyone!</p>
        <p className="text-gray-600">You can also edit or change your wishlist</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" >
        {names.map((name, index) => (
          <div
            key={name.id}
            className="p-4 bg-white rounded-lg shadow-md border-l-4 border-cherry-red hover:cursor-pointer"
            onClick={() => handleSelectedName(name)}
          >
            <h3 className="text-lg font-medium text-gray-900 mb-2">{name.name}</h3>
            <p className="text-gray-700 mb-2">
              Wish List: {name.wishList || 'No wishlist provided yet'}
            </p>

            {name.images && name.images.length > 0 && (
              <div>
                <h4 className="text-gray-800 font-medium mb-2">Uploaded Images:</h4>
                <div className="flex flex-wrap gap-2">
                  {name.images.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Uploaded ${index}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
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
