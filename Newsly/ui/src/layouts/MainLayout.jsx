
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import NewsFeed from "../pages/NewsFeed";
import { ToastContainer } from "react-toastify";


const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen justify-between">
     
   
      <div className="flex-grow">
        <Outlet />
        
        <NewsFeed /> 
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default MainLayout;

