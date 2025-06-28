// import React, { useRef, useState } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { setUser } from '../Config/redux/reducers/userSlice.js';

// const Login = () => {
//   const email = useRef();
//   const password = useRef();
//   const [loading, setLoading] = useState(false);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();


//   const handleLogin = async (event) => {
//     event.preventDefault();
  
//     try {
//       const response = await axios.post(
//         "https://ecommerce-web-app-server.vercel.app/api/v1/auth/login",
//         {
//           email: email.current.value,
//           password: password.current.value,
//         },
//         { withCredentials: true } // ✅ Cookie send karne ke liye zaroori hai
//       );

//       console.log(response);
      

//       if (response.data && response.data.accessToken) {
//         const { accessToken, data : user } = response.data;

//         dispatch(setUser({ userId: user.id, accessToken }));
//         localStorage.setItem("accessToken", accessToken);
//         localStorage.setItem("userId", user.id);}
  
//     console.log(response);
  
//       Swal.fire({
//         icon: "success",
//         title: "Success!",
//         text: "Login successful!",
//       }).then(() => {
//         navigate("/");
//       });
  
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "Login failed. Please check your email and password!",
//       });
//     }finally {
//           setLoading(false);
//         }
//   };
  

//   return (
//     <>
//       <h1 className="text-center mt-8 text-4xl font-bold">Login</h1>
//       <div className="flex justify-center items-center mt-9">
//         <form
//           className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
//           onSubmit={handleLogin}
//         >
//           <div className="mb-4">
//             <input type="email" placeholder="Enter your email" ref={email} className="input input-bordered w-full" required />
//           </div>
//           <div className="mb-4">
//             <input type="password" placeholder="Enter your password" ref={password} className="input input-bordered w-full" required />
//           </div>
//           <div className="flex justify-center">
//           <button type="submit" className={`btn bg-blue-700 text-white w-32 ${loading ? "btn-disabled" : ""}`} disabled={loading}>
//         {loading ? <span className="loading loading-spinner"></span> : "Login"}
//       </button>
//           </div>
//           <div className="mt-2 text-center">
//             <a href="/register" className="text-blue-700">Not a user? Register here.</a>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };

// export default Login;


import React, { useRef, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../Config/redux/reducers/userSlice.js';

const Login = () => {
  const email = useRef();
  const password = useRef();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://ecommerce-web-app-server.vercel.app/api/v1/auth/login",
        {
          email: email.current.value,
          password: password.current.value,
        },
        { withCredentials: true }
      );

      if (response.data && response.data.accessToken) {
        const { accessToken, data: user } = response.data;
        dispatch(setUser({ userId: user.id, accessToken }));
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userId", user.id);
      }

      Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: "Login successful!",
        confirmButtonColor: "#d32e2e",
      }).then(() => navigate("/"));

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Check your email and password.",
        confirmButtonColor: "#d32e2e",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 p-10 rounded-2xl shadow-xl relative">
        <div className="absolute -top-12 right-8 w-24 h-24 bg-[#d32e2e22] blur-2xl rounded-full z-0 animate-pulse"></div>

        <h2 className="text-3xl font-bold text-center text-[#d32e2e] mb-8 relative z-10">Login</h2>

        <form onSubmit={handleLogin} className="space-y-5 z-10 relative">
          <input
            type="email"
            ref={email}
            placeholder="Email"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d32e2e] placeholder-gray-500 transition-all"
          />
          <input
            type="password"
            ref={password}
            placeholder="Password"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d32e2e] placeholder-gray-500 transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-[#d32e2e] text-white font-semibold rounded-lg hover:bg-[#b72929] transition-all duration-300 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading ? <span className="loading loading-spinner text-white" /> : "Login"}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-6">
          Don’t have an account? <a href="/register" className="text-[#d32e2e] hover:underline">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
