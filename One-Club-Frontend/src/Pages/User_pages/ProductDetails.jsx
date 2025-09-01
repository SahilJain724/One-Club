import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import QuantityCounter from '../../Components/User_components/Utils/QuantityCounter';
import Spinner from '../../Components/User_components/Utils/Spinner';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [cartItemId, setCartItemId] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token'); // read token inside useEffect

    // Load product details
    axios
      .get(`http://localhost:9000/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProduct(res.data))
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          toast.error('Session expired, login again');
          navigate('/login');
        } else {
          toast.error('Failed to load product details');
        }
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token'); // read token inside useEffect

    // Check cart for existing quantity
    axios
      .get('http://localhost:9000/cart', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const cartItem = res.data.find((item) => item.prodId === Number(id));
        if (cartItem) {
          setQuantity(cartItem.quantity);
          setCartItemId(cartItem.id); // store cart item ID
        }
      })
      .catch(() => {});
  }, [id]);

  const handleAddToCart = () => {
    setBtnLoading(true);
    const token = localStorage.getItem('token');

    axios
      .post(
        'http://localhost:9000/cart/add',
        { prodId: product.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setQuantity(1);
        setCartItemId(res.data.id); // assuming API returns cart item ID
        toast.success(`${product.title} added to cart`);
      })
      .catch(() => toast.error('Could not add to cart'))
      .finally(() => setBtnLoading(false));
  };

  const handleBuyNow = () => {
    setBtnLoading(true);
    const token = localStorage.getItem('token');

    const addPromise =
      quantity === 0
        ? axios.post(
            'http://localhost:9000/cart/add',
            { prodId: product.id, quantity: 1 },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        : Promise.resolve();

    addPromise
      .then(() => navigate('/Cart'))
      .catch(() => toast.error('Could not proceed to cart'))
      .finally(() => setBtnLoading(false));
  };

  const handleIncrease = async () => {
    if (!cartItemId) return;
    const token = localStorage.getItem('token');

    try {
      const { data } = await axios.patch(
        `http://localhost:9000/cart/increase/${cartItemId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuantity(data.quantity);
    } catch (err) {
      console.error('Increase quantity error:', err);
      toast.error('Failed to increase quantity');
    }
  };

  const handleDecrease = async () => {
    if (!cartItemId) return;
    const token = localStorage.getItem('token');

    try {
      const { data } = await axios.patch(
        `http://localhost:9000/cart/decrease/${cartItemId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!data || data.quantity === 0) {
        setQuantity(0);
        setCartItemId(null);
        toast.success('Removed from cart');
      } else {
        setQuantity(data.quantity);
      }
    } catch (err) {
      console.error('Decrease quantity error:', err);
      toast.error('Failed to decrease quantity');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );

  if (!product)
    return <p className="text-center text-red-500 mt-10">Product not found</p>;

  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
      <div className="flex justify-center items-center min-h-[400px] bg-gray-50 p-4 rounded">
        <img
          src={imgError ? 'https://via.placeholder.com/300' : product.image}
          alt={product.title}
          onError={() => setImgError(true)}
          className="w-full max-h-[400px] object-contain"
        />
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold">{product.title}</h1>
        <p className="text-sm text-gray-700">{product.description}</p>
        <p className="text-md">
          Category: <span className="font-medium">{product.categoryName}</span>
        </p>
        <p className="text-md">
          Subcategory:{' '}
          <span className="font-medium">{product.subcategoryName}</span>
        </p>
        <p className="text-md">
          Price:{' '}
          <span className="font-semibold text-blue-600"> ₹ {product.price}</span>
        </p>

        <p className="text-lg text-yellow-500">Rating: {product.rating || 3.5} ★</p>

        {product.quantity === 0 ? (
          <p className="text-2xl text-red-700 mt-4">SOLD OUT!</p>
        ) : (
          <div className="mt-4 flex items-center gap-4">
            {quantity > 0 ? (
              <>
                <div className="w-24">
                  <QuantityCounter
                    quantity={quantity}
                    onDecrease={handleDecrease}
                    onIncrease={handleIncrease}
                  />
                </div>
                <button
                  onClick={handleBuyNow}
                  disabled={btnLoading}
                  className="border border-black text-black text-sm px-5 py-1.5 rounded hover:bg-black hover:text-white"
                >
                  {btnLoading ? <Spinner /> : 'Buy Now'}
                </button>
              </>
            ) : btnLoading ? (
              <Spinner />
            ) : (
              <>
                <button
                  onClick={handleAddToCart}
                  disabled={btnLoading}
                  className="bg-black text-white text-sm px-5 py-1.5 rounded hover:bg-gray-800"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={btnLoading}
                  className="border border-black text-black text-sm px-5 py-1.5 rounded hover:bg-black hover:text-white"
                >
                  Buy Now
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
