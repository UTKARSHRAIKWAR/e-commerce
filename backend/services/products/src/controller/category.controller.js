import asyncHandler from "express-async-handler";
import Category from "../db/category.model.js";
import logger from "../utils/logger.js";

// Create Category
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  logger.info(`Create category request: ${name}`);

  if (!name) {
    return res.status(400).json({
      message: "Category name is required",
    });
  }

  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    return res.status(400).json({
      message: "Category already exists",
    });
  }

  const category = await Category.create({
    name,
    description,
  });

  res.status(201).json({
    message: "Category created successfully",
    category,
  });
});

// Get All Categories
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });

  res.status(200).json(categories);
});

// Get Category By ID
export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      message: "Category not found",
    });
  }

  res.status(200).json(category);
});

// Update Category
export const updateCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      message: "Category not found",
    });
  }

  category.name = name || category.name;
  category.description = description || category.description;

  await category.save();

  res.status(200).json({
    message: "Category updated successfully",
    category,
  });
});

// Delete Category
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      message: "Category not found",
    });
  }

  await category.deleteOne();

  res.status(200).json({
    message: "Category deleted successfully",
  });
});