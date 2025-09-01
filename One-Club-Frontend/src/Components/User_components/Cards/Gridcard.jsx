import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import QuantityCounter from '../Utils/QuantityCounter.jsx';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Utils/Spinner';

const Gridcard = ({ product, isInitiallyFavorite = false, onRemove }) => {
  const [isFavorite, setIsFavorite] = useState(isInitiallyFavorite);
  const [count, setCount] = useState(0);
  const [cartItemId, setCartItemId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const rating = product.rating || 3.5;
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!isInitiallyFavorite) {
      const fetchFavIds = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;
          const { data } = await axios.get('http://localhost:9000/products/fav/ids', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsFavorite(data.includes(product.id));
        } catch (err) {
          console.error('Fetch fav ids error:', err);
        }
      };
      fetchFavIds();
    }
  }, [product.id, isInitiallyFavorite]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const { data } = await axios.get('http://localhost:9000/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const item = data.find(i => i.prodId === product.id);
        if (item) {
          setCount(item.quantity);
          setCartItemId(item.id);
        } else {
          setCount(0);
          setCartItemId(null);
        }
      } catch (err) {
        console.error('Fetch cart error:', err);
        toast.error('Could not load cart data');
      }
    };
    if (role === 'ROLE_USER') {
      fetchCart();
    }
  }, [product.id, role]);


  const toggleFavorite = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await axios.put(`http://localhost:9000/products/fav/${product.id}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updated = !isFavorite;
      setIsFavorite(updated);
      toast.success(updated ? 'Added to favorites' : 'Removed from favorites');
      if (!updated && onRemove) onRemove(product.id);
    } catch (err) {
      console.error('Toggle favorite error:', err);
      toast.error('Failed to update favorites');
    }
  };

  const addToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const { data } = await axios.post('http://localhost:9000/cart/add', {
        prodId: product.id,
        quantity: 1
      }, { headers: { Authorization: `Bearer ${token}` } });
      setCount(1);
      setCartItemId(data.id);
      toast.success('Added to cart');
    } catch (err) {
      console.error('Add to cart error:', err);
      toast.error('Failed to add to cart');
    }
  };

  const increaseQuantity = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const { data } = await axios.patch(`http://localhost:9000/cart/increase/${cartItemId}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCount(data.quantity);
    } catch (err) {
      console.error('Increase quantity error:', err);
      toast.error('Failed to increase quantity');
    }
  };

  const decreaseQuantity = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const { data } = await axios.patch(
        `http://localhost:9000/cart/decrease/${cartItemId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!data) {
        // Item completely removed from backend
        setCount(0);
        setCartItemId(null);
        toast.success('Removed from cart');
      } else {
        setCount(data.quantity);

        if (data.quantity === 0) {
          // Item reduced to 0, removed from cart
          setCartItemId(null);
          toast.success('Removed from cart');
        }
      }
    } catch (err) {
      console.error('Decrease quantity error:', err);
      toast.error('Failed to decrease quantity');
    }
  };


  const handleBuyNow = async () => {
    try {
      if (count === 0) {
        await axios.post(
          'http://localhost:9000/cart/add',
          { prodId: product.id, quantity: 1 },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
      }
      navigate('/Cart');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert('Could not add to cart. Please try again.');
    }
  };

  return (
    <div
      className="bg-white rounded overflow-hidden shadow hover:-translate-y-1 hover:shadow-md transition cursor-pointer m-2"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image */}
      <div className="relative pt-[100%]">
        {/* SOLD OUT Overlay */}
        {product.quantity === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-lg font-bold z-20">
            SOLD OUT!
          </div>
        )}

        {/* Loading Spinner */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <Spinner />
          </div>
        )}

        {/* Product Image */}
        {!hasError ? (
          <img
            src={product.image}
            alt={product.title || 'Product'}
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              setIsLoaded(true);
              setHasError(true);
            }}
            className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-400 text-xs bg-gray-100">
            Failed to load image
          </div>
        )}

        {/* Favorite Icon */}
        {role === "ROLE_USER" && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite();
            }}
            className={`absolute top-2 right-2 bg-white w-6 h-6 rounded-full flex items-center justify-center cursor-pointer z-30 ${isFavorite ? 'text-pink-600' : 'text-gray-600'
              }`}
          >
            {isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
          </div>
        )}
      </div>


      {/* Details */}
      <div className="p-3">
        <div className="text-sm text-black mb-2 truncate">{product.title}</div>
        <div className="flex items-center gap-1 mb-2">
          <span className="text-sm font-semibold text-green-800">₹{product.price}</span>
          {product.originalPrice && <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>}
          {product.discount && <span className="text-xs text-orange-500 font-semibold">{product.discount}% OFF</span>}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
          {[...Array(5)].map((_, i) => (
            <span key={`star-${i}`} className={`${i + 1 <= Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
          ))}
          <span>({rating})</span>
        </div>

        {/* Cart & Buy Now buttons */}
        {role === "ROLE_USER" && product.quantity > 0 ? (
          count === 0 ? (
            <div className="flex gap-2 mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart();
                }}
                className="flex-1 bg-black text-white text-xs rounded px-2 py-1"
              >
                Add to Cart
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleBuyNow();
                }}
                className="flex-1 border border-black text-black text-xs rounded px-2 py-1"
              >
                Buy Now
              </button>
            </div>
          ) : (
            <div className="flex gap-2 mt-2">
              <div onClick={(e) => e.stopPropagation()}>
                <QuantityCounter
                  quantity={count}
                  onDecrease={decreaseQuantity}
                  onIncrease={increaseQuantity}
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleBuyNow();
                }}
                className="flex-1 border border-black text-black text-xs rounded px-2 py-1"
              >
                Buy Now
              </button>
            </div>
          )) : <></>


        }


      </div>

    </div>
  );
};

export default Gridcard;
