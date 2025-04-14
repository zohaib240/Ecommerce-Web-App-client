import React, { useRef, useState } from "react";
import { useDispatch} from "react-redux";
import { addproduct } from "../Config/redux/reducers/productSlice"; // path check kar lena
import axios from "axios";
import Swal from "sweetalert2";



const Dashboard = () => {
  const Name = useRef();
  const Description = useRef();
  const Price = useRef();
  const [image, setimage] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  
  const handleImageChange = (event) => {
    setimage(event.target.files[0]);
  };

  const addProduct = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", Name.current?.value || "");
      formData.append("description", Description.current?.value || "");
      formData.append("price", Price.current?.value || "");
      formData.append("image", image);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        return Swal.fire("Unauthorized", "Please login first", "error");
      }

      const response = await axios.post(
        "https://ecommerce-web-app-server.vercel.app/api/v1/addProduct",
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data' ,
            Authorization: `Bearer ${token}`,
          },
        }
      );

dispatch(addproduct(response.data.product)); // response mein backend se aaya hua product


console.log(response);


      // Clear form
      Name.current.value = "";
      Description.current.value = "";
      Price.current.value = "";
      setimage(null);

      Swal.fire("Success", "Product added successfully!", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", error.response?.data?.error || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center my-4">Add Product</h1>

      <form className="bg-white p-6 rounded-lg shadow-md" onSubmit={addProduct}>
        <div className="mb-4">
          <input type="text" placeholder="Product Name" ref={Name} className="input input-bordered w-full" />
        </div>
        <div className="mb-4">
          <input type="text" placeholder="Description" ref={Description} className="input input-bordered w-full" />
        </div>
        <div className="mb-4">
          <input type="number" placeholder="Price" ref={Price} className="input input-bordered w-full" />
        </div>
        <div className="mb-4">
          <input type="file" accept="image/*" onChange={handleImageChange} className="file-input file-input-bordered w-full" />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className={`btn bg-blue-700 text-white w-32 ${loading ? "btn-disabled" : ""}`}
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner"></span> : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Dashboard;
