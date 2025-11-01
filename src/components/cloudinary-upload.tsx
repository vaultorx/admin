import React from 'react';
import { FormGroup, Label, FormMessage } from '@adminjs/design-system';
import { BasePropertyProps } from 'adminjs';

function CloudinaryUpload(props: BasePropertyProps) {
  const { property, onChange, record } = props;
  const { params } = record || {};

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a proper file object that AdminJS can handle
      // For now, we'll create a simple object that the before hook can process
      const fileObject = {
        name: file.name,
        size: file.size,
        type: file.type,
        // We'll handle the actual file upload in the before hook
        // For now, we just pass the file object
        file,
      };

      onChange(property.name, fileObject);
    }
  };

  const currentValue = params?.[property.name];

  return (
    <FormGroup>
      <Label>{property.label}</Label>
      <input type="file" accept="image/*,video/*,audio/*" onChange={handleFileChange} />
      {currentValue && (
        <div style={{ marginTop: '10px' }}>
          <p>Current file:</p>
          {currentValue.includes('image') ? (
            <img src={currentValue} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
          ) : (
            <a href={currentValue} target="_blank" rel="noopener noreferrer">
              View current file
            </a>
          )}
        </div>
      )}
      <FormMessage />
    </FormGroup>
  );
}

export default CloudinaryUpload;
