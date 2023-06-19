import usermodel from "../models/usermodel.js";

import OrderModel from "../models/OrderModel.js";

import { ComparePassword, hashPassword } from "../utils/authUtils.js";

import JWT from "jsonwebtoken";

// --------- REGISTER  ---------

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    //// VALIDATION

    if (!name) {
      return res.send({ message: "Name is Required!" });
    }
    if (!email) {
      return res.send({ message: "Email is Required!" });
    }
    if (!password) {
      return res.send({ message: "Password is Required!" });
    }
    if (!phone) {
      return res.send({ message: "Phone No. is Required!" });
    }
    if (!address) {
      return res.send({ message: "Address is Required!" });
    }
    if (!answer) {
      return res.send({ message: "answer is Required!" });
    }

    //CHECK USER
    const exisitinguser = await usermodel.findOne({ email });

    /// EXISITING USER
    if (exisitinguser) {
      return res.status(200).send({
        success: false,
        message: "Alredy Register please login",
      });
    }

    // REGISTER USER

    const hashedPassword = await hashPassword(password);

    //SAVE

    const user = await new usermodel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();
    res.status(201).send({
      success: true,
      message: "user Register SuccessFully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Register",
      error,
    });
  }
};

// --------- LOGIN ---------

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // VALIDATION

    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email Or Password",
      });
    }

    // CHECK USER
    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }

    const match = await ComparePassword(password, user.password);

    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }

    // --- TOKEN ---

    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "8d",
    });
    res.status(200).send({
      success: true,
      message: "login successFully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Login",
      error,
    });
  }
};

// --------- FORGOT PASSWORD  ---------

export const ForgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Emai is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //CHECK
    const user = await usermodel.findOne({ email, answer });
    //VALIDATION
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await usermodel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

// --------- UPDATE PROFILE  ---------
export const UpdateProfile = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await usermodel.findById(req.user._id);

    // PASSWORD

    if (password && password.length < 6) {
      return res.json({ error: "password is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await usermodel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while updating profile",
      error,
    });
  }
};

// --------- GET ORDERS  ---------

export const getOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({ buyer: req.user._id })
      .populate({
        path: "products",
        strictPopulate: false,
      })
      .populate({
        path: "buyer",
        strictPopulate: false,
      });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while geting orders",
      error,
    });
  }
};

export const AllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({})
      .populate({
        path: "products",
        strictPopulate: false,
      })
      .select("-photo")
      .sort({ createdAt: "-1" })
      .populate({
        path: "buyer",
        strictPopulate: false,
      });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while geting All orders",
      error,
    });
  }
};

export const orderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error while Updateing orders",
      error,
    });
  }
};
