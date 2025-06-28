import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCommentDots, FaHeart, FaRegHeart } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";



const heroImages = [
  "src/assets/hero1.jpg",
  "src/assets/hero2.png.jpg",
  "src/assets/hero3.png.jpg",
  "src/assets/video.mp4"
];

const categories = [
  "All",
  "Fashion",
  "Beauty",
  "Electronics",
  "Laptops",
  "Home",
  "Appliances",
  "Gaming",
  "Clothing",
];

const HomePage = () => {
  const navigate = useNavigate(); 
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user.user);

  const limit = 15;

  const fetchProducts = async (selectedPage = 1, category = "All") => {
    setLoading(true);
    try {
      const categoryParam = category === "All" ? "" : `&category=${category}`;
      const res = await axios.get(
        `https://ecommerce-web-app-server.vercel.app/api/v1/allProduct?page=${selectedPage}&limit=${limit}${categoryParam}`
      );
      const data = res.data;
      setProducts(res.data); // ✅ YEH LINE yahan likhni hai
      console.log("Fetched Data:", data); // Ensure the data is correct

      if (Array.isArray(res.data)) {
        setProducts(res.data);
        const totalProducts = data.totalCount;
        setTotalPages(Math.ceil(totalProducts / limit));
      } else {
        setProducts([]); // Empty products if invalid data
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    console.log("Redux user:", user);
  }, [user]);

  useEffect(() => {

    fetchProducts(page, selectedCategory);
  }, [page, selectedCategory]);



  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === heroImages.length - 1 ? 0 : prevSlide + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };
  
  
  // Like/unlike function

const handleLike = async (productId) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    navigate("/login");
    return;
  }

  try {
    const res = await axios.put(
      `https://ecommerce-web-app-server.vercel.app/api/v1/likeProduct/${productId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const updatedLikes = res.data.likes;
    console.log(updatedLikes)

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === productId
          ? { ...product, likes: [...updatedLikes]}
          : product
      )
    );
  } catch (error) {
    console.log("Like error:", error.response?.data || error.message);
  }
};

  // const [commentOpenFor, setCommentOpenFor] = useState(null);
  // const [commentTexts, setCommentTexts] = useState({});

  // // Comment icon click pe form toggle karne ka function
  // const handleCommentIconClick = (productId) => {
  //   setCommentOpenFor(commentOpenFor === productId ? null : productId);
  // };

  // // Textarea value update karne ka function
  // const handleCommentChange = (productId, text) => {
  //   setCommentTexts((prev) => ({ ...prev, [productId]: text }));
  // };

  // // Comment post karne ka function
  // const handleCommentSubmit = async (productId) => {
  //   const commentText = commentTexts[productId];
  //   if (!commentText || commentText.trim() === "") return;

  //   try {
  //     const res = await fetch(
  //       `http://localhost:5000/api/product/commentProduct/${productId}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${user?.token}`,
  //         },
  //         body: JSON.stringify({ text: commentText }),
  //       }
  //     );

  //     const data = await res.json();

  //     if (res.ok) {
  //       alert("Comment posted!");
  //       setCommentTexts((prev) => ({ ...prev, [productId]: "" }));
  //       setCommentOpenFor(null);
  //       // Yahan apne product/comments refresh karne ka logic lagao
  //     } else {
  //       alert(data.message || "Failed to post comment");
  //     }
  //   } catch (error) {
  //     alert("Something went wrong!");
  //   }
  // };


return (
  <div className="max-w-7xl mx-auto px-4 py-5">
    {/* Hero Section */}
    <div className="w-full h-[250px] sm:h-[350px] md:h-[500px] lg:h-[600px] mb-8 overflow-hidden rounded-lg">
      {heroImages[currentSlide].endsWith(".mp4") ? (
        <video
          key={currentSlide}
          src={heroImages[currentSlide]}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover transition duration-1000"
        />
      ) : (
        <img
          key={currentSlide}
          src={heroImages[currentSlide]}
          alt={`Slide ${currentSlide + 1}`}
          className="w-full h-full object-contain transition duration-1000"
        />
      )}
    </div>

    {/* Categories */}
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => {
            setSelectedCategory(category);
            setPage(1);
          }}
          className={`px-4 py-2 rounded-full border ${
            selectedCategory === category
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600"
          } transition-colors`}
        >
          {category}
        </button>
      ))}
    </div>

    {/* product cart --------->>>>>>> */}

