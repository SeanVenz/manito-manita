import React from 'react'
import useRetrieveWishList from '../hooks/useRetrieveWishList'

function WishList() {

    const { linkData, names, isValid, isLoading } = useRetrieveWishList();

    return (

        <div>{names.map((name) => (
            <div key={name.id} className="p-2 border rounded">
                <p>{name.name}</p>
                <p>His WishLists are: {name.wishList}</p>
            </div>
        ))}</div>
    )
}

export default WishList