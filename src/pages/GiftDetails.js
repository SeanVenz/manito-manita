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

  const urlParts = window.location.pathname.split('/');
  const firstId = urlParts[urlParts.length - 1];

  const {names, isValid, isLoading} = useRetrieveWishList(firstId);

  useEffect(() => {
    const savedName = localStorage.getItem(storageKey);
    if (savedName) {
      setSelectedName(JSON.parse(savedName));
    }
  }, [storageKey]);

  if (isLoading) {
    return (
      <Loading />)
  }

  if (!isValid) {
    return (
      <Invalid />
    );
  }

  const viewWishList = (nameId) => {
    navigate(`${window.location.pathname}/${nameId}`);
  };

  const availableNames = names.filter(name => !name.isTaken);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
            {selectedName ? 'Your Selected Nickname' : 'Choose Your Nickname!'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-center">
              {error}
            </div>
          )}

          {selectedName ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-lg text-gray-600 mb-2">Your nickname is:</p>
                <p className="text-2xl font-bold text-blue-600">{selectedName.name}</p>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => viewWishList(selectedName.nameId)}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                           transition-colors duration-200 font-medium focus:outline-none 
                           focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                <div className="grid grid-cols-2 gap-4">
                  {availableNames.map((name) => (
                    <button
                      key={name.id}
                      onClick={() => handleNameSelect(name, setError, linkId, setSelectedName, storageKey)}
                      className="p-4 text-lg border border-gray-200 rounded-lg hover:border-blue-500 
                               hover:text-blue-600 transition-all duration-200 focus:outline-none 
                               focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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