

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async(req,file) => ({
    folder: `eCommerce/products/${req.headers["x-user-id"]}`,
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  }),
});

const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

export default upload;