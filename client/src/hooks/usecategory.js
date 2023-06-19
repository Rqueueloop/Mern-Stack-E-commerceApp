import axios from "axios";
import { useEffect, useState } from "react";

export default function useCategory() {
  const [categories, setCategories] = useState([]);
  const url = "http://localhost:8000";

  // __________ GET CATEGORY __________

  const getcategory = async () => {
    const { data } = await axios.get(`${url}/get-category`);
    setCategories(data?.Category);
    try {
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getcategory();
  }, []);
  return categories;
}
