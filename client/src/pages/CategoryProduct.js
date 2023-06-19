import React, { useEffect, useState } from "react";

import Layout from "../components/layout/Layout";

import axios from "axios";

import { useNavigate, useParams } from "react-router-dom";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const url = "http://localhost:8000";

  useEffect(() => {
    if (params?.slug) getProductByCategory();
  }, [params?.slug]);

  // _______________  GETPRODUCTBYCATEGORY  _______________

  const getProductByCategory = async () => {
    try {
      const { data } = await axios.get(
        `${url}/product-category/${params.slug}`
      );
      setProduct(data?.Products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout className="container mt-3">
      <h2 className="text-center">{category?.name}</h2>
      <h6 className="text-center">{product?.length} Result Found</h6>
      <div className="row">
        <div className="d-flex flex-wrap">
          {product?.map((p) => (
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
                <button className="btn btn-outline-secondary ms-2">
                  ADD TO CART
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;
