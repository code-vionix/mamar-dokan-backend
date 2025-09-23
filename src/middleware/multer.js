import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import streamifier from "streamifier";

// Multer config (buffer এ রাখবে)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Buffer → Cloudinary upload function
export const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export default upload;
