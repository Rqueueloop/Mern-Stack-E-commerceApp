import express from "express";

// AUTH MIDDLEWARE
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

// CATEGORY CONTOLLER
import {
  CategoryController,
  CreateCategoryController,
  SingleCategoryController,
  deleteCategory,
  updateCategory,
} from "../controller/CategoryController.js";

const router = express.Router();

//ROUTES

// ---- POST :- CREATE-CATEGORY ----
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  CreateCategoryController
);

// ---- PUT :-  UPDATE-CATEGORY ----
router.put("/update-category/:id", requireSignIn, isAdmin, updateCategory);

// ---- GET :- GET-ALL CATEGORY ----
router.get("/get-category", CategoryController);

// ---- GET :- GET-SINGLE-CATEGORY ----
router.get("/single-category/:slug", SingleCategoryController);

// ---- DELETE :- CATEGORY-DELETE ----
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteCategory);

export default router;
