import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const useRetrieveWishList = () => {
  const [names, setNames] = useState([]);
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const urlParts = window.location.pathname.split('/');
  const firstId = urlParts[urlParts.length - 2];

  useEffect(() => {
    const fetchLinkData = async () => {
      setIsLoading(true);
      try {
        const namesCollectionRef = collection(db, 'links', firstId, 'names');
        const unsubscribe = onSnapshot(namesCollectionRef, (snapshot) => {
          const updatedNames = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNames(updatedNames);
        });

        return () => unsubscribe();

      } catch (error) {
        console.error("Error fetching document:", error.message);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinkData();
  }, [firstId]);

  return { names, isValid, isLoading };
};

export default useRetrieveWishList;