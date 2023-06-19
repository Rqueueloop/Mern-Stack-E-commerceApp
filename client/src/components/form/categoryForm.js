import React from "react";

const CategoryForm = ({ value, setvalue, HandleSubmit }) => {
  return (
    <>
      <form onSubmit={HandleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter New Category "
            value={value}
            onChange={(e) => setvalue(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-dark">
          Submit
        </button>
      </form>
    </>
  );
};

export default CategoryForm;
