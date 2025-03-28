import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/images/logo.png";

const SignupPage = () => {
  const [Name, setName] = useState("");
  const [UserName, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [Email, setEmail] = useState("");
  const [Usertype, setUsertype] = useState("");
  const [Categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // State for success toggle
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const navigate = useNavigate();

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    setCategories((prev) =>
      prev.includes(value) ? prev.filter((cat) => cat !== value) : [...prev, value]
    );
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    const formData = new FormData();
    formData.append("name", Name);
    formData.append("username", UserName);
    formData.append("password", Password);
    formData.append("email", Email);
    formData.append("userType", Usertype);
    formData.append("categories", JSON.stringify(Categories));

    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput.files.length > 0) {
      formData.append("profilepicture", fileInput.files[0]);
    }

    try {
      await axios.post("/api/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsSuccess(true); // Set success state to true
      setError(""); // Clear any previous errors

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed. Please try again!");
      setIsSuccess(false); // Ensure success state is false on error
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-br from-green-200 to-green-400 p-4">
      {/* Left Section */}
      <div className="hidden md:flex h-[700px] w-[550px] bg-green-800 rounded-tr-[350px] rounded-bl-[250px] shadow-xl shadow-green-900 flex-col justify-center items-center text-white">
        <h2 className="text-6xl font-bold">Welcome Back</h2>
        <p className="text-xl mt-4 text-center">To Stay Connected With Us</p>
        <p className="text-xl text-center">Please Signup With Your Personal Info</p>
        <img className="mt-10 w-24" src={Logo} alt="Logo" />
      </div>

      {/* Right Section */}
      <div className="w-full md:w-2/3 bg-white shadow-lg rounded-xl p-6 md:p-12 flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-bold text-green-800">Welcome</h2>
        <p className="text-lg text-gray-600 mt-2">Create an account to continue</p>

        {/* Success Message with Progress Bar */}
        {isSuccess && (
          <div className="w-full max-w-md mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <p className="text-center">Signup successful! Redirecting to login...</p>
            <div className="w-full h-2 bg-green-200 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-green-500 rounded-full animate-progress"></div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && <p className="text-red-500 mt-4 font-medium">{error}</p>}

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="w-full max-w-md mt-6 space-y-4">
          <input type="text" value={Name} onChange={(e) => setName(e.target.value)} className="w-full h-12 rounded-lg pl-4 bg-green-300 text-lg shadow-md focus:ring-2 focus:ring-green-500 outline-none" placeholder="Name" required />

          <input type="text" value={UserName} onChange={(e) => setUsername(e.target.value)} className="w-full h-12 rounded-lg pl-4 bg-green-300 text-lg shadow-md focus:ring-2 focus:ring-green-500 outline-none" placeholder="Username" required />

          <input type="email" value={Email} onChange={(e) => setEmail(e.target.value)} className="w-full h-12 rounded-lg pl-4 bg-green-300 text-lg shadow-md focus:ring-2 focus:ring-green-500 outline-none" placeholder="yourmail@gmail.com" required />

          <input type="password" value={Password} onChange={(e) => setPassword(e.target.value)} className="w-full h-12 rounded-lg pl-4 bg-green-300 text-lg shadow-md focus:ring-2 focus:ring-green-500 outline-none" placeholder="Password" required />

          <select value={Usertype} onChange={(e) => setUsertype(e.target.value)} className="w-full h-12 rounded-lg pl-4 bg-green-300 text-lg shadow-md focus:ring-2 focus:ring-green-500 outline-none">
            <option value="">Select user type</option>
            <option value="Admin">Admin</option>
            <option value="user">User</option>
          </select>

          <div>
            <p className="text-gray-700 text-lg font-semibold">Categories:</p>
            <div className="flex flex-wrap gap-3 mt-2">
              {["sports", "entertainment", "technology", "health", "science"].map((cat) => (
                <label key={cat} className="flex items-center space-x-2">
                  <input type="checkbox" value={cat} checked={Categories.includes(cat)} onChange={handleCheckboxChange} className="form-checkbox w-5 h-5 text-green-600" />
                  <span className="text-gray-700 capitalize">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <input type="file" accept="image/*" className="w-full h-12 rounded-lg pl-4 bg-green-300 text-lg shadow-md focus:ring-2 focus:ring-green-500 outline-none" />

          <button type="submit" disabled={isLoading} className="w-full h-12 bg-green-900 hover:bg-green-600 text-white font-bold text-lg rounded-lg shadow-md transition">
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4">
          Already have an account? <Link className="text-green-600 hover:underline" to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

