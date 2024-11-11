import { addDoc, collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { faker } from '@faker-js/faker';

const generateNames = (memberCount) => {
  return Array.from({ length: memberCount }, () => faker.name.firstName());
};

const assignPairs = (names) => {
  let receivers = [...names];
  let givers = [...names];
  let pairs = [];

  // Fisher-Yates shuffle for receivers
  for (let i = receivers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [receivers[i], receivers[j]] = [receivers[j], receivers[i]];
  }

  // Ensure no self-assignments
  for (let i = 0; i < givers.length; i++) {
    if (receivers[i] === givers[i]) {
      // Swap with the next person (cyclically)
      const nextIndex = (i + 1) % givers.length;
      [receivers[i], receivers[nextIndex]] = [receivers[nextIndex], receivers[i]];
    }
  }

  // Create pairs
  for (let i = 0; i < givers.length; i++) {
    pairs.push({
      giver: givers[i],
      receiver: receivers[i]
    });
  }

  return pairs;
};

function CreateGift() {
  const [linkUrl, setLinkUrl] = useState("");
  const [member, setMember] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [isExisting, setIsExisting] = useState(false);

  const createLink = async () => {
    if (!member) return;
    setIsLoading(true);
    
    try {
      let linkId;
      let generatedUrl = localStorage.getItem('generatedUrl');
      
      if (generatedUrl) {
        linkId = generatedUrl.split('/').pop();
        setIsExisting(true);
      } else {
        // Create the main document
        const linkRef = await addDoc(collection(db, "links"), {
          member: Number(member),
          created: new Date().toISOString()
        });
        
        linkId = linkRef.id;
        generatedUrl = `${window.location.origin}/${linkId}`;
        
        // Generate names
        const names = generateNames(Number(member));
        console.log('Generated names:', names); // Debug log

        // Assign pairs
        const pairs = assignPairs(names);
        console.log('Generated pairs:', pairs); // Debug log

        // Use a batch write to ensure all documents are created
        const batch = writeBatch(db);
        const namesCollectionRef = collection(db, 'links', linkId, 'names');

        // Add each name document to the batch
        pairs.forEach((pair) => {
          const newNameRef = doc(namesCollectionRef);
          batch.set(newNameRef, {
            name: pair.giver,
            manito: pair.receiver,
            created: new Date().toISOString()
          });
        });

        // Commit the batch
        await batch.commit();
        console.log('Batch write completed'); // Debug log

        localStorage.setItem('generatedUrl', generatedUrl);
      }
      
      setLinkUrl(generatedUrl);
      
    } catch (err) {
      console.error("Error creating link:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMemberChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) > 0 && Number(value) <= 100)) {
      setMember(value);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a link for your family / friends manito manita!</h1>
      <p className="mb-2">Input the number of people you want</p>
      <input
        type="number"
        value={member}
        onChange={handleMemberChange}
        placeholder="Enter member number"
        required
        min="1"
        max="100"
        className="border p-2 mb-4 w-full rounded"
      />
      <button 
        className="bg-black text-white p-2 rounded w-full disabled:bg-gray-400"
        onClick={createLink}
        disabled={isLoading || !member}
      >
        {isLoading ? 'Creating...' : 'Click me maniga'}
      </button>
      {isExisting ? (
        <p className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          You have an existing Link: <a href={linkUrl} className="text-blue-600 hover:underline" rel="noopener noreferrer">{linkUrl}</a>
        </p>
      ) : (
        linkUrl && (
          <p className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            Here's Your Link: <a href={linkUrl} className="text-blue-600 hover:underline" rel="noopener noreferrer">{linkUrl}</a>
          </p>
        )
      )}
    </div>
  );
}

export default CreateGift;