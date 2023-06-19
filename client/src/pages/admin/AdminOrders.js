import React, { useState, useEffect } from "react";

import Adminmenu from "../../components/layout/AdminMenu";

import Layout from "../../components/layout/Layout";

import axios from "axios";

import { useAuth } from "../../context/Auth";

import moment from "moment";

import { Select } from "antd";

const { Option } = Select;

const AdminOrders = () => {
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "deliverd",
    "cancel",
  ]);

  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const url = "http://localhost:8000";

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${url}/all-orders`);
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleStatusChange = async (orderId, value) => {
    try {
      const { data } = await axios.put(`${url}/order-status/${orderId}`, {
        status: value,
      });
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-3">
          <Adminmenu />
        </div>
        <div className="col-md-9">
          <h2 className="text-center">All Orders</h2>
          {orders?.map((o, i) => {
            console.log(o, "jhjjh");
            return (
              <div className="border shadow">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Status</th>
                      <th scope="col">Buyer</th>
                      <th scope="col">Orders</th>
                      <th scope="col">Payment</th>
                      <th scope="col">Quantity</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>{i + 1}</td>
                      <td>
                        <Select
                          bordered={false}
                          onChange={(value) => handleStatusChange(o._id, value)}
                          defaultValue={o?.status}
                        >
                          {status.map((s, i) => (
                            <Option key={i} value={s}>
                              {s}
                            </Option>
                          ))}
                        </Select>
                      </td>
                      <td>{o?.buyer?.name}</td>
                      <td>{moment(o?.createAt).fromNow()}</td>
                      <td>{o?.payment.success ? "Success" : "Failed"}</td>
                      <td>{o?.products?.length}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="container">
                  {o?.products?.map((p) => (
                    <div className="row mb-3  flex-row" key={p._id}>
                      {console.log(p.name)}
                      <div className="col-md-4">
                        <img
                          src={`${url}/product-photo/${p._id}`}
                          className="card-img-top"
                        />
                      </div>
                      <div className="col-md-4">
                        <h6>{p.name}</h6>
                        <p>{p.description}</p>
                        <p>Price : ${p.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
