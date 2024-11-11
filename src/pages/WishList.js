import React from 'react';
import useRetrieveWishList from '../hooks/useRetrieveNameDetails';
import Loading from '../components/Loading';
import Invalid from '../components/Invalid';

function WishList() {

  const urlParts = window.location.pathname.split('/');
  const firstId = urlParts[urlParts.length - 2];

  const { names, isValid, isLoading } = useRetrieveWishList(firstId);

  if (isLoading) {
    return <Loading/>;
  }

  if (!isValid) {
    return (
      <Invalid />
    );
  }

  return (
    <div>
      {names.map((name) => (
        <div key={name.id} className="p-2 border rounded">
          <p><strong>{name.name}</strong></p>
          <p>Manito: {name.manito}</p>
          <p>WishList: {name.wishList || 'No wishlist provided'}</p>

          {/* Display images from Firestore if they exist */}
          {name.images && name.images.length > 0 && (
            <div>
              <h3>Uploaded Images:</h3>
              {name.images.map((url, index) => (
                <img key={index} src={url} alt={`Uploaded ${index}`} style={{ width: '100px', margin: '5px' }} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default WishList;
