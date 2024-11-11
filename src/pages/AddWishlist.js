import React, { useState } from 'react';
import { submitWishlist } from '../utils/actions';
import useGetManito from '../hooks/useGetManito';
import { handleImageChange } from '../utils/utils';

function AddWishlist() {
  const [wishList, setWishList] = useState();
  const [images, setImages] = useState([]);
  const [uploadedImagesUrls, setUploadedImagesUrls] = useState([]);

  const urlParts = window.location.pathname.split('/');
  const firstId = urlParts[urlParts.length - 2];
  const secondId = urlParts[urlParts.length - 1];

  const {manito, codeName} = useGetManito(firstId, secondId)

  return (
    <div>
      <h1>Your codename is: {codeName}</h1>
      <h2>Input your manito here:</h2>
      <input
        type='textarea'
        className='bg-black text-white caret-white'
        onChange={(e) => setWishList(e.target.value)}
      />
      <h2>Upload your images:</h2>
      <input
        type='file'
        multiple
        accept='image/*'
        onChange={(e) => handleImageChange(e, setImages)}
      />
      <button type='button' onClick={() => submitWishlist(firstId, secondId, wishList, images, setUploadedImagesUrls)}>Submit</button>
      <p>Your manito is: {manito}</p>
      <div>
        <h3>Uploaded Images:</h3>
        {uploadedImagesUrls.map((url, index) => (
          <img key={index} src={url} alt={`uploaded ${index}`} style={{ width: '100px', margin: '5px' }} />
        ))}
      </div>
    </div>
  );
}

export default AddWishlist;
