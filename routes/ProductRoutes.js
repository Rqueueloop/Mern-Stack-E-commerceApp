import express from "express";

// AUTH MIDDLEWARE
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

// RODUCT CONTOLLER
import {
  CreateProductController,
  ProductCategory,
  ProductCount,
  ProductFilter,
  SearchProductController,
  UpdateProductController,
  braintreePayment,
  braintreeToken,
  deleteProduct,
  getProduct,
  getSingleProduct,
  productListController,
  productPhotoController,
  realtedProductController,
} from "../controller/ProductController.js";

import formidable from "express-formidable";

const router = express.Router();

// ---- POST - CREATE-PRODUCT ----
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  CreateProductController
);

// ---- PUT - UPDATE-PRODUCT ----
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  UpdateProductController
);

// ---- GET - GET-PRODUCT ----
router.get("/get-product", getProduct);

// ---- GET - SINGLE-PRODUCT ----
router.get("/get-singleproduct/:slug", getSingleProduct);

// ---- GET - PHOTO ----
router.get("/product-photo/:pid", productPhotoController);

// ---- DELETE - PRODUCT ----
router.delete("/delete-product/:pid", deleteProduct);

// ---- POST :- FILTER - PRODUCT ----
router.post("/product-filters", ProductFilter);

// ---- GET :- PRODUCT COUNT ----
router.get("/product-count", ProductCount);

// ---- GET :- PRODUCT PER PAGE ----
router.get("/product-list/:page", productListController);

// ---- GET :- SEARCH PRODUCT ----
router.get("/search/:keywords", SearchProductController);

// ---- GET :- SIMILAR PRODUCT ----
router.get("/related-product/:pid/:cid", realtedProductController);

// ---- GET :- CATEGORY WISE  PRODUCT ----
router.get("/product-category/:slug", ProductCategory);

// ---- GET :- PAYMENT ----
// braintree token
router.get("/braintree/token", braintreeToken);

// ---- POST :- PAYMENT ----
router.post("/braintree/payment", requireSignIn, braintreePayment);

export default router;
