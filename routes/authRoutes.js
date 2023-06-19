import express from "express";

// AUTH CONTROLLER
import {
  registerController,
  loginController,
  ForgotPasswordController,
  UpdateProfile,
  getOrders,
  AllOrders,
  orderStatus,
} from "../controller/authController.js";

// AUTH MIDDLEWARE
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

//ROUTING

// ---- POST :- REGISTER ----
router.post("/register", registerController);

// ---- POST :- LOGIN ----
router.post("/login", loginController);

// ---- POST :- FORGOT PASSWORD ----
router.post("/forgot-password", ForgotPasswordController);

// ---- GET :- PROTECTED USER ROUTE AUTH ----
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// ---- GET :- PROTECTED ADMIN ROUTE AUTH ----
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// ---- PUT :- UPDATE PROFILE ----
router.put("/profile", requireSignIn, UpdateProfile);

// ---- GET :- ORDER ----
router.get("/orders", requireSignIn, getOrders);

// ---- GET :- ALL ORDER ----
router.get("/all-orders", requireSignIn, isAdmin, AllOrders);

// ---- GET :- ORDER STATUS  UPDATE ----
router.put("/order-status/:orderId", requireSignIn, isAdmin, orderStatus);

export default router;
