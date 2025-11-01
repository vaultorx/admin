import { buildFeature, FeatureType } from 'adminjs';
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
          edit: false,
          filter: false,
        },
        components: {
          show: 'cloudinary-image',
          edit: 'cloudinary-upload',
          list: 'cloudinary-image',
        },
      },
      [`${properties.key}File`]: {
        type: 'string',
        isVisible: {
          edit: true,
          show: false,
          list: false,
          filter: false,
        },
      },
    },
    actions: {
      new: {
        before: async (request) => {
          const { payload, method } = request;

          if (payload && payload[`${properties.key}File`]) {
            const fileData = payload[`${properties.key}File`];

            // In a real implementation, you'd need to handle the file upload
            // This is a simplified version - you might need to adjust based on how AdminJS handles files
            console.log('File upload requested:', fileData);

            // For now, we'll simulate the upload process
            // In production, you'd need to:
            // 1. Get the actual file buffer from the request
            // 2. Upload to Cloudinary
            // 3. Store the URL

            // Remove the temporary file property to avoid validation errors
            delete payload[`${properties.key}File`];
          }

          return request;
        },
      },
      edit: {
        before: async (request) => {
          const { payload } = request;

          if (payload && payload[`${properties.key}File`]) {
            const fileData = payload[`${properties.key}File`];

            console.log('File upload requested (edit):', fileData);

            // Remove the temporary file property
            delete payload[`${properties.key}File`];
          }

          return request;
        },
      },
    },
  });
};

export default cloudinaryUploadFeature;
