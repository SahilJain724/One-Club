import { createContext, useState, useEffect } from 'react';
import { toast } from "react-toastify";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to cleanup expired token
  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("expiry");
    setIsLoggedIn(false);
    toast.info("Session expired, please log in again.");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("expiry");

    if (token && expiry) {
      const exp = parseInt(expiry, 10);

      if (Date.now() >= exp) {
        // Token already expired
        clearAuth();
      } else {
        setIsLoggedIn(true);

        // Schedule cleanup 10s before expiry
        const timeout = exp - Date.now() - 10000;
        const timer = setTimeout(() => {
          clearAuth();
        }, timeout > 0 ? timeout : 0);

        return () => clearTimeout(timer);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
