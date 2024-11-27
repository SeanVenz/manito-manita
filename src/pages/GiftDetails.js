import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { handleNameSelect } from '../utils/actions';
import Loading from '../components/Loading';
import Invalid from '../components/Invalid';
import useRetrieveWishList from '../hooks/useRetrieveNameDetails';
import { Gift, ChevronRight, AlertCircle } from 'lucide-react';

function GiftDetails() {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const [selectedName, setSelectedName] = useState(null);
  const [error, setError] = useState(null);
  const storageKey = `selected-name-${linkId}`;
  const [isPickingName, setIsPickingName] = useState(false);

  const urlParts = window.location.pathname.split('/');
  const firstId = urlParts[urlParts.length - 1];

  const { names, isValid, isLoading } = useRetrieveWishList(firstId);

  useEffect(() => {
    const savedName = localStorage.getItem(storageKey);
    if (savedName) {
      setSelectedName(JSON.parse(savedName));
    }
  }, [storageKey]);

  if (isLoading) return <Loading />;
  if (!isValid) return <Invalid />;

  const viewWishLists = () => navigate(`${window.location.pathname}/wishlist`);
  const viewOwnWishlist = (nameId) => navigate(`${window.location.pathname}/${nameId}`);

  const availableNames = names.filter(name => !name.isTaken);
  const needsScroll = availableNames.length > 25;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Gift className="w-16 h-16 text-[#D2042D] mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {selectedName ? 'Your Selected Nickname' : 'Choose Your Nickname!'}
          </h2>
          {!selectedName && (
            <p className="text-gray-600">
              Pick a nickname to create your wishlist and join the gift exchange
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {error && (
            <div className="m-6 flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {selectedName ? (
            <div className="p-8 text-center">
              <div className="mb-8">
                <p className="text-gray-600 mb-2">Your nickname is:</p>
                <h3 className="text-3xl font-bold text-cherry-red">
                  {selectedName.name}
                </h3>
              </div>
              
              <button
                onClick={() => viewOwnWishlist(selectedName.nameId)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 
                          bg-[#D2042D] text-white rounded-lg hover:bg-red-600 
                          transition-colors duration-200 font-medium focus:outline-none 
                          focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Create Your Wishlist
                <ChevronRight className="w-4 h-4" />
              </button>
              <p className="text-base mb-0 mt-4 text-red-500 text-center">P.S. You can join lots of Manito-Manita as long as you have the right link!</p>
            </div>
          ) : (
            <div className="p-6">
              {availableNames.length > 0 ? (
                <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 
                                ${needsScroll ? 'max-h-[400px] overflow-y-auto pr-2' : ''}`}>
                  {availableNames.map((name) => (
                    <button
                      key={name.id}
                      onClick={() => handleNameSelect(
                        name, 
                        setError, 
                        linkId, 
                        setSelectedName, 
                        storageKey, 
                        setIsPickingName
                      )}
                      disabled={isPickingName}
                      className={`p-4 text-lg rounded-lg transition-all duration-200 
                        hover:scale-[1.02] focus:outline-none focus:ring-2 
                        focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50
                        ${isPickingName ? 'cursor-not-allowed' : 'cursor-pointer'}
                        ${selectedName && selectedName.id === name.id 
                          ? 'bg-red-50 text-cherry-red border-2 border-cherry-red' 
                          : 'bg-gray-50 hover:bg-red-50 hover:text-cherry-red border border-gray-200'}`}
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

        <div className="mt-6 text-center">
          <button 
            onClick={viewWishLists}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 
                      bg-gray-900 text-white rounded-lg hover:bg-gray-800 
                      transition-colors duration-200 font-medium focus:outline-none 
                      focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
          >
            View All Wishlists
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default GiftDetails;