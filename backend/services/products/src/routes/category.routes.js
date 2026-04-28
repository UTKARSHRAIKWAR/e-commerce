import {Router} from "express"
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from "../controller/category.controller.js";

const router = Router();

router.get("/", getCategories);

router.post("/",createCategory);

// router.get("/:id", getCategoryById);

router.put("/:id",updateCategory);

router.delete("/:id",deleteCategory);

export default router;