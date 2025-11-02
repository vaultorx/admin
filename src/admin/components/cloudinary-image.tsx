import React from 'react';
import { BasePropertyProps } from 'adminjs';
import { Box } from '@adminjs/design-system';

// Component name matches the registration key
const CloudinaryImage = (props: BasePropertyProps) => {
  const { property, record } = props;
  const { params } = record || {};
  const imageUrl = params?.[property.name];

  if (!imageUrl) {
    return <span>No file</span>;
  }

  // Check if it's an image based on URL patterns or file extension
  const isImage = imageUrl.includes('/image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(imageUrl);

  const isVideo = imageUrl.includes('/video/') || /\.(mp4|mov|avi|webm)$/i.test(imageUrl);

  return (
    <Box>
      {isImage ? (
        <img
          src={imageUrl}
          alt="Preview"
          style={{
            maxWidth: '50px',
            maxHeight: '50px',
            objectFit: 'cover',
            borderRadius: '4px',
            border: '1px solid #e0e0e0',
          }}
        />
      ) : isVideo ? (
        <video
          src={imageUrl}
          style={{
            maxWidth: '50px',
            maxHeight: '50px',
            objectFit: 'cover',
            borderRadius: '4px',
            border: '1px solid #e0e0e0',
          }}
        />
      ) : (
        <a
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#4268F6',
            textDecoration: 'none',
            fontSize: '12px',
          }}
        >
          View File
        </a>
      )}
    </Box>
  );
};

export default CloudinaryImage;
