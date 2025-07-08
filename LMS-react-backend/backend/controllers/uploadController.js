// controllers/uploadController.js
import AWS from 'aws-sdk';
import fs from 'fs';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
export const upload = multer({ storage });

// Setup AWS SDK for R2
const r2 = new AWS.S3({
  endpoint: `https://640245839710be457470f28d3498f77f.r2.cloudflarestorage.com`,
  accessKeyId: process.env.R2_ACCESS_KEY,
  secretAccessKey: process.env.R2_SECRET_KEY,
  signatureVersion: 'v4',
  region: 'auto'
});

// Upload File Controller
export const uploadFileToR2 = async (req, res) => {
  try {
    const file = req.file;
    const fileContent = fs.readFileSync(file.path);

    const params = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: file.filename,
      Body: fileContent,
      ContentType: file.mimetype,
      ACL: 'public-read'
    };

    const result = await r2.upload(params).promise();
    fs.unlinkSync(file.path); // Clean local copy

    res.status(200).json({
      message: 'File uploaded to R2 successfully',
      url: result.Location
    });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};
