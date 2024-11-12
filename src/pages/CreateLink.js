import React, { useState } from 'react';
import { generateNames, handleMemberChange } from '../utils/utils';
import { createLink, deleteLink } from '../utils/actions';

function CreateGift() {
  const [linkUrl, setLinkUrl] = useState("");
  const [member, setMember] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExisting, setIsExisting] = useState(false);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a link for your family / friends manito manita!</h1>
      <p className="mb-2">Input the number of people you want</p>
      <input
        type="number"
        value={member}
        onChange={(e) => handleMemberChange(e, setMember)}
        placeholder="Enter member number"
        required
        min="1"
        max="100"
        className="border p-2 mb-4 w-full rounded"
      />
      {isExisting ? (
        <>
          <div>
            <p className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              Oops, it seems like you have an existing Link: <a href={linkUrl} className="text-blue-600 hover:underline" rel="noopener noreferrer">{linkUrl}</a>
              <br />Delete existing link and create new?
            </p>
            <button
              className="bg-black text-white p-2 rounded w-full disabled:bg-gray-400"
              onClick={() => deleteLink(linkUrl, member, setIsLoading, setIsExisting, generateNames, setLinkUrl)}
              disabled={isLoading || !member}
            >
              {isLoading ? 'Creating...' : 'Delete and Create New'}
            </button>
          </div>
        </>
      ) : (
        <>
          {linkUrl ? (
            <p className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
              Here's Your Link: <a href={linkUrl} className="text-blue-600 hover:underline" rel="noopener noreferrer">{isLoading ? 'Creating...' : linkUrl}</a>
            </p>
          ) : (
            <button
              className="bg-black text-white p-2 rounded w-full disabled:bg-gray-400"
              onClick={() => createLink(member, setIsLoading, setIsExisting, generateNames, setLinkUrl)}
              disabled={isLoading || !member}
            >
              {isLoading ? 'Creating...' : 'Create'}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default CreateGift;
