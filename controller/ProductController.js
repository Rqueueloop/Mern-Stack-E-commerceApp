import slugify from "slugify";

import ProductModel from "../models/ProductModel.js";

import CategoryModel from "../models/CategoryModel.js";

import OrderModel from "../models/OrderModel.js";

import dotenv from "dotenv";

import braintree from "braintree";

import fs from "fs";

dotenv.config();

// -------------------- PAYMENT GATEWAY --------------------

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// -------------------- CREATE PRODUCT CONTROLLER --------------------

export const CreateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, Shipping } =
      req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required !" });

      case !description:
        return res.status(500).send({ error: "description is Required !" });

      case !price:
        return res.status(500).send({ error: "price is Required !" });

      case !category:
        return res.status(500).send({ error: "category is Required !" });

      case !quantity:
        return res.status(500).send({ error: "quantity is Required !" });

      case !photo && photo.size > 1000000:
        return res.status(500).send({ error: "photo is Required !" });
    }
    const products = new ProductModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();

    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in crearing product",
    });
  }
};

// -------------------- GET PRODUCT --------------------

export const getProduct = async (req, res) => {
  console.log("IN");
  try {
    const products = await ProductModel.find({})
      .populate({ path: "category" })
      .select("-photo")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in getting product",
    });
  }
};

// -------------------- GET SINGLEPRODUCT --------------------

export const getSingleProduct = async (req, res) => {
  try {
    const Product = await ProductModel.findOne({ slug: req.params.slug })
      .populate({ path: "category" })
      .select("-photo");
    res.status(200).send({
      success: true,
      message: "Get Single product Successfully !",
      Product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in getting single product",
    });
  }
};

// --------------------  PRODUCT PHOTO  --------------------

export const productPhotoController = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};

//-------------------- DELETE PRODUCT --------------------

export const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    await ProductModel.findByIdAndDelete(pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Successfully Deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in delet product ",
    });
  }
};

// --------------------  UPDATE PRODUCT CONTROLLER  --------------------

export const UpdateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, Shipping } =
      req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required !" });

      case !description:
        return res.status(500).send({ error: "description is Required !" });

      case !price:
        return res.status(500).send({ error: "price is Required !" });

      case !category:
        return res.status(500).send({ error: "category is Required !" });

      case !quantity:
        return res.status(500).send({ error: "quantity is Required !" });

      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await ProductModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updte product",
    });
  }
};

// --------------------   PRODUCT FILTER  --------------------

export const ProductFilter = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await ProductModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in While Filtering Products",
      error,
    });
  }
};

// --------------------   PRODUCT COUNT  --------------------

export const ProductCount = async (req, res) => {
  try {
    const total = await ProductModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in product count",
      error,
    });
  }
};

// --------------------   PRODUCT LIST BASE ON PAGE  --------------------

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 3;
    const page = req.params.page ? req.params.page : 1;
    const Products = await ProductModel.find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      Products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ",
      error,
    });
  }
};

// --------------------  SEARCH PRODUCT   --------------------

export const SearchProductController = async (req, res) => {
  try {
    const { keywords } = req.params;
    const result = await ProductModel.find({
      $or: [
        { name: { $regex: keywords, $options: "i" } },
        { description: { $regex: keywords, $options: "i" } },
      ],
    }).select("-photo");
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in search",
      error,
    });
  }
};

// --------------------  SIMILAR PRODUCT   --------------------

export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const Product = await ProductModel.find({
      category: cid,
      _id: { $ne: pid },
    })
      .select("-photo")
      .limit(3)
      .populate({ path: "category" });
    res.status(200).send({
      success: true,
      Product,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

// -------------------- GET PRODUCT BT CATEGORY   --------------------

export const ProductCategory = async (req, res) => {
  try {
    const category = await CategoryModel.findOne({ slug: req.params.slug });
    const Products = await ProductModel.find({ category }).populate({
      path: "category",
    });
    res.status(200).send({
      success: true,
      category,
      Products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while getting product by category",
      error,
    });
  }
};

// --------------------PAYMENT    --------------------

//token

export const braintreeToken = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

// -------------------- BRAINTREE PAYMENT    --------------------

export const braintreePayment = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new OrderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
