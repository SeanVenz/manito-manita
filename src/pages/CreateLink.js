import React, { useState } from 'react';
import { generateNames, handleCopy, handleMemberChange } from '../utils/utils';
import { createLink, deleteLink } from '../utils/actions';
import { Gift, Users } from 'lucide-react';

function CreateGift() {
  const [linkUrl, setLinkUrl] = useState("");
  const [member, setMember] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExisting, setIsExisting] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-3xl mx-auto py-8 sm:py-12 md:py-16">
        <div className="mb-8 sm:mb-12 text-center">
          <Gift className="w-12 h-12 sm:w-16 sm:h-16 text-[#D2042D] mx-auto mb-4 sm:mb-6" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3 text-gray-800">Manito-Manita</h1>
          <p className="text-base sm:text-lg text-gray-600">Create your family & friends gift exchange!</p>
          <ol className='list-decimal text-red-600 flex flex-col items-center justify-center'>
            <li className="text-base sm:text-lg text-gray-600 marker:text-red-600">Enter the number of participants and generate a unique sharing link</li>
            <li className="text-base sm:text-lg text-gray-600 marker:text-red-600">Share the link with friends and select pre-assigned names</li>
            <li className="text-base sm:text-lg text-gray-600 marker:text-red-600">Upload wishlists with photos and discover who your manito is!</li>
          </ol>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100">
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
            max="100"
            className="border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6 w-full rounded-md text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#D2042D] focus:border-transparent"
          />

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
                onClick={() => deleteLink(linkUrl, member, setIsLoading, setIsExisting, generateNames, setLinkUrl, setError)}
                disabled={isLoading || !member}
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
                  onClick={() => createLink(member, setIsLoading, setIsExisting, generateNames, setLinkUrl, setError)}
                  disabled={isLoading || !member}
                >
                  {isLoading ? 'Creating...' : 'Generate Secret Santa Links'}
                </button>
              )}
            </>
          )}

          <p className="text-base mb-0 mt-2 text-red-500 text-center">P.S. You can join lots of Manito-Manita as long as you have the right link!</p>
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