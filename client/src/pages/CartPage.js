import React, { useEffect, useState } from "react";

import Layout from "../components/layout/Layout";

import { useCart } from "../context/Cart";

import { useAuth } from "../context/Auth";

import { useNavigate } from "react-router-dom";

import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const CartPage = () => {
  const [cart, setCart] = useCart();
  const [auth, setAuth] = useAuth();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const url = "http://localhost:8000";

  // _____________ TOTAL PRICE _____________

  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };

  //   _____________ HANDLEDELETECART _____________

  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  //   _____________ GET  PAYMENT GATEWAY TOKEN  _____________
  const getToken = async () => {
    try {
      const { data } = await axios.get(`${url}/braintree/token`);
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  // _________  HANDLEPAYMENT  _________

  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(`${url}/braintree/payment`, {
        nonce,
        cart,
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("payment successFully");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2 className="text-center bg-light p-2 mb-1">
              {`Hello ${auth?.token && auth?.user?.name}`}
            </h2>
            <h5 className="text-center">
              {cart?.length
                ? `you have ${cart.length} items in your cart ${
                    auth?.token ? "" : "please login to chekout"
                  }`
                : "your cart is empty"}
            </h5>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-8 ">
            {cart?.map((p) => (
              <div className="row mb-3  flex-row" key={p._id}>
                <div className="col-md-4">
                  <img
                    src={`${url}/product-photo/${p._id}`}
                    className="card-img-top"
                  />
                </div>
                <div className="col-md-4">
                  <h6>{p.name}</h6>
                  <p>{p.description.substring(0, 30)}</p>
                  <p>Price : ${p.price}</p>
                  <button
                    className="btn btn-outline-dark"
                    onClick={() => removeCartItem(p._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-3 text-center">
            <h3>Cart Summary </h3>
            <p>Total | CheckOut | Payment</p>
            <hr />
            <h4> Total :{totalPrice()} </h4>
            {auth?.user?.address ? (
              <>
                <div className="mb-3">
                  <h4>Current Address</h4>
                  <h5>{auth?.user?.address}</h5>
                  <button
                    className="btn btn-outline-dark"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update address
                  </button>
                </div>
              </>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <button
                    className="btn btn-success"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update address
                  </button>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={() =>
                      navigate("/login", {
                        state: "/cart",
                      })
                    }
                  >
                    Please login to chekout
                  </button>
                )}
              </div>
            )}
            <div className="mt-2">
              {!clientToken || !cart?.length ? (
                ""
              ) : (
                <>
                  <DropIn
                    options={{
                      authorization: clientToken,
                      paypal: { flow: "vault" },
                    }}
                    onInstance={(instance) => setInstance(instance)}
                  />
                  <button
                    className="btn btn-outline-dark"
                    onClick={handlePayment}
                    disabled={loading || !instance || !auth?.user?.address}
                  >
                    {loading ? "Processing ...." : "Make Payment"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
