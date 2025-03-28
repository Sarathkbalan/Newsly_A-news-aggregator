import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const AddNews = () => {
  const [news, setNews] = useState({
    title: "",
    description: "",
    categories: "", 
    url: "", 
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAddNews = async () => {
    try {
      const formData = new FormData();
      formData.append("title", news.title);
      formData.append("description", news.description);
      formData.append("categories", news.categories); 
      formData.append("url", news.url); 
      if (image) {
        formData.append("Newsimage", image); 
      }
      
      const response = await axios.post("/api/addnews", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      console.log(response.data);
      setMessage("News added successfully!");
      setNews({ title: "", description: "", categories: "", url: "" });
      setImage(null);
    } catch (error) {
      console.error("Error adding news:", error);
      setMessage("Failed to add news. Please try again.");
    }
  };

  return (

    <>
    <Navbar/>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white w-full max-w-4xl p-10 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-700">Add News</h1>

        {message && (
          <p className={`text-center font-semibold ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Title"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            value={news.title}
            onChange={(e) => setNews({ ...news, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Categories"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            value={news.categories}
            onChange={(e) => setNews({ ...news, categories: e.target.value })}
          />
        </div>

        <input
          type="text"
          placeholder="URL"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 mt-4"
          value={news.url}
          onChange={(e) => setNews({ ...news, url: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 mt-4 resize-none"
          rows="4"
          value={news.description}
          onChange={(e) => setNews({ ...news, description: e.target.value })}
        ></textarea>

        <input
          type="file"
          accept="image/*"
          className="w-full mt-4 p-3 border border-gray-300 rounded-lg"
          onChange={handleFileChange}
        />

        <button
          className="w-full bg-green-600 text-white py-3 mt-6 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
          onClick={handleAddNews}
        >
          Add News
        </button>
      </div>
    </div>
    </>
  );
};

export default AddNews;