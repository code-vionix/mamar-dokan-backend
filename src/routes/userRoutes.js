import express from "express";
import {
  createUserAddress,
  deleteUserAddress,
  getUserAddresses,
  getUserById,
  updatePassword,
  updateUserAddress,
  updateUserAvatar,
  updateUserInfo,
} from "../controllers/userController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/:id", getUserById);
router.patch("/:id/avatar", upload.single("image"), updateUserAvatar);
router.patch("/:id", updateUserInfo);
router.patch("/:id/password", updatePassword);
router.post("/:id/address", createUserAddress);
router.get("/:id/address", getUserAddresses);
router.patch("/address/:id", updateUserAddress);
router.delete("/address/:id", deleteUserAddress);

export default router;
