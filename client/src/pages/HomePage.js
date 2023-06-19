import React, { useEffect, useState } from "react";

import Layout from "../components/layout/Layout";

import axios from "axios";

import { Checkbox, Radio } from "antd";

import { prices } from "../components/Price";

import { useNavigate } from "react-router-dom";

import { useCart } from "../context/Cart";

import { toast } from "react-hot-toast";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const url = "http://localhost:8000";

  // ------ GET ALL CATEGORIES ------
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(`${url}/get-category`);
      if (data?.success) {
        setCategories(data?.Category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategories();
    getToal();
  }, []);

  // ------ GET ALL PRODUCTS ------

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${url}/product-list/${page}`);
      setLoading(false);
      setProducts(data.Products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // ------ GET TOTAL COUNT ------

  const getToal = async () => {
    try {
      const { data } = await axios.get(`${url}/product-count`);
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  // ------ LOAD MORE ------
  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${url}/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.Products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // FILTER

  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };
  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  // GET FILTERD PRODUCT

  const filterproduct = async () => {
    try {
      const { data } = await axios.post(`${url}/product-filters`, {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (checked.length || radio.length) filterproduct();
  }, [checked, radio]);

  return (
    <Layout>
      <div className="row mt-3">
        <div className="col-md-2">
          {/* _______________________ CATEGORY FILTER _______________________*/}

          <h5 className="text-center">Filters By Category</h5>
          <div className="d-flex flex-column ms-4">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => {
                  handleFilter(e.target.checked, c._id);
                }}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          {/* _______________________ PRICE FILTER _______________________*/}
          <h5 className="text-center mt-4">Filters By Price</h5>
          <div className="d-flex flex-column ms-4">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
        </div>
        <div className="col-md-9">
          {/* {JSON.stringify(checked, null, 4)} */}
          <h1 className="text-center">All Product</h1>

          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <div className="card m-3" style={{ width: "18rem" }}>
                <img
                  src={`${url}/product-photo/${p._id}`}
                  className="card-img-top"
                  alt="..."
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">
                    {p.description.substring(0, 30)}....
                  </p>
                  <p className="card-text"> $ {p.price}</p>
                  <button
                    className="btn btn-outline-dark"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
                  <button
                    className="btn btn-outline-secondary ms-2"
                    onClick={() => {
                      setCart([...cart, p]);
                      localStorage.setItem(
                        "cart",
                        JSON.stringify([...cart, p])
                      );
                      toast.success("Item Added to Cart");
                    }}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn btn-dark loadmore"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading ..." : "loadmore"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
