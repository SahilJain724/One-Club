import { useState, useContext } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../Contexts/LoginContext";
import Spinner from "../../Components/User_components/Utils/Spinner";
import {jwtDecode} from "jwt-decode"; 

const variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: "easeIn" } },
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [registerAsVendor, setRegisterAsVendor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setIsLoggedIn } = useContext(LoginContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmitHandler = async (data) => {
    setLoading(true);

    const email = data.email?.trim().toLowerCase() || "";
    data.email = email;

    if (!isLogin) {
      if (registerAsVendor) {
        data.role = "VENDOR";
      } else {
        data.role = email.endsWith("@oneclub.com") ? "ADMIN" : "USER";
      }
    }

    // Determine endpoint
    const endpoint = isLogin
      ? "http://localhost:9000/auth/login"
      : registerAsVendor
        ? "http://localhost:9000/auth/register/vendor"
        : "http://localhost:9000/auth/register";

    try {
      const response = await axios.post(endpoint, data);

      if (isLogin) {
        const { token, role } = response.data;

        // ✅ Decode JWT to get expiry
        const decoded = jwtDecode(token);
        const expiry = decoded.exp * 1000; // ms

        // ✅ Save token, role, and expiry
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("expiry", expiry);

        // ✅ Schedule auto-cleanup 5s before expiry
        const timeout = expiry - Date.now() - 5000;
        if (timeout > 0) {
          setTimeout(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("expiry");
            setIsLoggedIn(false);
            toast.info("Session expired, please log in again.");
            navigate("/login");
          }, timeout);
        }

        toast.success("Login Successful!");
        setIsLoggedIn(true);
        navigate("/");
      } else {
        toast.success("Registered successfully! Please login.");
        setIsLogin(true);
      }

      reset();
      setRegisterAsVendor(false);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Something went wrong";
      toast.error(errMsg);
      console.error("❌ Error:", errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-10 mb-25">
      <img src="oneclub.jpg" alt="OneClub" className="w-[200px]" />
      <div className="w-full flex justify-center items-start min-h-[300px]">
        <AnimatePresence mode="wait" initial={false}>
          {loading ? (
            <motion.div
              key="loading"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center justify-center bg-white p-6 rounded-xl shadow-xl w-[90%] sm:max-w-96 min-h-[300px]"
            >
              <Spinner />
              <p className="text-black text-lg font-semibold mt-4">Please wait...</p>
            </motion.div>
          ) : (
            <motion.form
              key={isLogin ? "Login" : "Register"}
              onSubmit={handleSubmit(onSubmitHandler)}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-[90%] sm:max-w-96 flex flex-col items-center gap-4 text-gray-800 bg-white p-6 rounded-xl shadow-xl"
            >
              <div className="inline-flex items-center gap-2 mb-2">
                <p className="text-3xl font-semibold">
                  {isLogin ? "Login" : registerAsVendor ? "Register Vendor" : "Register User"}
                </p>
                <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
              </div>

              {!isLogin && (
                <>
                  <input
                    type="text"
                    placeholder="Name"
                    {...register("name", {
                      required: "Name is required",
                      pattern: {
                        value: /^[A-Za-z ]+$/,
                        message: "Name must not contain special characters",
                      },
                    })}
                    className="w-full px-3 py-2 border border-gray-800 rounded"
                  />
                  {errors.name && <p className="text-red-500 text-sm -mt-2">{errors.name.message}</p>}

                  {registerAsVendor && (
                    <>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        {...register("phone", {
                          required: "Phone number is required",
                          pattern: {
                            value: /^[0-9]{10,15}$/,
                            message: "Invalid phone number",
                          },
                        })}
                        className="w-full px-3 py-2 border border-gray-800 rounded"
                      />
                      {errors.phone && <p className="text-red-500 text-sm -mt-2">{errors.phone.message}</p>}
                    </>
                  )}
                </>
              )}

              <input
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                className="w-full px-3 py-2 border border-gray-800 rounded"
              />
              {errors.email && <p className="text-red-500 text-sm -mt-2">{errors.email.message}</p>}

              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()[\]{}|\\/:;<>,.~`_+=-]).{5,}$/,
                      message:
                        "Password must include upper, lower, number, special char, and 5+ chars",
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-800 rounded pr-10"
                />
                <span
                  className="absolute right-3 top-2.5 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  title="Toggle Password"
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
              {errors.password && <p className="text-red-500 text-sm -mt-2">{errors.password.message}</p>}

              <div className="w-full flex justify-between text-sm -mt-1">
                <p>{isLogin ? "Forgot your password?" : "Already have an account?"}</p>
                <p
                  onClick={() => {
                    setIsLogin((prev) => !prev);
                    setRegisterAsVendor(false);
                  }}
                  className="cursor-pointer underline"
                >
                  {isLogin ? "Create Account" : "Login Here"}
                </p>
              </div>

              <div
                className={`flex gap-4 ${
                  !isLogin ? "justify-between" : "justify-center"
                }`}
              >
                {!isLogin && (
                  <button
                    type="button"
                    onClick={() => setRegisterAsVendor((prev) => !prev)}
                    className="w-32 px-4 py-2 rounded text-sm bg-white text-black border border-black hover:bg-black hover:text-white transition"
                  >
                    {registerAsVendor ? "As User" : "As Vendor"}
                  </button>
                )}

                <button
                  type="submit"
                  className="w-32 px-4 py-2 rounded text-sm bg-black text-white"
                >
                  {isLogin ? "Sign In" : "Sign Up"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Login;
