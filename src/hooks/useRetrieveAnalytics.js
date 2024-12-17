import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';

function useRetrieveAnalytics() {
    const [total, setTotal] = useState();
    const [dates, setDates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let unsubscribe;
        const getTotalCollection = async () => {
            setIsLoading(true);
            try {
                const dates = [];
                const totalColleCtion = collection(db, 'links');

                unsubscribe = onSnapshot(totalColleCtion, (snapshot) => {
                    setTotal(snapshot.docs.length);
                    for (const document of snapshot.docs) {
                        dates.push(document.data()?.created.split('T')[0])
                    }
                    setDates(dates);
                    console.log(dates);
                })
            } catch (err) {
                setIsLoading(false);
            }
        };
        getTotalCollection();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        }

    }, []);

    return { total, isLoading, dates };
}

export default useRetrieveAnalytics;