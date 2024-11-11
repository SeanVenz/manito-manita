import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { db } from '../firebase';

function useGetManito(firstId, secondId) {

    const [manito, setManito] = useState();
    const [codeName, setCodeName] = useState();

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
      }, [firstId, secondId]);

      return {manito, codeName};
}

export default useGetManito