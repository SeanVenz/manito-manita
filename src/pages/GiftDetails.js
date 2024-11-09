import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { faker } from '@faker-js/faker';

function GiftDetails() {
  const { linkId } = useParams(); // Retrieves linkId from the URL
  const [linkData, setLinkData] = useState(null);
  const [names, setNames] = useState([]);
  const [memberCount, setMemberCount] = useState(10);


  const generateNames = () => {
    const generatedNames = Array.from({ length: memberCount }, () => faker.name.firstName());
    setNames(generatedNames);
  };

  return (
    <div>
      <h1>Link Details for ID: {linkId}</h1>
      {/* <p>Data: {JSON.stringify(linkData)}</p> */}
      {/* Display specific fields from linkData as needed */}

      <button className="bg-black text-white p-2" onClick={generateNames}>
        Generate Names
      </button>

      {names.length > 0 && (
        <div>
          <h2>Generated Names:</h2>
          <ul>
            {names.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default GiftDetails;
