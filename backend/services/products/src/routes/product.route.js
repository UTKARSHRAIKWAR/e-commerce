import {Router} from "express"
import { addProduct, deactivateProduct, deleteProduct, getProduct, getProductById, getSellerProducts, updateProduct, validateStock } from "../controller/product.controller.js";
import upload from "../utils/upload.js"
const router = Router();

router.post("/",upload.single("image"), addProduct);
router.get("/", getProduct);
router.get("/seller/my", getSellerProducts);
router.post("/validate-stock",validateStock);

router.get("/:id", getProductById);
router.patch("/:id",updateProduct);
router.put("/:id",deactivateProduct);
router.delete("/:id",deleteProduct);

export default router;