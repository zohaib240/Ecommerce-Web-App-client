// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const HomePage = () => {
//   const [products, setProducts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [noMoreProducts, setNoMoreProducts] = useState(false);

//   const fetchProducts = async (pageNum = 1) => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `https://ecommerce-web-app-server.vercel.app/api/v1/allProduct?page=${pageNum}&limit=12`
//       );

//       console.log(res);
      
//       if (res.data.message === "No products left!") {
//         setNoMoreProducts(true);
//       } else {
//         setProducts((prev) => [...prev, ...res.data]);
//         setNoMoreProducts(false);
//       }
//     } catch (error) {
//       console.error(error.message || error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts(page);
//   }, [page]);

//   const handleLoadMore = () => {
//     setPage((prev) => prev + 1);
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       <h2 className="text-3xl font-bold text-center mb-6">All Products</h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {products.map((product) => (
//           <div key={product._id} className="bg-white shadow-md rounded-lg p-4">
//            <img
//   src={product.postImage || product.image || "https://via.placeholder.com/150"}
//   alt={product.name}
//   className="w-full h-40 object-cover rounded-md mb-4"
// />

//             <h3 className="text-xl font-semibold">{product.name}</h3>
//             <p className="text-gray-600">{product.description}</p>
//             <p className="font-bold mt-2">Rs {product.price}</p>
//           </div>
//         ))}
//       </div>

//       {loading && <p className="text-center my-4">Loading...</p>}

//       <div className="flex justify-center mt-8">
//         {!noMoreProducts && (
//           <button
//             onClick={handleLoadMore}
//             className="btn bg-blue-600 text-white px-6"
//             disabled={loading}
//           >
//             {loading ? "Loading..." : "Load More"}
//           </button>
//         )}
//         {noMoreProducts && (
//           <p className="text-center text-gray-500">No more products!</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HomePage;


import React, { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [noMorePages, setNoMorePages] = useState(false);
  const limit = 12;

  const fetchProducts = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://ecommerce-web-app-server.vercel.app/api/v1/allProduct?page=${pageNum}&limit=${limit}`
      );

      const data = res.data;

      // agar products kam hai limit se, to last page hai
      if (data.length < limit) {
        setNoMorePages(true);
      } else {
        setNoMorePages(false);
      }

      setProducts(data);
    } catch (error) {
      console.error(error.message || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (!noMorePages) setPage((prev) => prev + 1);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-6">All Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white shadow-md rounded-lg p-4">
            <img
              src={product.postImage || product.image || "https://via.placeholder.com/150"}
              alt={product.name}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <p className="font-bold mt-2">Rs {product.price}</p>
          </div>
        ))}
      </div>

      {loading && <p className="text-center my-4">Loading...</p>}

      <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-4 py-2 rounded-md border bg-white text-black disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(page + 1)].map((_, i) =>
          i < page + (noMorePages ? 0 : 1) ? (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-md border ${
                page === i + 1 ? "bg-blue-600 text-white" : "bg-white text-black"
              }`}
            >
              {i + 1}
            </button>
          ) : null
        )}

        <button
          onClick={handleNext}
          disabled={noMorePages}
          className="px-4 py-2 rounded-md border bg-white text-black disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HomePage;

