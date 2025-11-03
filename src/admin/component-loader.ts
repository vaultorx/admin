import { ComponentLoader } from 'adminjs';
import path from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
export const componentLoader = new ComponentLoader();

export const add = (componentName: string, url: string): string =>
  componentLoader.add(componentName, path.join(__dirname, url));

// Register your custom components with camelCase naming (no hyphens!)
const Components = {
  CloudinaryUpload: add('CloudinaryUpload', './components/cloudinary-upload'),
  CloudinaryImage: add('CloudinaryImage', './components/cloudinary-image'),
  JsonEditor: add('JsonEditor', './components/json-editor'),
  Dashboard: add('Dashboard', './components/dashboard'),
};

export { Components };
