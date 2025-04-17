import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BsThreeDotsVertical } from "react-icons/bs";
import Swal from "sweetalert2";


const SingleProduct = () => {
  const { id } = useParams();
console.log("useParams ID:", id);
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [editData, setEditData] = useState({
    name: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://ecommerce-web-app-server.vercel.app/api/v1/singleProduct/${id}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
          
        );
        console.log("Product API Response:", res.data); // ✅ yahan likho
        setProduct(res.data);
        setEditData({
          name: res.data.name || res.data.title,
          description: res.data.description,
          price: res.data.price,
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchProduct();
  }, [id]);

  // // 🗑️ Delete handler


  const handleDelete = async (id) => {
    const token = localStorage.getItem("accessToken");
  
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
  
    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `https://ecommerce-web-app-server.vercel.app/api/v1/deleteProduct/${id}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`, // ✅ This is enough
            },
          }
        );
  
        if (response.status === 200) {
          Swal.fire("Deleted!", response.data.message, "success");
          navigate("/profile"); // or update state if needed
        } else {
          Swal.fire("Error!", response.data.message || "Deletion failed.", "error");
        }
      } catch (error) {
        console.error("Error deleting product:", error.response?.data || error.message);
        Swal.fire("Error!", "Something went wrong while deleting.", "error");
      }
    }
  };

  // ✏️ Update handler

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `https://ecommerce-web-app-server.vercel.app/api/v1/updateProduct/${id}`,
        editData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setProduct(res.data.product);
      setEditModal(false);
  
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Product updated successfully!",
        confirmButtonColor: "#3085d6",
      });
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong while updating the product.",
        confirmButtonColor: "#d33",
      });
    }
  };
  

  if (!product) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow p-6 mt-10 rounded relative">
      {/* 3 Dot Menu */}
      <div className="absolute right-4 top-4">
        <BsThreeDotsVertical
          className="text-2xl cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        />

   {menuOpen && (
  <div className="absolute right-0 mt-2 backdrop-blur-md bg-white/70 border border-gray-300 rounded-2xl shadow-lg p-3 space-y-2 z-10 w-32">
    <button
      onClick={() => {
        setEditModal(true);
        setMenuOpen(false);
      }}
      className="block w-full text-left text-blue-700 hover:bg-blue-100 hover:text-blue-900 px-3 py-1.5 rounded-md transition-all"
    >
      ✏️ Edit
    </button>
    <button
      onClick={() => {
        handleDelete(id);
        setMenuOpen(false);
      }}
      className="block w-full text-left text-red-600 hover:bg-red-100 hover:text-red-800 px-3 py-1.5 rounded-md transition-all"
    >
      🗑️ Delete
    </button>
  </div>
)}

      </div>

      {/* Product Detail */}   

      <div className="w-full h-[300px] flex justify-center items-center bg-gray-100 rounded overflow-hidden">
        <img
          src={product.postImage}
          alt={product.title}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <h2 className="text-2xl font-bold mt-4">{product.title || product.name}</h2>
      <p className="text-gray-700 my-2">{product.description}</p>
      <p className="text-green-600 font-bold">Rs. {product.price}</p>

      {/* ✨ Edit Modal */}
   {editModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-2xl p-8 w-full max-w-md animate-fade-in">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Product</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={editData.name}
          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Description"
          value={editData.description}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={4}
        />
        <input
          type="number"
          placeholder="Price"
          value={editData.price}
          onChange={(e) => setEditData({ ...editData, price: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => setEditModal(false)}
            className="px-4 py-2 rounded-xl border border-gray-400 text-gray-700 hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default SingleProduct;
