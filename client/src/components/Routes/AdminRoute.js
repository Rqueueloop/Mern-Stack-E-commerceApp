import React, { useEffect, useState } from "react";

import { useAuth } from "../../context/Auth";

import { Outlet } from "react-router-dom";

import Spinner from "../Spinner";

import axios from "axios";

const AdminRoute = () => {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();
  const url = "http://localhost:8000";

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get(`${url}/admin-auth`);
        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        // Handle the error here
        console.log(error);
        // Set appropriate state or show an error message
      }
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner path="" />;
};

export default AdminRoute;
