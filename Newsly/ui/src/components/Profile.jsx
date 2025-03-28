import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer"

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedCategories, setEditedCategories] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const response = await fetch("/api/checkauthentication", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Not authenticated");
      }

      const data = await response.json();
      setUsername(data.Username);
      fetchProfile(data.Username);
    } catch (error) {
      console.error("Error checking authentication:", error);
    }
  };

  const fetchProfile = async (username) => {
    try {
      const response = await fetch(`/api/profile/${username}`);
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      const data = await response.json();
      setProfile(data);
      setEditedName(data.Name);
      setEditedEmail(data.Email);
      setEditedCategories(data.Categories.join(", "));
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedName(profile.Name);
    setEditedEmail(profile.Email);
    setEditedCategories(profile.Categories.join(", "));
    setSelectedImage(null);
  };

  const handleSaveEdit = async () => {
    const formData = new FormData();
    formData.append("Username", username);
    formData.append("Name", editedName);
    formData.append("Email", editedEmail);
    formData.append("Categories", editedCategories.split(",").map((c) => c.trim()));
    if (selectedImage) formData.append("image", selectedImage);

    try {
      const response = await fetch(`/api/editprofile`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile.updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) {
      return;
    }

    try {
      const response = await fetch(`/api/deleteprofile`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Username: username }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete profile");
      }

      alert("Profile deleted successfully.");
      setProfile(null);
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  if (!profile) {
    return <p className="text-white text-center text-lg mt-6">Loading profile...</p>;
  }

  return (
    <>
    <Navbar/>
    <div className="mt-[150px] mb-[100px] border border-green-700 rounded-lg shadow-lg p-6 max-w-lg mx-auto bg-green-900 text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">{username}'s Profile</h2>

      {profile.image && !isEditing && (
        <img src={`data:image/jpeg;base64,${profile.image}`} 
          alt="Profile" 
          className="w-40 h-40 rounded-full mx-auto mb-4 border-4 border-green-500 shadow-md" 
        />
      )}

      {isEditing ? (
        <>
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="w-full p-2 border border-gray-400 rounded mb-2 text-white"
            placeholder="Edit Name"
          />
          <input
            type="email"
            value={editedEmail}
            onChange={(e) => setEditedEmail(e.target.value)}
            className="w-full p-2 border border-gray-400 rounded mb-2 text-white"
            placeholder="Edit Email"
          />
          <input
            type="text"
            value={editedCategories}
            onChange={(e) => setEditedCategories(e.target.value)}
            className="w-full p-2 border border-gray-400 rounded mb-2 text-white"
            placeholder="Edit Categories (comma-separated)"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedImage(e.target.files[0])}
            className="mb-2 text-white"
          />
        </>
      ) : (
        <div className="text-center">
          <p className="mb-2"><strong>Name:</strong> {profile.Name}</p>
          <p className="mb-2"><strong>Email:</strong> {profile.Email}</p>
          <p><strong>Categories:</strong> {profile.Categories.join(", ")}</p>
        </div>
      )}

      <div className="flex justify-between mt-4">
        {isEditing ? (
          <>
            <button 
              onClick={handleSaveEdit} 
              className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600 shadow-md"
            >
              Save
            </button>
            <button 
              onClick={handleCancelEdit} 
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 shadow-md"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={handleEdit} 
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-400 shadow-md"
            >
              Edit
            </button>
            <button 
              onClick={handleDelete} 
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 shadow-md"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Profile;
