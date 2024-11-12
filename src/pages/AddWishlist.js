import React, { useEffect, useState } from 'react';
import { submitWishlist } from '../utils/actions';
import useGetManito from '../hooks/useGetManito';
import Loading from '../components/Loading';
import Invalid from '../components/Invalid';
import { X } from 'lucide-react';
import { deleteObject, ref } from 'firebase/storage';
import { db, storage } from '../firebase';
import { arrayRemove, doc, updateDoc } from 'firebase/firestore';

function AddWishlist() {
  const [wishList, setWishList] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadedImagesUrls, setUploadedImagesUrls] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const urlParts = window.location.pathname.split('/');
  const firstId = urlParts[urlParts.length - 2];
  const secondId = urlParts[urlParts.length - 1];

  const { manito, codeName, isValid, isLoading, image, refetch } = useGetManito(firstId, secondId);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newImages = [...images, ...selectedFiles];
    setImages(newImages);

    // Create preview URLs for new images
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    // Remove image from both arrays
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);

    // Remove preview and revoke object URL to prevent memory leaks
    const previewUrl = imagePreviews[index];
    URL.revokeObjectURL(previewUrl);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
  };

  // Cleanup previews when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleRemoveImageInFirebase = (url) => {
    setImageToDelete(url);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const imageUrl = imageToDelete;
      
      // 1. Delete from Storage
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      
      // 2. Update Firestore
      const docRef = doc(db, 'links', firstId, 'names', secondId);
      await updateDoc(docRef, {
        images: arrayRemove(imageUrl)
      });

      // 3. Close modal and reset state
      setIsModalOpen(false);
      setImageToDelete(null);
      
      // 4. Refetch the data to update UI
      refetch();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleSubmitWishlist = async () => {
    try {
      setIsSubmitting(true);
      await submitWishlist(firstId, secondId, wishList, images, setUploadedImagesUrls);
      
      // Clear form
      setWishList('');
      setImages([]);
      setImagePreviews([]);
      
      // Refresh the data to show new images
      await refetch();
      
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error submitting wishlist:', error);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!isValid) {
    return <Invalid />;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Your codename is: {codeName}</h1>
      <h2 className="text-lg font-semibold mb-2">Input your wishlist here:</h2>
      <textarea
        className="w-full p-2 mb-4 bg-black text-white caret-white rounded"
        rows="4"
        onChange={(e) => setWishList(e.target.value)}
        value={wishList}
      />
      
      <h2 className="text-lg font-semibold mb-2">Upload your images:</h2>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />

      {/* Preview of images to be uploaded */}
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
                  onClick={() => removeImage(index)}
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
        className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={handleSubmitWishlist}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>

      <p className="mt-4">Your manito is: {manito}</p>

      {/* Previously uploaded images */}
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
                  onClick={() => handleRemoveImageInFirebase(url)}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Image</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this image? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddWishlist;