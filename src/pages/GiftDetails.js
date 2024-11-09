import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

function GiftDetails() {
  const { linkId } = useParams(); // Retrieves linkId from the URL
  const [linkData, setLinkData] = useState(null);

  return (
    <div>
      <h1>Link Details for ID: {linkId}</h1>
      {/* <p>Data: {JSON.stringify(linkData)}</p> */}
      {/* Display specific fields from linkData as needed */}
    </div>
  );
}

export default GiftDetails;
