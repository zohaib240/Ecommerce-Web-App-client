import  { useRef, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const fullName = useRef();
  const userName = useRef();
  const email = useRef();
  const password = useRef();
  const mobileNumber = useRef();
  const [image, setimage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    setimage(event.target.files[0]);
  };
  console.log(handleImageChange);
  

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('fullName', fullName.current.value);
      formData.append('userName', userName.current.value);
      formData.append('email', email.current.value);
      formData.append('password', password.current.value);
      formData.append('mobileNumber', mobileNumber.current.value);
      if (image) {
        formData.append('image', image);
      }
      fullName.current.value = "";
      userName.current.value = "";
      email.current.value = "";
      password.current.value = "";
      

      const response = await axios.post('https://ecommerce-web-app-server.vercel.app/api/v1/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true, // ✅ Important for authentication
        
      });

      console.log(response.data);

      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Registration successful!',
      }).then(() => {
        navigate('/login'); 
      });

    } catch (error) {
      console.error("Registration Error:", error.response?.data); // ✅ Debugging Step
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Registration failed. User already Exist.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-center mt-8 text-4xl font-bold text-[#d32e2e]">Register</h1>
      <div className="flex justify-center items-center mt-9">
        <form
          className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
          onSubmit={handleRegister}
        >
          <div className="mb-4">
            <input type="text" required placeholder="Enter your first name" ref={userName} className="input input-bordered w-full" />
          </div>
          <div className="mb-4">
            <input type="text" placeholder="Enter your last name" ref={fullName} className="input input-bordered w-full" />
          </div>
          <div className="mb-4">
            <input type="email" required placeholder="Enter your email" ref={email} className="input input-bordered w-full" />
          </div>
          <div className="mb-4">
            <input type="password" required placeholder="Enter your password" ref={password} className="input input-bordered w-full" />
          </div>
          <div className="mb-4">
            <input type="number" required placeholder="Enter your mobileNumber" ref={mobileNumber} className="input input-bordered w-full" />
          </div>
          <div className="mb-4">
            <input type="file" required accept="image/*" onChange={handleImageChange} className="file-input file-input-bordered w-full" />
          </div>
          <div className="flex justify-center">
            <button 
              type="submit" 
              className={`btn bg-[#d32e2e] text-white w-25 ${loading ? 'btn-disabled' : ''}`}
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner"></span> : 'Register'}
            </button>
          </div>
          <div className="mt-2 text-center">
      <Link to="/login" className="text-[#d32e2e] hover:underline">
        Already a user? Login here.
      </Link>
    </div>
    </form>
      </div>
    </>
  );
};

export default Register;

