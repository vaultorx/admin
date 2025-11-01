import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type UploadOptions = {
  folder?: string;
  allowedFormats?: string[];
  transformation?: any[];
};

export class CloudinaryStorage {
  static async upload(fileBuffer: Buffer, filename: string, options: UploadOptions = {}): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadOptions: any = {
        resource_type: 'auto',
        ...options,
      };

      // Convert buffer to base64 for Cloudinary
      const base64File = `data:${this.getMimeType(filename)};base64,${fileBuffer.toString('base64')}`;

      cloudinary.uploader.upload(
        base64File,
        uploadOptions,
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
            return;
          }

          if (!result) {
            reject(new Error('Cloudinary upload failed: No result returned'));
            return;
          }

          resolve(result);
        }
      );
    });
  }

  private static getMimeType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      mp4: 'video/mp4',
      mov: 'video/quicktime',
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
    };
    return mimeTypes[extension || ''] || 'application/octet-stream';
  }

  static async delete(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (result.result !== 'ok') {
          reject(new Error(`Failed to delete image: ${result.result}`));
          return;
        }
        resolve();
      });
    });
  }

  static extractPublicId(url: string): string {
    const matches = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
    return matches ? matches[1] : '';
  }
}
