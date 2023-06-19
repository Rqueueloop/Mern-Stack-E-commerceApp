import React, { useState } from "react";

import Layout from "../../components/layout/Layout";

import toast from "react-hot-toast";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import "../../styles/AuthStyles.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();
  const HandleSubmit = async (e) => {
    e.preventDefault();
    const url = "http://localhost:8000";
    try {
      const res = await axios.post(`${url}/register`, {
        name,
        email,
        password,
        phone,
        address,
        answer,
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong !");
    }
  };

  return (
    <Layout title={"Register -Ecommerce App"}>
      <div className="form-container">
        <h4>Register Form</h4>
        <br />
        <form onSubmit={HandleSubmit}>
          <div className="mb-3">
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="texr"
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Name"
              required
            />
          </div>

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
            <input
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Phone No."
              required
            />
          </div>

          <div className="mb-3">
            <input
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Address"
              required
            />
          </div>

          <div className="mb-3">
            <input
              onChange={(e) => setAnswer(e.target.value)}
              value={answer}
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              placeholder="What is Your Favourite Sports"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
