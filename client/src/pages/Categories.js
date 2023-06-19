import React from "react";

import Layout from "../components/layout/Layout";

import useCategory from "../hooks/usecategory";

import { Link } from "react-router-dom";

const Categories = () => {
  const categories = useCategory();
  return (
    <Layout>
      <div className="container">
        <div className="row">
          {categories.map((c) => (
            <div className="col-md-6 mt-5 mb-3 gx-3 gy-3" key={c._id}>
              <Link
                to={`/category/${c.slug}`}
                className="btn btn-outline-dark  "
              >
                {c.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
