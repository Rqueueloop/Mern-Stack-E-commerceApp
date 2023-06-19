import React, { useEffect, useState } from "react";

import { useAuth } from "../../context/Auth";

import { Outlet } from "react-router-dom";

import Spinner from "../Spinner";

import axios from "axios";

const PrivateRoute = () => {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();
  const url = "http://localhost:8000";

  useEffect(() => {
    const authCheck = async () => {
      const response = await axios.get(`${url}/user-auth`);
      if (response.data.ok) {
        setOk(true);
      } else {
        setOk(false);
      }
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner />;
};

export default PrivateRoute;
