import { useEffect, useState } from 'react'

function useGetName(storageKey) {

    const [name, setSelectedName] = useState();

    useEffect(() => {
        const savedName = localStorage.getItem(storageKey);
        if (savedName) {
            setSelectedName(JSON.parse(savedName));
        }
    }, [storageKey]);

    return { name };
}

export default useGetName