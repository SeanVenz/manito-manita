import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { db } from '../firebase';

function CreateGift() {
  const [linkUrl, setLinkUrl] = useState("");
  const [member, setMember] = useState();

  const createLink = async () => {
    try {
      

      // Generate the link URL and set it in state
      let generatedUrl = localStorage.getItem('generatedUrl');
      if(generatedUrl){
          setLinkUrl(generatedUrl);
      }
      else{
        const link = await addDoc(collection(db, "links"), {
          member,  // Store the member value in Firestore
        });
        generatedUrl = `${window.location.origin}/${link.id}`;
        localStorage.setItem('generatedUrl', generatedUrl)
        setLinkUrl(generatedUrl);
      }
      

    } catch (err) {
      console.log(err.message);
    }
  };

  // Handle input change
  const handleMemberChange = (e) => {
    setMember(Number(e.target.value));
  };

  return (
    <div>
      <h1>Create a link for your family / friends manito manita!</h1>
      <p>Input the number of people you want</p>
      <input
        type="number"
        value={member}
        onChange={handleMemberChange}
        placeholder="Enter member number"
        required
        className="border p-2 mb-4"
      />
      <button className="bg-black text-white p-2" onClick={createLink}>
        Click me maniga
      </button>
      {linkUrl && (
        <p>
          Here's Your Link: <a href={linkUrl} rel="noopener noreferrer">{linkUrl}</a>
        </p>
      )}
    </div>
  );
}

export default CreateGift;
