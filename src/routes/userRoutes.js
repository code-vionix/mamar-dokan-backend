import express from "express";
import upload from "../middleware/multer.js";
import {
  createUserAddress,
  deleteUserAddress,
  getUserAddresses,
  updatePassword,
  updateUserAddress,
  updateUserAvatar,
  updateUserInfo,
} from "../controllers/userController.js";

const router = express.Router();

router.patch("/:id/avatar", upload.single("image"), updateUserAvatar);
router.patch("/:id", updateUserInfo);
router.patch("/:id/password", updatePassword);
router.post("/:id/address", createUserAddress);
router.get("/:id/address", getUserAddresses);
router.patch("/address/:id", updateUserAddress);
router.delete("/address/:id", deleteUserAddress);

export default router;
