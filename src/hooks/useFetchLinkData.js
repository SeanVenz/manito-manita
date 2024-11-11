import { useEffect, useState } from 'react';
import { addDoc, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { faker } from '@faker-js/faker';

const generateNames = (memberCount) => {
  return Array.from({ length: memberCount }, () => faker.name.firstName());
};

const useFetchLinkData = (linkId) => {
  const [linkData, setLinkData] = useState(null);
  const [names, setNames] = useState([]);
  const [isValid, setIsValid] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    const fetchLinkData = async () => {
      if (dataFetched) return;
      setDataFetched(true);

      try {
        const docRef = doc(db, 'links', linkId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setLinkData(data);

          const memberCount = data.member || 0; // Default to 0 if undefined
          const namesCollectionRef = collection(db, 'links', linkId, 'names');
          const namesSnapshot = await getDocs(namesCollectionRef);

          if (!namesSnapshot.empty) {
            // Existing names found in the subcollection
            const existingNames = namesSnapshot.docs.map((doc) => ({
              id: doc.id,
              name: doc.data().name,
              generatedUrl: `${window.location.origin}/${linkId}/${doc.id}`,
            }));
            setNames(existingNames);
          } else {
            // No names in the subcollection, so generate and save new names
            const newNames = generateNames(memberCount);

            const createdNames = await Promise.all(
              newNames.map(async (name) => {
                const nameDocRef = await addDoc(namesCollectionRef, { name });
                return {
                  id: nameDocRef.id,
                  name,
                  generatedUrl: `${window.location.origin}/${linkId}/${nameDocRef.id}`,
                };
              })
            );
            setNames(createdNames);
          }
        } else {
          setIsValid(false); // Document doesn't exist
        }
      } catch (error) {
        console.log("Error fetching document:", error.message);
        setIsValid(false);
      }
    };

    fetchLinkData();
  }, [linkId, dataFetched]); // Include linkId as a dependency to rerun when it changes

  return { linkData, names, isValid };
};

export default useFetchLinkData;
