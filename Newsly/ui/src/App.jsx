import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

// Pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NewsFeed from "./pages/NewsFeed";
import Profile from "./components/Profile";
import AddNews from "./pages/Addnews";
import Customnewsgrid from "./components/Customnewsgrid"
import SearchNews from "./components/SearchNews"
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
       
        
          <Route path="/" element={< AuthLayout/>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />} />
          <Route path="/homepage" element={<MainLayout />} />
          <Route path="/home" element={<NewsFeed />} />
          <Route path="/addnews" element={<AddNews />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/CustomNews" element={< Customnewsgrid/>} />
          <Route path="/search" element={<SearchNews />} />

       
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;