import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';

function AddWishlist() {

  const [wishList, setWishList] = useState();
  const [manito, setManito] = useState();
  const [codeName, setCodeName] = useState();

  const urlParts = window.location.pathname.split('/');

  const firstId = urlParts[urlParts.length - 2];
  const secondId = urlParts[urlParts.length - 1];

  useEffect(() => {
    const getManito = async () => {
      try {
        const namesDocRef = doc(db, 'links', firstId, 'names', secondId);
        const docSnap = await getDoc(namesDocRef);
        if (docSnap.exists()) {
          setManito(docSnap.data().manito);
          setCodeName(docSnap.data().name)
        }
      }
      catch (err) {
        console.log(err);
      }
    }
    getManito();
  },[])

  const submitWishlist = async () => {
    try {
      const namesDocRef = doc(db, 'links', firstId, 'names', secondId);
      // Check if the document exist
      const docSnap = await getDoc(namesDocRef);
      if (docSnap.exists()) {
        await updateDoc(namesDocRef, { wishList });
      } else {
        console.log('Document does not exist');
      }
    } catch (error) {
      console.error("Error fetching document:", error.message);
    } finally {
      console.log('done');
    }
  }

  return (
    <div>
      <h1>You're codename is: {codeName}</h1>
      <h2>Input your manito here:</h2>
      <input
        type='textarea'
        className='bg-black text-white caret-white'
        onChange={(e) => setWishList(e.target.value)}
      />
      <button type="button" onClick={submitWishlist}>Submit</button>
      <p>Your manito is: {manito}</p>
    </div>
  )
}

export default AddWishlist