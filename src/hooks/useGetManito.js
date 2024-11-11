import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { db } from '../firebase';

function useGetManito(firstId, secondId) {

  const [manito, setManito] = useState();
  const [codeName, setCodeName] = useState();
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImages] = useState([]);

  useEffect(() => {
    const getManito = async () => {
      setIsLoading(true)
      try {
        const namesDocRef = doc(db, 'links', firstId, 'names', secondId);
        const docSnap = await getDoc(namesDocRef);
        if (docSnap.exists()) {
          setManito(docSnap.data().manito);
          setCodeName(docSnap.data().name);
          setImages(docSnap.data()?.images || null);
          setIsLoading(false);
        }
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setIsValid(false);
      }
    };
    getManito();
  }, [firstId, secondId]);

  return { manito, codeName, isValid, isLoading, image };
}

export default useGetManito