import React from "react";

import Layout from "../components/layout/Layout";

import { useSearch } from "../context/Search";

const Search = () => {
  const [value, setValue] = useSearch();
  const url = "http://localhost:8000";

  return (
    <Layout>
      <div className="container">
        <div className="text-center">
          <h2>search result</h2>
          <h6>
            {value?.result.length < 1
              ? "no product"
              : `Found ${value?.result.length}`}
          </h6>
        </div>
        <div className="d-flex flex-wrap mt-4">
          {value?.result.map((p) => (
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
                <button className="btn btn-outline-dark">More Details</button>
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

export default Search;
