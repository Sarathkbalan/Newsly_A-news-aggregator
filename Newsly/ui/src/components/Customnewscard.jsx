import React, { useEffect,useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const CustomNewsCard = ({ item, onDelete, onUpdate }) => {
  const imageSrc = item.image ? `data:image/jpeg;base64,${item.image}` : null;

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.title);
  const [editedDescription, setEditedDescription] = useState(item.description);
  const [editedUrl, setEditedUrl] = useState(item.url);
  const [editedCategories, setEditedCategories] = useState(item.categories);
  const [selectedImage, setSelectedImage] = useState(null);
   const [checkAdmin,setCheckAdmin]=useState(false)
  const navigate=useNavigate()

  const addComment = () => {
    if (comment.trim()) {
      setComments([...comments, comment]);
      setComment("");
    }
  };
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
            
          }
  
          }catch(error){
             console.error('Error in checking auth status',error);
          }
      }
      checkauth();
    },[]);
 
    useEffect(()=>{
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this news item?")) {
      return; // Exit if the user cancels
    }

    try {
      const response = await fetch(`/api/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: item.title }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      onDelete(item.title); // Remove the item from the UI
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  }
  handleDelete();
    },[]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(item.title);
    setEditedDescription(item.description);
    setEditedUrl(item.url);
    setEditedCategories(item.categories);
    setSelectedImage(null);
  };

  const handleSaveEdit = async () => {
    const formData = new FormData();
    formData.append("title", item.title); // Original title (for finding the news)
    if (editedTitle !== item.title) formData.append("newTitle", editedTitle);
    formData.append("description", editedDescription);
    formData.append("url", editedUrl);
    formData.append("categories", editedCategories);
    if (selectedImage) formData.append("Newsimage", selectedImage);

    try {
      const response = await fetch(`/api/editnews`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedNews = await response.json();
      onUpdate(updatedNews.updatedNews); // Update the UI with new data
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating news:", error);
    }
    navigate("/CustomNews")
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-md bg-white p-4">
      {imageSrc && !isEditing && (
        <img src={imageSrc} alt={item.title} className="w-full h-56 object-cover" />
      )}

      {isEditing ? (
        <>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            placeholder="Edit title"
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            placeholder="Edit description"
          />
          <input
            type="text"
            value={editedUrl}
            onChange={(e) => setEditedUrl(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            placeholder="Edit URL"
          />
          <input
            type="text"
            value={editedCategories}
            onChange={(e) => setEditedCategories(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            placeholder="Edit categories"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedImage(e.target.files[0])}
            className="mb-2"
          />
        </>
      ) : (
        <>
          <h2 className="text-lg font-bold mb-2">{item.title}</h2>
          <p className="text-gray-700 mb-4">{item.description}</p>
        </>
      )}

      <div className="mt-4">
        <h3 className="text-md font-semibold mb-2">Comments</h3>
        <div className="space-y-2">
          {comments.map((cmt, index) => (
            <div key={index} className="bg-gray-100 p-2 rounded">
              <p className="text-sm">{cmt}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 flex">
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-l focus:outline-none"
          />
          <button
            onClick={addComment}
            className="px-4 bg-blue-500 text-white rounded-r hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        {!isEditing ? (
          <>
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              Read more
            </a>

            
            <button onClick={handleEdit} className="px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
              Edit
            </button>

            <button onClick={handleDelete} className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600">
              Delete
            </button>
           
          </>
        ) : (
          <>
            <button onClick={handleSaveEdit} className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600">
              Save
            </button>
            <button onClick={handleCancelEdit} className="px-4 py-1 bg-gray-500 text-white rounded hover:bg-gray-600">
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};




export default CustomNewsCard;


