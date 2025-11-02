import { ComponentLoader } from 'adminjs';

const componentLoader = new ComponentLoader();

// Register your custom components with camelCase naming (no hyphens!)
const Components = {
  Dashboard: componentLoader.add('Dashboard', './components/dashboard'),
  CloudinaryUpload: componentLoader.add('CloudinaryUpload', './components/cloudinary-upload'),
  CloudinaryImage: componentLoader.add('CloudinaryImage', './components/cloudinary-image'),
  JsonEditor: componentLoader.add('JsonEditor', './components/json-editor'),
};

export { componentLoader, Components };
