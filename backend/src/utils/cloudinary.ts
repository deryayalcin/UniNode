import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadCardImage = async (filePath: string): Promise<string> => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'uninode/cards',
    resource_type: 'image',
    quality: 'auto',
  });
  return result.secure_url;
};

export const uploadAvatar = async (filePath: string): Promise<string> => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'uninode/avatars',
    resource_type: 'image',
    quality: 'auto',
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
  });
  return result.secure_url;
};

export default cloudinary;
