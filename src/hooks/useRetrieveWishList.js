import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const useRetrieveWishList = () => {
  const [linkData, setLinkData] = useState(null);
  const [names, setNames] = useState([]);
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const urlParts = window.location.pathname.split('/');
  const firstId = urlParts[urlParts.length - 2];

  useEffect(() => {
    const fetchLinkData = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, 'links', firstId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setIsValid(false);
          return;
        }

        const data = docSnap.data();
        setLinkData(data);

        const namesCollectionRef = collection(db, 'links', firstId, 'names');
        const namesSnapshot = await getDocs(namesCollectionRef);
        
        const existingNames = namesSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          generatedUrl: `${window.location.origin}/${firstId}/${doc.id}`,
          manito: doc.data().manito,
          wishList: doc.data().wishList,
        }));
        
        setNames(existingNames);
        console.log(existingNames)
        
      } catch (error) {
        console.error("Error fetching document:", error.message);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinkData();
  }, [firstId]);

  return { linkData, names, isValid, isLoading };
};

export default useRetrieveWishList;