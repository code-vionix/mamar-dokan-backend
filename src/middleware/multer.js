import multer from "multer";

const storage = multer.memoryStorage(); // Buffer এ রাখবো
const upload = multer({ storage });

export default upload;
