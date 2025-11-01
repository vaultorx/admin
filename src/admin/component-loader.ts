import { ComponentLoader } from 'adminjs';

const componentLoader = new ComponentLoader();

// Register your custom components
const Components = {
//   CloudinaryUpload: componentLoader.add('cloudinary-upload', '../components/cloudinary-upload'),
//   CloudinaryImage: componentLoader.add('cloudinary-image', '../components/cloudinary-image'),
};

export { componentLoader, Components };
