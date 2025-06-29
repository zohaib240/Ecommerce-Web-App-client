import  { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, setUser } from "../Config/redux/reducers/userSlice.js";
import { FaPlus } from "react-icons/fa";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const user = useSelector((state) => state.user.user);
  const accessToken = useSelector((state) => state.user.accessToken);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUserId = localStorage.getItem("userId");

    if (storedToken && storedUserId) {
      fetchUser(storedToken);
    }
  }, [accessToken]);

  const fetchUser = async (token) => {
    try {
      const response = await axios.get(
        "https://ecommerce-web-app-server.vercel.app/api/v1/auth/single-user",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      dispatch(setUser({
        user: response.data,
        accessToken: token
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSellClick = () => {
    if (user) {
      navigate("/Dashboard");
    } else {
      navigate("/login");
    }
  };

  const userLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      customClass: {
        popup: 'custom-swal-popup',
        backdrop: 'custom-swal-backdrop',
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Show blur and spinner
        const blurDiv = document.createElement("div");
        blurDiv.id = "logout-blur-overlay";
        blurDiv.innerHTML = `
          <div style="
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            backdrop-filter: blur(6px);
            background-color: rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
          ">
            <span class="loading loading-spinner loading-lg text-white"></span>
          </div>
        `;
        document.body.appendChild(blurDiv);

        try {
          setLogoutLoading(true);

          await axios.post(
            "https://ecommerce-web-app-server.vercel.app/api/v1/auth/logout",
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
              withCredentials: true,
            }
          );

          dispatch(logoutUser());
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userId");

          // Remove blur and show success
          document.getElementById("logout-blur-overlay")?.remove();

          Swal.fire({
            title: "Logged out!",
            text: "You have been logged out successfully.",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              popup: 'custom-swal-popup'
            }
          });

          navigate("/login");
        } catch (error) {
          document.getElementById("logout-blur-overlay")?.remove();
          Swal.fire({
            title: "Error!",
            text: "Something went wrong while logging out.",
            icon: "error",
            confirmButtonText: "OK"
          });
        } finally {
          setLogoutLoading(false);
        }
      }
    });
  };

  return (
    <div className="navbar bg-red-700 px-4">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl text-white">
          KHARIDAAR
        </Link>
      </div>

      {/* Sell Button */}
      <div className="mr-4">
        <button
          onClick={handleSellClick}
          className="flex items-center gap-2 bg-white text-red-700 font-bold px-4 py-2 rounded-full hover:bg-red-100 transition border border-red-700"
        >
          <FaPlus className="text-sm" /> Sell
        </button>
      </div>

      {/* User Avatar and Dropdown */}
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-12 aspect-square rounded-full overflow-hidden border border-gray-300">
              <img
                src={user?.user?.profilePicture || "https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg"}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {user ? (
              <>
                <li className="text-center"><Link to="/">Home</Link></li>
                <li className="text-center"><Link to="/Profile">Profile</Link></li>
                <li className="text-center">
                  <button
                    onClick={userLogout}
                    disabled={logoutLoading}
                    className="btn btn-sm bg-red-500 text-white hover:bg-red-600"
                  >
                    {logoutLoading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      "Logout"
                    )}
                  </button>
                </li>
              </>
            ) : (
              <li className="text-center"><Link to="/Login">Login</Link></li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
