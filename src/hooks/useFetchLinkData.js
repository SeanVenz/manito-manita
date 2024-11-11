import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const useFetchLinkData = (linkId) => {
  const [linkData, setLinkData] = useState(null);
  const [names, setNames] = useState([]);
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLinkData = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, 'links', linkId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setIsValid(false);
          return;
        }

        const data = docSnap.data();
        setLinkData(data);

        const namesCollectionRef = collection(db, 'links', linkId, 'names');
        const namesSnapshot = await getDocs(namesCollectionRef);
        
        const existingNames = namesSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          generatedUrl: `${window.location.origin}/${linkId}/${doc.id}`,
          manito: doc.data().manito
        }));
        
        setNames(existingNames);
        
      } catch (error) {
        console.error("Error fetching document:", error.message);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinkData();
  }, [linkId]);

  return { linkData, names, isValid, isLoading };
};

export default useFetchLinkData;