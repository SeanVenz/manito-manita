import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { handleNameSelect } from '../utils/actions';
import Loading from '../components/Loading';
import Invalid from '../components/Invalid';
import useRetrieveWishList from '../hooks/useRetrieveNameDetails';

function GiftDetails() {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const [selectedName, setSelectedName] = useState(null);
  const [error, setError] = useState(null);
  const storageKey = `selected-name-${linkId}`;
  const[isPickingName, setIsPickingName] = useState(false);

  const urlParts = window.location.pathname.split('/');
  const firstId = urlParts[urlParts.length - 1];

  const { names, isValid, isLoading } = useRetrieveWishList(firstId);

  useEffect(() => {
    const savedName = localStorage.getItem(storageKey);
    if (savedName) {
      setSelectedName(JSON.parse(savedName));
    }
  }, [storageKey]);

  if (isLoading) {
    return (
      <Loading />
    );
  }

  if (!isValid) {
    return (
      <Invalid />
    );
  }

  const viewWishLists = () => {
    navigate(`${window.location.pathname}/wishlist`);
  };

  const viewOwnWishlist = (nameId) => {
    navigate(`${window.location.pathname}/${nameId}`);
  };

  const availableNames = names.filter(name => !name.isTaken);

  return (
    <div className="px-4 py-8 mx-auto max-w-2xl w-full bg-off-white rounded-lg shadow-lg">
      <div className="flex justify-center mb-6">
        <button onClick={viewWishLists} className="px-6 py-3 bg-[#D2042D] text-white rounded-lg hover:bg-primary/80 
                             transition-colors duration-200 font-medium focus:outline-none 
                             focus:ring-2 focus:ring-primary focus:ring-offset-2">
          View Wishlists
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold  text-center text-gray-900 mb-4">
            {selectedName ? 'Your Selected Nickname' : 'Choose Your Nickname!'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500 border border-red-200 text-white rounded-lg text-center">
              {error}
            </div>
          )}

          {selectedName ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-lg text-gray-600 mb-2">Your nickname is:</p>
                <p className="text-2xl font-bold text-primary">{selectedName.name}</p>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => viewOwnWishlist(selectedName.nameId)}
                  className="mt-4 px-6 py-3 bg-[#D2042D] text-white rounded-lg hover:bg-primary/80 
                           transition-colors duration-200 font-medium focus:outline-none 
                           focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Create Your Wishlist
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-gray-600 mb-4">
                Once chosen, you cannot change your nickname.
              </p>
              {availableNames.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {availableNames.map((name) => (
                    <button
                      key={name.id}
                      onClick={() => handleNameSelect(name, setError, linkId, setSelectedName, storageKey, setIsPickingName)}
                      className={`p-4 text-lg border rounded-lg transition-all duration-200 focus:outline-none 
                        focus:ring-2 focus:ring-primary focus:ring-offset-2
                        ${selectedName && selectedName.id === name.id 
                          ? 'border-red-500 text-red-500' 
                          : 'border-gray-200 hover:border-primary hover:text-primary'}`}
                      disabled={isPickingName}
                    >
                      {name.name}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 
                              rounded-lg p-4 text-center">
                  No names are available at the moment.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GiftDetails;
