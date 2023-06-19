import React, { useEffect, useState } from "react";

import Layout from "../../components/layout/Layout";

import UserMenu from "../../components/layout/UserMenu";

import { useAuth } from "../../context/Auth";

import axios from "axios";

import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [auth, setAuth] = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  // get user data
  useEffect(() => {
    const { name, email, phone, address } = auth?.user;
    setName(name);
    setEmail(email);
    setPhone(phone);
    setAddress(address);
  }, [auth?.user]);

  const HandleSubmit = async (e) => {
    e.preventDefault();
    const url = "http://localhost:8000";
    try {
      const { data } = await axios.put(`${url}/profile`, {
        name,
        email,
        password,
        phone,
        address,
      });
      if (data?.error) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        navigate("/dashboard/user");
        toast.success("Progile Updated Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong !");
    }
  };

  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="form-container">
              <h4>User Profile</h4>
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
                    disabled
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
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
