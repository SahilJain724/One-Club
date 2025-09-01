import { useEffect } from "react";
import Navbar from "./Components/User_components/Home_components/Navbar";
import Home from "./Pages/User_pages/Home";
import Collections from "./Pages/User_pages/Collections";
import Contact from "./Pages/User_pages/Contact";
import ProductDetails from "./Pages/User_pages/ProductDetails";
import Login from "./Pages/User_pages/Login";
import Cart from "./Pages/User_pages/Cart";
import Footer from "./Components/User_components/Home_components/Footer";
import Admin from "./Pages/Admin_pages/Admin";
import Favorite from "./Pages/User_pages/Favorite";
import PlaceOrder from "./Pages/User_pages/PlaceOrder";
import Profile from "./Pages/User_pages/Profile";
import OrderHistory from "./Pages/User_pages/OrderHistory";
import AdminOrders from "./Pages/Admin_pages/AdminOrders";
import Vendor from "./Pages/Vendor_pages/Vendor";
import EditItem from "./Pages/Vendor_pages/EditItem";
import Aos from "aos";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const location = useLocation();
  const isAdminPage = location.pathname === "/Admin";
  const isHome = location.pathname === "/";
  const isLogin = location.pathname === "/login";
  const isVendor = location.pathname === "/Vendor";
 
  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="">
      {/* Hidden ToastContainer to process toasts */}
      <ToastContainer style={{ display: 'none' }} />
      {!isAdminPage && !isVendor && <Navbar />}
     

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Favorite" element={<Favorite />} />
        <Route path="/Collections" element={<Collections />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Product/:id" element={<ProductDetails />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/OrderHistory" element={<OrderHistory />} />
        <Route path="/Vendor" element={<Vendor />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<AdminOrders />} />
        <Route path="/editItem/:id" element={<EditItem />} />
      </Routes>

     {(isLogin||isHome) && (
  <Footer />
)}

    </div>
  );
};

export default App;