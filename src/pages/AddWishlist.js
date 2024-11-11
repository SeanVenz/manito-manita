import React, { useEffect, useState } from 'react';
import { submitWishlist } from '../utils/actions';
import useGetManito from '../hooks/useGetManito';
import Loading from '../components/Loading';
import Invalid from '../components/Invalid';
import { X } from 'lucide-react';

function AddWishlist() {
  const [wishList, setWishList] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadedImagesUrls, setUploadedImagesUrls] = useState([]);

  const urlParts = window.location.pathname.split('/');
  const firstId = urlParts[urlParts.length - 2];
  const secondId = urlParts[urlParts.length - 1];

  const { manito, codeName, isValid, isLoading, image } = useGetManito(firstId, secondId);

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
  }, []);

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
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => submitWishlist(firstId, secondId, wishList, images, setUploadedImagesUrls)}
      >
        Submit
      </button>

      <p className="mt-4">Your manito is: {manito}</p>

      {/* Previously uploaded images */}
      {image && image.length > 0 && (
        <div className="mt-4">
          <p className="font-semibold mb-2">Previously Uploaded Images:</p>
          <div className="flex flex-wrap gap-4">
            {image.map((url, index) => (
              <div key={index}>
                <img
                  src={url}
                  alt={`uploaded ${index}`}
                  className="w-24 h-24 object-cover rounded"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AddWishlist;