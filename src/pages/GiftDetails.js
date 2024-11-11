import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetchLinkData from '../hooks/useFetchLinkData';

function GiftDetails() {
  const { linkId } = useParams();
  const { linkData, names, isValid } = useFetchLinkData(linkId);

  return (
    <div>
      {isValid ? (
        <div>
          <h1>Link Details for ID: {linkId}</h1>

          {names.length > 0 && (
            <div>
              <h2>Generated Names:</h2>
              <ul>
                {names.map((name) => (
                  <a href={name.generatedUrl} rel="noreferrer" key={name.id}>{name.name}</a>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p>Invalid link</p>
      )}
    </div>
  );
}

export default GiftDetails;
