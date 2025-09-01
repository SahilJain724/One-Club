import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiLogOut, FiEdit } from "react-icons/fi";
import Spinner from "../../Components/User_components/Utils/Spinner";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [updating, setUpdating] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch user data on mount
  useEffect(() => {
    if (!token) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:9000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const handleLogout = () => {
     localStorage.removeItem('token');
     localStorage.removeItem('role');
     toast.success('Logged out successfully!');
     navigate('/'); 
   };
 

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    console.log("Updating profile with data:", formData);
    try {
      const res = await axios.patch(
        "http://localhost:9000/users/update",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      setFormData({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
      });
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md relative">
        <div className="flex justify-center m-8">
          <CgProfile className="text-8xl text-black" />
        </div>

        <div className="space-y-3">
          <ProfileField label="Name" value={user?.name || ""} />
          <ProfileField label="Email" value={user?.email || ""} />
          <ProfileField label="Phone" value={user?.phone || "N/A"} />
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => {
              setFormData({
                name: user?.name || "",
                email: user?.email || "",
                phone: user?.phone || "",
              });
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-black to-gray-600 hover:scale-103 duration-200 text-white text-sm py-2 px-4 rounded-full"
          >
            Update Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:scale-103 duration-200 text-white text-sm py-2 px-4 rounded-full"
          >
            Logout
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-2 text-2xl hover:text-red-600"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Update Profile
            </h2>
            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-3">
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="border px-3 py-2 rounded w-full"
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="border px-3 py-2 rounded w-full"
              />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                className="border px-3 py-2 rounded w-full"
              />
              {updating ? (
                <div className="flex justify-center"><Spinner /></div>
              ) : (
                <button
                  type="submit"
                  disabled={updating}
                  className="bg-gradient-to-r from-black to-gray-600 hover:scale-105 duration-200 text-white py-2 px-4 rounded-full mt-2 flex justify-center items-center"
                >
                  Save Changes
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="flex justify-between border-b pb-2">
    <p className="text-gray-500">{label}:</p>
    <p className="text-gray-700 font-medium">{value}</p>
  </div>
);

export default Profile;
