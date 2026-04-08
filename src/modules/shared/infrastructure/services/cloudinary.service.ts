import { v2 as cloudinary } from "cloudinary";
import type { UploadImageService } from "../../domain/services/images.service";

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

export const uploadImageService: UploadImageService = async ({
  fileBuffer,
  folder,
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, use_filename: true },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      },
    );
    uploadStream.end(fileBuffer);
  });
};
