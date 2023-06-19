import React, { useState } from "react";

import Layout from "../../components/layout/Layout";

import toast from "react-hot-toast";

import axios from "axios";

import { useNavigate, useLocation } from "react-router-dom";

import "../../styles/AuthStyles.css";

import { useAuth } from "../../context/Auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const HandleSubmit = async (e) => {
    e.preventDefault();
    const url = "http://localhost:8000";
    try {
      const res = await axios.post(`${url}/login`, {
        email,
        password,
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <Layout>
      <div className="form-container">
        <h4>Login Form</h4>
        <br />
        <form onSubmit={HandleSubmit}>
          <div className="mb-3">
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Email"
              required
            />
          </div>

          <div className="mb-3">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Password"
              required
            />
          </div>

          <div className="mb-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                navigate("/forgot-password");
              }}
            >
              Forgot password
            </button>
          </div>

          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
