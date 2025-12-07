import React, { useState } from 'react';
import { generateNames, handleCopy, handleMemberChange } from '../utils/utils';
import { createLink, deleteLink } from '../utils/actions';
import { Gift, Users, UserPlus, X } from 'lucide-react';
import { toast } from 'react-toastify';

function CreateGift() {
  const [linkUrl, setLinkUrl] = useState("");
  const [member, setMember] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExisting, setIsExisting] = useState(false);
  const [error, setError] = useState("");

  // Manual mode state
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualNames, setManualNames] = useState([]);
  const [nameInput, setNameInput] = useState("");
  const [bulkInput, setBulkInput] = useState("");

  // Add single name
  const handleAddName = () => {
    const trimmedName = nameInput.trim();
    if (!trimmedName) return;

    if (manualNames.some(name => name.toLowerCase() === trimmedName.toLowerCase())) {
      toast.error(`"${trimmedName}" is already in the list`);
      return;
    }

    setManualNames([...manualNames, trimmedName]);
    setNameInput("");
  };

  // Add bulk names
  const handleAddBulk = () => {
    const names = bulkInput
      .split(/[,\n]/)
      .map(name => name.trim())
      .filter(name => name.length > 0);

    if (names.length === 0) return;

    const existingLower = manualNames.map(n => n.toLowerCase());
    const uniqueNames = [];
    const duplicates = [];

    names.forEach(name => {
      const lowerName = name.toLowerCase();
      if (existingLower.includes(lowerName) || uniqueNames.some(n => n.toLowerCase() === lowerName)) {
        duplicates.push(name);
      } else {
        uniqueNames.push(name);
        existingLower.push(lowerName);
      }
    });

    if (uniqueNames.length > 0) {
      setManualNames([...manualNames, ...uniqueNames]);
    }

    if (duplicates.length > 0) {
      toast.warning(`Skipped ${duplicates.length} duplicate name(s)`);
    }

    setBulkInput("");
  };

  // Remove name
  const handleRemoveName = (index) => {
    setManualNames(manualNames.filter((_, i) => i !== index));
  };

  // Handle Enter key for single input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddName();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-3xl mx-auto py-8 sm:py-12 md:py-16">
        <div className="mb-8 sm:mb-12 text-center">
          <Gift className="w-12 h-12 sm:w-16 sm:h-16 text-[#D2042D] mx-auto mb-4 sm:mb-6" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3 text-gray-800">Manito-Manita</h1>
          <p className="text-base sm:text-lg text-gray-600">Create your family & friends gift exchange!</p>
          <ol className='list-decimal text-red-600 flex flex-col justify-start'>
            <li className="text-base sm:text-lg text-gray-600 marker:text-red-600 text-left">Enter the number of participants and generate a unique sharing link</li>
            <li className="text-base sm:text-lg text-gray-600 marker:text-red-600 text-left">Share the link with friends and select pre-assigned names</li>
            <li className="text-base sm:text-lg text-gray-600 marker:text-red-600 text-left">Upload wishlists with photos and discover who your manito is!</li>
          </ol>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100">
          {/* Mode Toggle Tabs */}
          <div className="flex mb-6 border-b border-gray-200">
            <button
              onClick={() => setIsManualMode(false)}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                !isManualMode
                  ? 'text-[#D2042D] border-b-2 border-[#D2042D]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4 inline-block mr-2" />
              Auto-Generate
            </button>
            <button
              onClick={() => setIsManualMode(true)}
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                isManualMode
                  ? 'text-[#D2042D] border-b-2 border-[#D2042D]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <UserPlus className="w-4 h-4 inline-block mr-2" />
              Manual Entry
            </button>
          </div>

          {!isManualMode ? (
            /* Auto-Generate Mode */
            <>
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#D2042D]" />
                <p className="text-base sm:text-lg text-gray-700">Number of participants</p>
              </div>

              <input
                type="number"
                value={member}
                onChange={(e) => handleMemberChange(e, setMember)}
                placeholder="Enter number of participants"
                required
                min="3"
                max="1000"
                className="border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6 w-full rounded-md text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#D2042D] focus:border-transparent"
              />
            </>
          ) : (
            /* Manual Entry Mode */
            <>
              {/* Single name input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Add one name:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter a name"
                    className="flex-1 border border-gray-200 p-3 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#D2042D] focus:border-transparent"
                  />
                  <button
                    onClick={handleAddName}
                    disabled={!nameInput.trim()}
                    className="bg-[#D2042D] text-white px-4 py-2 rounded-md hover:bg-[#B00424] transition-colors disabled:bg-gray-300"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Bulk input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Or paste multiple names (comma or newline separated):</label>
                <textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder="Alice, Bob, Charlie&#10;Diana&#10;Eve"
                  rows={3}
                  className="w-full border border-gray-200 p-3 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#D2042D] focus:border-transparent resize-none"
                />
                <button
                  onClick={handleAddBulk}
                  disabled={!bulkInput.trim()}
                  className="mt-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-300 text-sm"
                >
                  Add All Names
                </button>
              </div>

              {/* Names list */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Names ({manualNames.length}):
                  </label>
                  {manualNames.length > 0 && (
                    <button
                      onClick={() => setManualNames([])}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                {manualNames.length === 0 ? (
                  <p className="text-gray-400 text-sm italic">No names added yet. Add at least 3 names.</p>
                ) : (
                  <div className="border border-gray-200 rounded-md max-h-48 overflow-y-auto">
                    {manualNames.map((name, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                      >
                        <span className="text-gray-700">{name}</span>
                        <button
                          onClick={() => handleRemoveName(index)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {manualNames.length > 0 && manualNames.length < 3 && (
                  <p className="text-amber-600 text-sm mt-2">Add {3 - manualNames.length} more name(s) to generate a link.</p>
                )}
              </div>
            </>
          )}

          {isExisting ? (
            <div>
              <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-[#FFF5F5] border border-[#FECACA] rounded-md">
                <p className="text-base sm:text-lg text-gray-700 break-words">
                  Existing link found: <a href={linkUrl} className="text-[#D2042D] hover:underline" rel="noopener noreferrer">{linkUrl}</a>
                </p>
                <div className="flex flex-row items-center justify-center gap-2 mt-4">
                  <button
                    onClick={() => handleCopy(linkUrl)}
                    className="flex items-center justify-center font-medium bg-dark-quad text-black py-1 px-3 rounded hover:bg-dark-fifth transition duration-300"
                  >
                    <i className="bi bi-clipboard text-black"></i>
                    Copy Link
                  </button>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mt-2 sm:mt-3">Would you like to delete and create new? You can only create up to 3 links per day</p>
              </div>
              <button
                className="mt-4 sm:mt-6 bg-[#D2042D] text-white p-3 sm:p-4 rounded-md w-full text-base sm:text-lg hover:bg-[#B00424] transition-colors disabled:bg-gray-300"
                onClick={() => deleteLink(linkUrl, isManualMode ? manualNames.length : member, setIsLoading, setIsExisting, generateNames, setLinkUrl, setError, isManualMode ? manualNames : null)}
                disabled={isLoading || (isManualMode ? manualNames.length < 3 : !member)}
              >
                {isLoading ? 'Creating...' : 'Delete and Create New'}
              </button>
            </div>
          ) : (
            <>
              {linkUrl ? (
                <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-[#F0FDF4] border border-[#BBF7D0] rounded-md">
                  <p className="text-base sm:text-lg text-gray-700 break-words">
                    Your link is ready: <a href={linkUrl} className="text-[#D2042D] font-medium hover:underline" rel="noopener noreferrer">{isLoading ? 'Creating...' : linkUrl}</a>
                  </p>
                  <div className="flex flex-row items-center justify-center gap-2 mt-4">
                    <button
                      onClick={() => handleCopy(linkUrl)}
                      className="flex items-center justify-center font-medium bg-dark-quad text-black py-1 px-3 rounded hover:bg-dark-fifth transition duration-300"
                    >
                      <i className="bi bi-clipboard text-black"></i>
                      Copy Link
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="bg-[#D2042D] text-white p-3 sm:p-4 rounded-md w-full text-base sm:text-lg hover:bg-[#B00424] transition-colors disabled:bg-gray-300"
                  onClick={() => createLink(isManualMode ? manualNames.length : member, setIsLoading, setIsExisting, generateNames, setLinkUrl, setError, isManualMode ? manualNames : null)}
                  disabled={isLoading || (isManualMode ? manualNames.length < 3 : !member)}
                >
                  {isLoading ? 'Creating...' : 'Generate Secret Santa Link'}
                </button>
              )}
            </>
          )}

          <p className="text-base mb-0 mt-2 text-red-500 text-center">P.S. You can join lots of Manito-Manita as long as you have the right link!</p>
          <p className="text-base mb-0 mt-2 text-red-500 text-center">P.P.S. This only works on the browser you opened the link with!</p>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-center">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateGift;