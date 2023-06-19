import React from "react";

import { useSearch } from "../../context/Search";

import axios from "axios";

import { useNavigate } from "react-router-dom";

const SeaqrchInput = () => {
  const navigate = useNavigate();
  const [value, setValue] = useSearch();
  const url = "http://localhost:8000";

  const HandelSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`${url}/search/${value.keywords}`);
      setValue({ ...value, result: data });
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // ____________________ SEARCH INPUT ____________________

    <form className="d-flex" role="search" onSubmit={HandelSubmit}>
      <input
        className="form-control me-2"
        type="search"
        placeholder="Search"
        aria-label="Search"
        value={value.keywords}
        onChange={(e) => setValue({ ...value, keywords: e.target.value })}
      />
      <button className="btn btn-outline-success" type="submit">
        Search
      </button>
    </form>
  );
};

export default SeaqrchInput;
