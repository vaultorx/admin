/* eslint-disable @typescript-eslint/no-explicit-any */
import { buildFeature, FeatureType, ActionRequest } from 'adminjs';

import { CloudinaryStorage } from '../providers/cloudinary-storage.js';

export type CloudinaryUploadOptions = {
  properties: {
    key: string;
    bucket?: string;
    mimeType?: string;
  };
  validation?: {
    mimeTypes?: string[];
    maxSize?: number;
  };
  uploadPath?: (record: any, filename: string) => string;
};

const cloudinaryUploadFeature = (options: CloudinaryUploadOptions): FeatureType => {
  const { properties, validation, uploadPath } = options;

  return buildFeature({
    properties: {
      [properties.key]: {
        type: 'string',
        isVisible: {
          list: true,
          show: true,
          edit: true,
          filter: false,
        },
        components: {
          show: 'cloudinary-image',
          edit: 'cloudinary-upload',
          list: 'cloudinary-image',
        },
      },
      [`${properties.key}Meta`]: {
        type: 'string',
        isVisible: {
          edit: false,
          show: false,
          list: false,
          filter: false,
        },
      },
    },
    actions: {
      new: {
        before: async (request: ActionRequest) => await handleFileUpload(request, properties.key, validation, uploadPath),
      },
      edit: {
        before: async (request: ActionRequest) => await handleFileUpload(request, properties.key, validation, uploadPath),
      },
    },
  });
};

async function handleFileUpload(
  request: ActionRequest,
  propertyKey: string,
  validation?: CloudinaryUploadOptions['validation'],
  uploadPath?: CloudinaryUploadOptions['uploadPath'],
): Promise<ActionRequest> {
  const { payload, method } = request;

  if (!payload || !payload[propertyKey]) {
    return request;
  }

  const base64Data = payload[propertyKey];
  const fileMeta = payload[`${propertyKey}Meta`];

  // Check if this is a new file upload (base64 data)
  if (!base64Data.startsWith('data:')) {
    // This is already a URL (existing file), don't process it
    delete payload[`${propertyKey}Meta`];
    return request;
  }

  try {
    // Parse file metadata
    let filename = 'upload';
    let mimeType = 'application/octet-stream';

    if (fileMeta) {
      try {
        const meta = JSON.parse(fileMeta);
        filename = meta.name || filename;
        mimeType = meta.type || mimeType;

        // Validate MIME type if validation is provided
        if (validation?.mimeTypes && !validation.mimeTypes.includes(mimeType)) {
          throw new Error(`Invalid file type. Allowed types: ${validation.mimeTypes.join(', ')}`);
        }

        // Validate file size if validation is provided
        if (validation?.maxSize && meta.size > validation.maxSize) {
          throw new Error(`File too large. Maximum size: ${validation.maxSize} bytes`);
        }
      } catch (error) {
        console.error('Error parsing file metadata:', error);
      }
    }

    // Extract base64 content (remove data URL prefix)
    const matches = base64Data.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid base64 data format');
    }

    const base64Content = matches[2];
    const fileBuffer = Buffer.from(base64Content, 'base64');

    // Determine upload path
    let cloudinaryPath = filename;
    if (uploadPath) {
      const record = { params: payload };
      cloudinaryPath = uploadPath(record, filename);
    }

    // Extract folder from path
    const pathParts = cloudinaryPath.split('/');
    const folder = pathParts.slice(0, -1).join('/');

    // Upload to Cloudinary
    const result = await CloudinaryStorage.upload(fileBuffer, filename, {
      folder: folder || undefined,
      allowedFormats: validation?.mimeTypes?.map((mt) => mt.split('/')[1]),
    });

    // Store the Cloudinary URL
    payload[propertyKey] = result.secure_url;

    // Clean up metadata field
    delete payload[`${propertyKey}Meta`];

    console.log(`✅ File uploaded successfully to Cloudinary: ${result.secure_url}`);
  } catch (error) {
    console.error('❌ Error uploading file to Cloudinary:', error);
    throw error;
  }

  return request;
}

export default cloudinaryUploadFeature;
