import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo.png"

const Navbar = () => {
  const [username, setUsername] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [checkAdmin,setCheckAdmin]=useState(false)
  const navigate = useNavigate();
  useEffect(()=>{

    const checkauth= async()=>{
      try{
        const res= await fetch('/api/checkauthentication',{
          method:'GET',
          credentials:"include"
        })
        const data = await res.json();
        if (data) {
          console.log(data.Usertype);
          if(data.Usertype=="Admin"){
            setCheckAdmin(true)
          }
          setUsername(data.Username); // Store username in state
        }

        }catch(error){
           console.error('Error in checking auth status',error);
        }
    }
    checkauth();
  },[]);

  const handleProfile = () => {
    navigate(`/profile/${username}`);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <div className="h-[90px] bg-green-800 flex justify-between items-center px-6">
      
        <div className="flex items-center">
          <Link to="/home">
            <img src={Logo} alt="Logo" className="h-[85px] pl-4" />
          </Link>
        </div>

       
        <div className="flex items-center ">
          <input
            type="text"
            placeholder="Search News..."
            className=" w-[500px] h-[40px] rounded-l-3xl pl-4 bg-gray-200 ring-1 ring-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-green-900 text-white rounded-r-3xl ring-1 ring-black"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

       
        <div className="flex items-center space-x-6">
        
          <Link to="/CustomNews" className="px-4 py-2 bg-green-900 text-white rounded-lg ring-1 ring-black">
          CustomNews
          </Link>
        
          <Link to="/home" className="px-4 py-2 bg-green-900 text-white rounded-lg ring-1 ring-black">
         Home
          </Link>
       

        {checkAdmin ? 
          <Link to="/addnews" className="px-4 py-2 bg-green-900 text-white rounded-lg ring-1 ring-black">
            Add News
          </Link>:<Link to="/addnews" className=" hidden px-4 py-2 bg-green-900 text-white rounded-lg ring-1 ring-black">
            Add News
          </Link>
      }
          <button
          onClick={handleProfile}
          to="/profile"className="px-4 py-2 bg-green-900 text-white rounded-lg ring-1 ring-black">
            Profile
          </button>

          
        

          
          <button onClick={handleLogout} className="px-4 py-2 bg-green-900 text-white rounded-lg ring-1 ring-black">
            Logout
          </button>
        </div>
      </div>

      <hr className="border-t-2 border-gray-800 my-4" />
    </>
  );
};

export default Navbar;


