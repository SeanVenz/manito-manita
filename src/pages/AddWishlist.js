import React, { useEffect, useState } from 'react';
import { confirmDelete, submitWishlist } from '../utils/actions';
import useGetManito from '../hooks/useGetManito';
import Loading from '../components/Loading';
import Invalid from '../components/Invalid';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';
import { handleImageChangeWishList, handleRemoveImageInFirebase, handleSubmitWishlist, handleWishListChange, removeImage } from '../utils/utils';

function AddWishlist() {
  const [wishList, setWishList] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadedImagesUrls, setUploadedImagesUrls] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const urlParts = window.location.pathname.split('/');
  const secondId = urlParts[urlParts.length - 1];
  const firstId = urlParts[urlParts.length - 2];
  const thirdId = urlParts[urlParts.length - 3];
  const navigate = useNavigate();

  const { manito, codeName, isValid, isLoading, image, refetch, storedWishList } = useGetManito(firstId, secondId);

  useEffect(() => {
    if (storedWishList !== undefined) {
      setWishList(storedWishList);
    }
  }, [storedWishList]);

  const viewWishLists = () => {
    navigate(`${thirdId}/${firstId}/wishlist`);
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  if (isLoading) {
    return <Loading />;
  }

  if (!isValid) {
    return <Invalid />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Form Container */}
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full text-center">
        {/* View Wishlists Button */}
        <button
          onClick={viewWishLists}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md mb-6 w-full transition duration-150"
        >
          View Wishlists
        </button>

        {/* Codename Section */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Your codename is: <span className="text-xl font-bold text-black">{codeName}</span>
        </h2>

        {/* Wishlist Input */}
        <label htmlFor="wishlist" className="block text-gray-600 text-left mb-2">
          Input your wishlist here:
        </label>
        <textarea
          id="wishlist"
          className="w-full h-28 p-3 border rounded-md border-gray-300 focus:outline-none focus:border-red-500 mb-4 resize-none"
          placeholder="Type your wishlist here..."
          onChange={(e) => handleWishListChange(e, setWishList)}
          value={wishList}
        />

        {error && (
          <div className="mb-4 p-3 borde text-red-500 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* File Upload Section */}
        <label htmlFor="file-upload" className="block text-gray-600 text-left mb-2">
          Upload your images:
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleImageChangeWishList(e, images, setImages, setImagePreviews)}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-red-600 file:text-white
            hover:file:bg-red-700 mb-4 transition duration-150"
        />

        {imagePreviews.length > 0 && (
          <div className="mb-3">
            <p className="font-medium mb-2 text-gray-700">Preview:</p>
            <div className="flex flex-wrap gap-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`preview ${index}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    onClick={() => removeImage(index, images, setImages, imagePreviews, setImagePreviews)}
                    className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="button"
          disabled={isSubmitting}
          className={`bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md w-full transition duration-150 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => handleSubmitWishlist(setIsSubmitting, submitWishlist, firstId, secondId, wishList, images, setUploadedImagesUrls, setImages, setImagePreviews, refetch, setError)}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>

        {/* Manito Section */}
        <h2 className="text-lg font-semibold text-gray-800 mt-6">
          Your manito is: <span className="text-xl font-bold text-black">{manito}</span>
        </h2>
        {image && image.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold mb-2">Your Uploaded Images:</p>
            <div className="flex flex-wrap gap-4">
              {image.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`uploaded ${index}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <button
                    onClick={() => handleRemoveImageInFirebase(url, setImageToDelete, setIsModalOpen)}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal for Image Deletion */}
      {isModalOpen && (
        <ConfirmationModal
          setIsModalOpen={setIsModalOpen}
          confirmDelete={() => confirmDelete(imageToDelete, firstId, secondId, setIsModalOpen, setImageToDelete, refetch)}
        />
      )}
    </div>
  );
}

export default AddWishlist;
