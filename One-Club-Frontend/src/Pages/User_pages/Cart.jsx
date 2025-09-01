import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import CartTotal from "../../Components/User_components/Cart_components/CartTotal";
import CartItemList from "../../Components/User_components/Cart_components/CartItemList";
import Spinner from "../../Components/User_components/Utils/Spinner";
import emptyCart from "../../assets/empty-cart.svg";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();

  const getToken = useCallback(() => localStorage.getItem("token"), []);

  const fetchProductDetails = async (items, token) => {
    try {
      const requests = items.map(item =>
        axios.get(`http://localhost:9000/products/${item.prodId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );
      const responses = await Promise.all(requests);

      return items.map((item, idx) => ({
        ...item,
        title: responses[idx]?.data?.title || "Unknown Product",
        image: responses[idx]?.data?.image || "",
      }));
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast.error("Failed to load product details");
      return items;
    }
  };

  const fetchCart = useCallback(async () => {
    const token = getToken();
    if (!token) {
      toast.error("Please login to view cart");
      setLoading(false);
      return;
    }

    try {
      const { data: items = [] } = await axios.get("http://localhost:9000/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const enrichedItems = await fetchProductDetails(items, token);
      setCartItems(enrichedItems);
    } catch (error) {
      console.error("Fetch cart error:", error);
      toast.error("Could not load cart");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    document.body.style.overflow = checkoutLoading ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [checkoutLoading]);

  const updateQuantity = async (cartItemId, action) => {
    try {
      const token = getToken();
      const res = await axios.patch(
        `http://localhost:9000/cart/${action}/${cartItemId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems(prev =>
        res.data
          ? prev.map(item =>
            item.id === cartItemId
              ? { ...item, quantity: res.data.quantity }
              : item
          )
          : prev.filter(item => item.id !== cartItemId)
      );
    } catch (error) {
      console.error(`${action} quantity error:`, error);
      toast.error(`Failed to ${action} quantity`);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      const token = getToken();
      await axios.delete(`http://localhost:9000/cart/remove/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Remove item error:", error);
      toast.error("Failed to remove item");
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    setCheckoutLoading(true);
    setTimeout(() => {
      document.body.style.overflow = "auto";
      navigate("/place-order", {
        state: { cartItems, paymentMethod: "razorpay" },
      });
    }, 1000);
  };

  return (
    <div className=" relative min-h-[300px] px-20">
      {/* Checkout loader */}
      {checkoutLoading && (
        <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-40 flex justify-center items-center z-50">
          <div className="flex flex-col items-center">
            <Spinner />
            <p className="text-black text-lg font-semibold mt-4">
              Redirecting to checkout...
            </p>
          </div>
        </div>
      )}

      {/* Cart content */}
      {loading ? (
        <div className="w-full flex justify-center items-center min-h-[300px]">
          <div className="flex flex-col items-center">
            <Spinner />
            <p className="text-gray-700 text-lg font-semibold mt-4">
              Loading your cart...
            </p>
          </div>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="text-center my-10">
          <img src={emptyCart} alt="Empty Cart" className="mx-auto mb-4 w-120" />
          <p className="text-lg font-medium text-gray-700">OOPS! your cart is empty right now.</p>
          <p className="text-lg font-medium text-blue-600">Let's go for shopping!</p>
        </div>

      ) : (
        <div className="flex justify-between items-start my-10 w-full px-4">
          <CartItemList
            cartItems={cartItems}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
          />
          <div className="w-full max-w-[450px]">
            <CartTotal totalAmount={totalAmount} />
            <div className="w-full text-end">
             
              <button
                onClick={handleCheckout}
                className="bg-gradient-to-r from-black to-gray-600 hover:scale-103 duration-200 text-white py-2 px-4 rounded-full"
                  disabled={checkoutLoading}
             >
               {checkoutLoading ? "Processing..." : "Checkout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
