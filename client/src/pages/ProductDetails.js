import React, { useEffect, useState } from "react";

import Layout from "../components/layout/Layout";

import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const url = "http://localhost:8000";
  const [product, setProduct] = useState({});
  const [relatedProduct, setRelatedProduct] = useState([]);

  // _______________ GET PRODUCT  _______________

  useEffect(() => {
    if (params?.slug) getProducts();
  }, [params?.slug]);

  const getProducts = async () => {
    try {
      const { data } = await axios.get(
        `${url}/get-singleproduct/${params.slug}`
      );
      setProduct(data?.Product);
      getSimilarProduct(data?.Product._id, data?.Product.category._id);
    } catch (error) {
      console.log(error);
    }
  };
  //  _______________ RELATED PRODUCT _______________
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${url}/related-product/${pid}/${cid}?version=2`
      );
      setRelatedProduct(data?.Product);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <h1>Product Details</h1>
      <div className="row container mt-2">
        <div className="col-md-6">
          <img
            src={`${url}/product-photo/${product._id}`}
            className="card-img-top"
            alt="..."
            width="300px"
          />
        </div>
        <div className="col-md-6 ">
          <h2 className="text-center">Product Details</h2>
          <div className="mt-5">
            <h6>Name : {product.name}</h6>
            <h6>Description : {product.description}</h6>
            <h6>Price : {product.price}</h6>
            <h6>category : {product?.category?.name}</h6>
          </div>
          <button className="btn btn-outline-dark ms-1">ADD TO CART</button>
        </div>
        <div className="row">
          <div className="d-flex flex-wrap">
            {relatedProduct?.map((p) => (
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
      </div>
    </Layout>
  );
};

export default ProductDetails;
