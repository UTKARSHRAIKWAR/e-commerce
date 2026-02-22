import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv"

dotenv.config();

cloudinary.config({
  cloud_name:process.env.Cloudinary_Cloud_name,
  api_key:process.env.Cloudinary_API_Key,
  api_secret:process.env.Cloudinary_API_Secret,
});

export default cloudinary;