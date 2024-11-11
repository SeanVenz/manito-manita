import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';

function AddWishlist() {
  const [wishList, setWishList] = useState();
  const [images, setImages] = useState([]);
  const [uploadedImagesUrls, setUploadedImagesUrls] = useState([]);
  const [manito, setManito] = useState();
  const [codeName, setCodeName] = useState();

  const urlParts = window.location.pathname.split('/');
  const firstId = urlParts[urlParts.length - 2];
  const secondId = urlParts[urlParts.length - 1];
  const storage = getStorage(); // Initialize Firebase Storage

  useEffect(() => {
    const getManito = async () => {
      try {
        const namesDocRef = doc(db, 'links', firstId, 'names', secondId);
        const docSnap = await getDoc(namesDocRef);
        if (docSnap.exists()) {
          setManito(docSnap.data().manito);
          setCodeName(docSnap.data().name);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getManito();
  }, []);

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const uploadImages = async () => {
    const urls = [];
    for (const image of images) {
      const imageRef = ref(storage, `images/${firstId}/${secondId}/${image.name}`);
      await uploadBytes(imageRef, image);
      const downloadURL = await getDownloadURL(imageRef);
      urls.push(downloadURL);
    }
    setUploadedImagesUrls(urls); // Update URLs in state
    return urls;
  };

  const submitWishlist = async () => {
    try {
      const imageUrls = await uploadImages(); // Upload images first
      const namesDocRef = doc(db, 'links', firstId, 'names', secondId);

      const docSnap = await getDoc(namesDocRef);
      if (docSnap.exists()) {
        await updateDoc(namesDocRef, { wishList, images: imageUrls });
      } else {
        console.log('Document does not exist');
      }
    } catch (error) {
      console.error('Error fetching document:', error.message);
    } finally {
      console.log('done');
    }
  };

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
        onChange={handleImageChange}
      />
      <button type='button' onClick={submitWishlist}>Submit</button>
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
