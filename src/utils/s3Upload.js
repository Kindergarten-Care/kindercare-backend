import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import path from 'path';
import ApiError from './ApiError.js';
import httpStatus from 'http-status';

// Initialize DigitalOcean Spaces client (S3-compatible)
const s3Client = new S3Client({
  endpoint: process.env.DO_SPACE_ENDPOINT,
  region: 'us-east-1', // DigitalOcean Spaces accepts 'us-east-1' or any dummy string
  credentials: {
    accessKeyId: process.env.DO_SPACE_KEY,
    secretAccessKey: process.env.DO_SPACE_SECRET,
  },
});

// Setup Multer memory storage
const storage = multer.memoryStorage();

// Filter files: Allow only images
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new ApiError(httpStatus.BAD_REQUEST, 'Chỉ chấp nhận file ảnh (jpg, jpeg, png, webp, gif)'), false);
};

export const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // limit 20MB
  fileFilter,
});

/**
 * Upload file to DigitalOcean Spaces
 * @param {Object} file - The file object from Multer (req.file)
 * @param {string} folder - Destination folder in the Space
 * @returns {Promise<string>} The public URL of the uploaded image
 */
export const uploadToSpace = async (file, folder) => {
  const fileExtension = path.extname(file.originalname);
  const uniqueFileName = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExtension}`;

  const params = {
    Bucket: process.env.DO_SPACE_BUCKET,
    Key: uniqueFileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read', // Make the file publicly accessible
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    
    // Construct CDN or direct Spaces URL
    if (process.env.DO_SPACE_CDN_URL) {
      // Remove trailing slash if present
      const cdnUrl = process.env.DO_SPACE_CDN_URL.replace(/\/$/, '');
      return `${cdnUrl}/${uniqueFileName}`;
    }

    const baseUrl = process.env.DO_SPACE_ENDPOINT.replace('https://', `https://${process.env.DO_SPACE_BUCKET}.`);
    return `${baseUrl}/${uniqueFileName}`;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR, 
      `Lỗi upload ảnh lên DigitalOcean Spaces: ${error.message}`
    );
  }
};
