import React, { useEffect, useState } from "react";

import Layout from "../../components/layout/Layout";

import UserMenu from "../../components/layout/UserMenu";

import axios from "axios";

import { useAuth } from "../../context/Auth";

import moment from "moment";

const Oreders = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const url = "http://localhost:8000";

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${url}/orders`);
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <Layout>
      <div className="container-fluid p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h3 className="center">All Orders</h3>
            {orders?.map((o, i) => {
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
                        <td>{o?.status}</td>
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
      </div>
    </Layout>
  );
};

export default Oreders;
