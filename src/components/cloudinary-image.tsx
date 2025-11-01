/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { BasePropertyProps } from 'adminjs';

function CloudinaryImage(props: BasePropertyProps) {
  const { property, record } = props;
  const { params } = record || {};
  const imageUrl = params?.[property.name];

  if (!imageUrl) {
    return <span>No image</span>;
  }

  return (
    <div>
      {imageUrl.includes('image') ? (
        <img src={imageUrl} alt="Preview" style={{ maxWidth: '50px', maxHeight: '50px', objectFit: 'cover' }} />
      ) : (
        <a href={imageUrl} target="_blank" rel="noopener noreferrer">
          View File
        </a>
      )}
    </div>
  );
}

export default CloudinaryImage;
