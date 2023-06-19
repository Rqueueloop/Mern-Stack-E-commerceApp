import React, { useEffect, useState } from "react";

import Layout from "../../components/layout/Layout";

import AdminMenu from "../../components/layout/AdminMenu";

import toast from "react-hot-toast";

import axios from "axios";

import CategoryForm from "../../components/form/categoryForm";

import { Modal } from "antd";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);

  const [name, setname] = useState("");

  const [visible, setVisible] = useState(false);

  const [selected, setSelected] = useState(null);

  const [updatedName, setUpdatedName] = useState("");

  const url = "http://localhost:8000";

  // ---------------------- HANDLE FORM
  const HandleSubmit = async (event) => {
    event.preventDefault();
    const { data } = await axios.post(`${url}/create-category`, { name });
    if (data.success) {
      toast.success(`${name} is created`);
      getAllCategories();
      setname("");
    } else {
      toast.error(data.message);
    }

    try {
    } catch (error) {
      console.log(error);
      toast.error("Somethinf Went Wrong In Input Form ");
    }
  };

  // ---------------------- GET ALL CATEGORIES 
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(`${url}/get-category`);
      if (data?.success) {
        setCategories(data?.Category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong in getting Category !");
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  // ----------------------  UPDATE CATEGORY
  const HandleUpdateSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.put(
        `${url}/update-category/${selected._id}`,
        { name: updatedName }
      );
      if (data.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  // ----------------------  DELETE CATEGORY
  const HandleDeleteSubmit = async (id) => {
    try {
      const { data } = await axios.delete(`${url}/delete-category/${id}`, {
        name: updatedName,
      });
      if (data.success) {
        toast.success("Category is deleted!");
        getAllCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h4>Manage Category</h4>
            <div className="p-3 w-50">
              <CategoryForm
                HandleSubmit={HandleSubmit}
                value={name}
                setvalue={setname}
              />
            </div>
            <div className="w-75">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((categorie) => (
                    <>
                      <tr>
                        <td key={categorie._id}>{categorie.name}</td>
                        <td>
                          <button
                            className="btn btn-dark ms-2"
                            onClick={() => {
                              setVisible(true);
                              setUpdatedName(categorie.name);
                              setSelected(categorie);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger ms-2"
                            onClick={() => HandleDeleteSubmit(categorie._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
            <Modal
              onCancel={() => setVisible(false)}
              footer={null}
              visible={visible}
            >
              <CategoryForm
                value={updatedName}
                setvalue={setUpdatedName}
                HandleSubmit={HandleUpdateSubmit}
              />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
