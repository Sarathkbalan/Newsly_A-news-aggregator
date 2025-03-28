import React from "react";
import { Link, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";
import Logo  from "../assets/images/logo.png"
import Logo2  from "../assets/images/logo2.png"
import Search  from "../assets/images/searchbar.png"
import Newslogo  from "../assets/images/newslogo.png"


 
const AuthLayout = () => {
  return (
    <>
      <div className="h-20 bg-green-800 flex items-center px-5">
        <img src={Logo} alt="Logo" className="h-16" />
      </div>

      <hr className="border-t-2 border-gray-800 my-4" />

      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between px-5 md:px-20">
        <Link to="/login" className="mb-5 md:mb-0">
          <img
            src={Logo2}
            alt="Logo"
            className="h-64 md:h-80 hover:shadow-xl hover:shadow-yellow-500 shadow-xl shadow-green-500"
          />
        </Link>

        <div className="bg-green-800 p-5 rounded-lg w-full max-w-md">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="" className="h-12" />
            <div className="relative w-full">
              <img
                src={Search}
                className="absolute left-2 top-3 h-6"
                alt=""
              />
              <input
                type="text"
                placeholder="NEWSly search"
                className="w-full h-10 pl-10 bg-gray-200 rounded-full"
              />
            </div>
          </div>

          <div className="bg-white p-5 mt-5 rounded-lg shadow-lg">
            <img src={Newslogo} alt="" />
          </div>
        </div>
      </div>

      <Outlet />
      <ToastContainer />
      <Footer />
    </>
  );
};

export default AuthLayout;
 