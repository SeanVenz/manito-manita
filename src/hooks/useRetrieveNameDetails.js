import { useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const useRetrieveNameDetails = (linkId) => {
  const [names, setNames] = useState([]);
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;

    const fetchLinkData = async () => {
      setIsLoading(true);
      try {
        const namesCollectionRef = collection(db, 'links', linkId, 'names');
        const docRef = await getDocs(namesCollectionRef);
        if(docRef.empty){
          setIsLoading(false);
          setIsValid(false);
          return;
        }
        unsubscribe = onSnapshot(namesCollectionRef, (snapshot) => {
          const updatedNames = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNames(updatedNames);
          setIsLoading(false); 
        });
      } catch (error) {
        setIsValid(false);
        setIsLoading(false);
      }
    };

    fetchLinkData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [linkId]);

  return { names, isValid, isLoading };
};

export default useRetrieveNameDetails;