// controllers/uploadController.js
import cloudinary from "../utils/cloudinary.js";

export const uploadToCloudinary = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: "products" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }).end(file.buffer);
    });

    return res.status(200).json({
      message: "Uploaded successfully",
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    return res.status(500).json({ error: "Cloudinary upload failed", details: error.message });
  }
};
