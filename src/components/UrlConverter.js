import React from 'react';

const UrlConverter = ({ children }) => {
  const convertToLinks = (text) => {
    const urlRegex = /(https:\/\/[^\s]+)/g;
    
    return text.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={index} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 hover:underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <span className="whitespace-normal break-words">
      {convertToLinks(children)}
    </span>
  );
};

export default UrlConverter;