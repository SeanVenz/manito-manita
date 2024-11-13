import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';

function useGetManito(firstId, secondId) {
  const [manito, setManito] = useState();
  const [codeName, setCodeName] = useState();
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImages] = useState([]);
  const [storedWishList, setStoredWishList] = useState();

  const getManito = async () => {
    setIsLoading(true);
    try {
      const namesDocRef = doc(db, 'links', firstId, 'names', secondId);
      const docSnap = await getDoc(namesDocRef);
      if (docSnap.exists()) {
        setManito(docSnap.data().manito);
        setCodeName(docSnap.data().name);
        setImages(docSnap.data()?.images || []);
        setStoredWishList(docSnap.data()?.wishList || '');
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setIsValid(false);
        return;
      }
    } catch (err) {
      setIsLoading(false);
      setIsValid(false);
    }
  };

  useEffect(() => {
    getManito();
  }, [firstId, secondId]);

  const refetch = () => {
    getManito();
  };

  return { manito, codeName, isValid, isLoading, image, refetch, storedWishList };
}

export default useGetManito;