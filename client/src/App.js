import React from "react";

import { Route, Routes } from "react-router-dom";

// ----------------------------------- COMPONENTS -----------------------------------

import HomePage from "./pages/HomePage";

import About from "./pages/About";

import Contact from "./pages/Contact";

import Policy from "./pages/Policy";

import PageNotFound from "./pages/PageNotFound";

import Register from "./pages/auth/Register";

import Login from "./pages/auth/Login";

import PrivateRoute from "./components/Routes/PrivateRoute";

import DashBord from "./pages/user/DashBord";

import ForgotPassword from "./pages/auth/ForgotPassword";

import AdminRoute from "./components/Routes/AdminRoute";

import AdminDashBord from "./pages/admin/AdminDashBord";

import CreateCategory from "./pages/admin/CreateCategory";

import CreateProduct from "./pages/admin/CreateProduct";

import Users from "./pages/admin/Users";

import Oreders from "./pages/user/Oreders";

import Profile from "./pages/user/Profile";

import Products from "./pages/admin/Products";

import UpdateProduct from "./pages/admin/UpdateProduct";

import Search from "./pages/Search";

import ProductDetails from "./pages/ProductDetails";

import Categories from "./pages/Categories";

import CategoryProduct from "./pages/CategoryProduct";
import CartPage from "./pages/CartPage";
import AdminOrders from "./pages/admin/AdminOrders";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/category/:slug" element={<CategoryProduct />} />
        <Route path="/search" element={<Search />} />

        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="user" element={<DashBord />} />
          <Route path="user/orders" element={<Oreders />} />
          <Route path="user/profile" element={<Profile />} />
        </Route>

        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashBord />} />
          <Route path="admin/create-category" element={<CreateCategory />} />
          <Route path="admin/create-Product" element={<CreateProduct />} />
          <Route path="admin/product/:slug" element={<UpdateProduct />} />
          <Route path="admin/products" element={<Products />} />
          <Route path="admin/users" element={<Users />} />
          <Route path="admin/orders" element={<AdminOrders />} />
        </Route>

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/policy" element={<Policy />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
