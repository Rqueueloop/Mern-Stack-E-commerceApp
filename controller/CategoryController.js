import slugify from "slugify";

import CategoryModel from "../models/CategoryModel.js";

//  ---------- CREATE CATEGORY CONTROLLER ----------

export const CreateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(401).semd({ message: "name is reqired" });
    }
    const existingCategory = await CategoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category Already Exisits",
      });
    }
    const Category = await new CategoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "new Category Created",
      Category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "error in category",
    });
  }
};

//  ---------- UPDATE CATEGORY ----------

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const Category = await CategoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category Updated SuccessFully !",
      Category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error While Updateing Category!",
      error,
    });
  }
};

//  ---------- GETALL - CATEGORY ----------

export const CategoryController = async (req, res) => {
  try {
    const Category = await CategoryModel.find({});
    res.status(200).send({
      success: true,
      message: "All categoreis List",
      Category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error While getting All Category!",
      error,
    });
  }
};

//  ---------- SINGLE - CATEGORY ----------

export const SingleCategoryController = async (req, res) => {
  try {
    const Category = await CategoryModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Get Single Cateory Successfully !",
      Category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error While getting single Category!",
      error,
    });
  }
};

//  ---------- DELETE - CATEGORY ----------

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await CategoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Category Successfully Deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error While delete  Category!",
      error,
    });
  }
};
