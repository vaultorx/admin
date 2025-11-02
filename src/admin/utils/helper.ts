/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Add this function near the top of your file, after imports
// src/utils/helper.js
export async function processAttributes(payload) {
  if (!payload) return payload;

  // Handle attributes field
  if (payload.attributes) {
    // If attributes is a string, parse it to object
    if (typeof payload.attributes === 'string') {
      try {
        payload.attributes = JSON.parse(payload.attributes);
      } catch (error) {
        console.error('Invalid JSON in attributes:', error);
        payload.attributes = {};
      }
    }
  } else {
    payload.attributes = {};
  }

  // Remove ALL nested field references that might cause issues
  Object.keys(payload).forEach((key) => {
    if (key.includes('.') || key.startsWith('attributes')) {
      // Remove any key that has dots or starts with attributes
      delete payload[key];
    }
  });

  // Also clean up any other JSON fields
  const jsonFields = ['nftData', 'attributes'];
  jsonFields.forEach((field) => {
    if (payload[field] && typeof payload[field] === 'string') {
      try {
        payload[field] = JSON.parse(payload[field]);
      } catch (error) {
        console.error(`Invalid JSON in ${field}:`, error);
        payload[field] = {};
      }
    }
  });

  return payload;
}
