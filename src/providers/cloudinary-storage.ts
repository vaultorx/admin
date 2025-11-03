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
  resourceType?: 'auto' | 'image' | 'video' | 'raw';
};

export class CloudinaryStorage {
  /**
   * Upload a file to Cloudinary
   * @param fileBuffer Buffer containing the file data
   * @param filename Original filename
   * @param options Upload options
   * @returns Upload result with secure_url
   */
  static async upload(fileBuffer: Buffer, filename: string, options: UploadOptions = {}): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      // Validate Cloudinary configuration
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        reject(new Error('Cloudinary configuration is missing. Please check your environment variables.'));
        return;
      }

      const uploadOptions: any = {
        resource_type: options.resourceType || 'auto',
        folder: options.folder,
        allowed_formats: options.allowedFormats,
        transformation: options.transformation,
      };

      // Convert buffer to base64 for Cloudinary
      const mimeType = this.getMimeType(filename);
      const base64File = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;

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
        },
      );
    });
  }

  /**
   * Get MIME type from filename
   * @param filename File name with extension
   * @returns MIME type string
   */
  private static getMimeType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();

    const mimeTypes: { [key: string]: string } = {
      // Images
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      bmp: 'image/bmp',
      ico: 'image/x-icon',

      // Videos
      mp4: 'video/mp4',
      mov: 'video/quicktime',
      avi: 'video/x-msvideo',
      webm: 'video/webm',
      mkv: 'video/x-matroska',

      // Audio
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      ogg: 'audio/ogg',
      m4a: 'audio/mp4',

      // Documents
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

      // Archives
      zip: 'application/zip',
      rar: 'application/x-rar-compressed',
    };

    return mimeTypes[extension || ''] || 'application/octet-stream';
  }

  /**
   * Delete a file from Cloudinary
   * @param publicId Public ID of the file to delete
   */
  static async delete(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(new Error(`Failed to delete file: ${error.message}`));
          return;
        }

        if (result.result !== 'ok' && result.result !== 'not found') {
          reject(new Error(`Failed to delete file: ${result.result}`));
          return;
        }

        resolve();
      });
    });
  }

  /**
   * Extract public ID from Cloudinary URL
   * @param url Cloudinary URL
   * @returns Public ID
   */
  static extractPublicId(url: string): string {
    // Match pattern: /upload/v{version}/{public_id}.{extension}
    // or: /upload/{public_id}.{extension}
    const matches = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
    return matches ? matches[1] : '';
  }

  /**
   * Get optimized image URL with transformations
   * @param url Original Cloudinary URL
   * @param width Desired width
   * @param height Desired height
   * @param quality Quality (1-100)
   * @returns Transformed URL
   */
  static getOptimizedUrl(url: string, width?: number, height?: number, quality: number = 80): string {
    const transformations: string[] = [];

    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    transformations.push(`q_${quality}`);
    transformations.push('f_auto'); // Auto format

    const transformation = transformations.join(',');
    return url.replace('/upload/', `/upload/${transformation}/`);
  }

  /**
   * Check if Cloudinary is properly configured
   * @returns boolean
   */
  static isConfigured(): boolean {
    return !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
  }
}
