import React, { useState } from 'react';
import { FormGroup, Label, FormMessage, Box, Icon } from '@adminjs/design-system';
import { BasePropertyProps } from 'adminjs';

// Component name matches the registration key
const CloudinaryUpload = (props: BasePropertyProps) => {
  const { property, onChange, record } = props;
  const { params } = record || {};
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // Create a preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }

      // Convert file to base64 for the backend to process
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;

        // Pass the file data to AdminJS
        onChange(property.name, base64);

        // Also store file metadata for the before hook to use
        onChange(
          `${property.name}Meta`,
          JSON.stringify({
            name: file.name,
            size: file.size,
            type: file.type,
          })
        );

        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing file:', error);
      setUploading(false);
    }
  };

  const currentValue = params?.[property.name];

  // Check if current value is an image
  const isImage =
    currentValue &&
    (currentValue.includes('/image/') ||
      /\.(jpg|jpeg|png|gif|webp)$/i.test(currentValue) ||
      currentValue.startsWith('data:image/'));

  const isVideo = currentValue && (currentValue.includes('/video/') || /\.(mp4|mov|avi|webm)$/i.test(currentValue));

  return (
    <FormGroup>
      <Label>{property.label}</Label>

      <Box mb="default">
        <input
          type="file"
          accept="image/*,video/*,audio/*"
          onChange={handleFileChange}
          disabled={uploading}
          style={{
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '100%',
            cursor: uploading ? 'not-allowed' : 'pointer',
          }}
        />
      </Box>

      {uploading && (
        <Box mb="default" style={{ color: '#4268F6' }}>
          Processing file...
        </Box>
      )}

      {/* Show preview for newly selected image */}
      {preview && (
        <Box mb="default">
          <p style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Preview:</p>
          <img
            src={preview}
            alt="Preview"
            style={{
              maxWidth: '200px',
              maxHeight: '200px',
              borderRadius: '4px',
              border: '1px solid #e0e0e0',
            }}
          />
        </Box>
      )}

      {/* Show current file if exists */}
      {currentValue && !preview && (
        <Box mb="default">
          <p style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Current file:</p>
          {isImage ? (
            <img
              src={currentValue}
              alt="Current"
              style={{
                maxWidth: '200px',
                maxHeight: '200px',
                borderRadius: '4px',
                border: '1px solid #e0e0e0',
              }}
            />
          ) : isVideo ? (
            <video
              src={currentValue}
              controls
              style={{
                maxWidth: '300px',
                maxHeight: '200px',
                borderRadius: '4px',
                border: '1px solid #e0e0e0',
              }}
            />
          ) : (
            <a
              href={currentValue}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#4268F6',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              View current file
              <Icon icon="ExternalLink" size={16} />
            </a>
          )}
        </Box>
      )}

      <FormMessage />
    </FormGroup>
  );
};

export default CloudinaryUpload;
