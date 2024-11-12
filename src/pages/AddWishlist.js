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

  const urlParts = window.location.pathname.split('/');
  const secondId = urlParts[urlParts.length - 1];
  const firstId = urlParts[urlParts.length - 2];
  const thirdId = urlParts[urlParts.length - 3];
  const navigate = useNavigate();

  const { manito, codeName, isValid, isLoading, image, refetch, storedWishList } = useGetManito(firstId, secondId);

  // Set initial wishlist value when storedWishList is loaded
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
    <div className="p-4 max-w-2xl mx-auto">
      <button
        onClick={viewWishLists}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                  transition-colors duration-200 font-medium focus:outline-none 
                  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        View Wishlists
      </button>

      <h1 className="text-xl font-bold mb-4">Your codename is: {codeName}</h1>
      <h2 className="text-lg font-semibold mb-2">Input your wishlist here:</h2>
      <textarea
        className="w-full p-2 mb-4 bg-black text-white caret-white rounded"
        rows="4"
        onChange={(e) => handleWishListChange(e, setWishList)}
        value={wishList}
      />

      <h2 className="text-lg font-semibold mb-2">Upload your images:</h2>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleImageChangeWishList(e, images, setImages, setImagePreviews)}
        className="mb-4"
      />

      {imagePreviews.length > 0 && (
        <div className="mb-4">
          <p className="font-semibold mb-2">Preview:</p>
          <div className="flex flex-wrap gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`preview ${index}`}
                  className="w-24 h-24 object-cover rounded"
                />
                <button
                  onClick={() => removeImage(index, images, setImages, imagePreviews, setImagePreviews)}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        disabled={isSubmitting}
        className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        onClick={() => handleSubmitWishlist(setIsSubmitting, submitWishlist, firstId, secondId, wishList, images, setUploadedImagesUrls, setImages, setImagePreviews, refetch)}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>

      <p className="mt-4">Your manito is: {manito}</p>

      {image && image.length > 0 && (
        <div className="mt-4">
          <p className="font-semibold mb-2">Previously Uploaded Images:</p>
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