// controllers/uploadController.js
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const uploadToCloudinaryController = async (req, res) => {
  try {
    const results = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer, "products"))
    );

    if (results.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // If you want to return all uploaded file URLs
    const urls = results.map((result) => result.secure_url);
    const public_ids = results.map((result) => result.public_id);

    return res.status(200).json({
      message: "Uploaded successfully",
      url: urls,
      public_id: public_ids,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Cloudinary upload failed", details: error.message });
  }
};