<div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 px-4">
  {products.map((item) => {
    const createdAt = new Date(item.createdAt);
    const now = new Date();
    const diffMs = now - createdAt;

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);

    const timeAgo =
      diffDays > 0
        ? `${diffDays} days ago`
        : diffHrs > 0
        ? `${diffHrs} hours ago`
        : diffMins > 0
        ? `${diffMins} minutes ago`
        : "Just now";

    return (
      <Link to={`/singlecart/${item._id}`} key={item._id}>
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden cursor-pointer relative
                        w-full max-w-[180px] mx-auto
                        sm:max-w-[160px] md:max-w-[180px] lg:max-w-[160px] xl:max-w-[160px]">
          <img
            src={item.postImage || item.image || "https://via.placeholder.com/150"}
            alt={item.name}
            className="w-full aspect-[4/3] object-cover rounded-t-xl"
          />
          <div className="p-2 flex flex-col flex-grow justify-between">
            {/* Price Black Bold */}
            <p className="text-black font-bold text-sm mb-1">Rs {item.price}</p>

            {/* Title */}
            <h3 className="text-xs font-semibold text-gray-800 truncate">{item.name}</h3>

            {/* Location */}
            <p className="text-gray-600 text-[11px] mt-1 truncate flex">
            <MdLocationOn className="text-red-500 text-[14px]" />
            {item.location || "Unknown Location"}</p>

            {/* Time Ago */}
            <p className="text-gray-600 text-[10px]">{timeAgo}</p>

            {/* Like Button */}
            <div className="mt-1 flex justify-between">

              {/* Comment Icon with counter */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/singlecart/${item._id}`); // <-- Yeh line redirect karegi

                  }}
                  className="flex items-center text-sm cursor-pointer group"
                  title="Comments"
                >
                  <FaCommentDots className="text-gray-400 text-[14px] transition-all duration-300 group-hover:text-blue-500" />
                  <span className="ml-1 text-[10px]">{item.comments?.length || 0}</span>
                </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleLike(item._id);
                }}
                className="flex items-center text-sm cursor-pointer group"
              >
                {user && item.likes?.includes(user.user._id) ? (
                  <FaHeart className="text-red-500 text-[14px] transition-all duration-300" />
                ) : (
                  <FaRegHeart className="text-gray-400 text-[14px] transition-all duration-300 group-hover:text-red-500" />
                )}
                <span className="ml-1 text-[10px]">{item.likes?.length || 0}</span>
              </button>

             
            </div>
                          {/* Comment form, modern style, toggle
              {commentOpenFor === item._id && (
                <div className="mt-2 border rounded-md p-2 bg-gray-50 shadow-md">
                  <textarea
                    rows={2}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm resize-none focus:outline-blue-500"
                    placeholder="Write a comment..."
                    value={commentTexts[item._id] || ""}
                    onChange={(e) => handleCommentChange(item._id, e.target.value)}
                  />
                  <button
                    onClick={() => handleCommentSubmit(item._id)}
                    className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 rounded transition"
                  >
                    Post Comment
                  </button> */}
          {/* </div>
              )} */}

          </div>
        </div>
      </Link>
    );
  })}
</div>



    {/* Pagination */}
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={page === 1}
        className="px-3 py-1 rounded-md border text-blue-600 disabled:opacity-50"
      >
        Prev
      </button>

      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
        (pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={`px-4 py-2 rounded-md border ${
              page === pageNumber
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600"
            }`}
          >
            {pageNumber}
          </button>
        )
      )}

      <button
        onClick={() => setPage((prev) => prev + 1)}
        disabled={products.length < limit}
        className="px-3 py-1 rounded-md border text-blue-600 disabled:opacity-50"
      >
        Next
      </button>
    </div>

    {loading && (
      <div className="flex justify-center mt-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    )}
  </div>
);

}
export default HomePage;