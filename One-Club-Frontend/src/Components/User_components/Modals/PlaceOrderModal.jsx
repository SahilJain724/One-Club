import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import Title from '../Components/Title';

const PlaceOrderModal = ({ closeModal, cartItems, paymentMethod, navigate }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const orderData = {
      customer: data,
      paymentMethod,
      cartItems,
    };

    try {
      await axios.post('http://localhost:9000/orders', orderData);
      toast.success('Order placed successfully!');
      closeModal();
      navigate('/Order');
    } catch (err) {
      console.error('Order failed', err);
      toast.error('Failed to place order');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <Title text1="DELIVERY" text2="INFORMATION" />
          <button onClick={closeModal} className="text-xl hover:bg-red-500">✖</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {/* Same form inputs as before */}
          <input {...register('firstName', { required: 'First name is required' })} placeholder="First name" className="border px-3.5 py-1.5 rounded" />
          <input {...register('lastName', { required: 'Last name is required' })} placeholder="Last name" className="border px-3.5 py-1.5 rounded" />
          <input {...register('email', { required: 'Email is required' })} placeholder="Email" className="border px-3.5 py-1.5 rounded" />
          <input {...register('street', { required: 'Street is required' })} placeholder="Street" className="border px-3.5 py-1.5 rounded" />
          <div className="flex gap-3">
            <input {...register('city', { required: 'City is required' })} placeholder="City" className="border px-3.5 py-1.5 rounded w-full" />
            <input {...register('state', { required: 'State is required' })} placeholder="State" className="border px-3.5 py-1.5 rounded w-full" />
          </div>
          <div className="flex gap-3">
            <input {...register('zipcode', { required: 'Zipcode is required' })} placeholder="Zipcode" className="border px-3.5 py-1.5 rounded w-full" />
            <input {...register('country', { required: 'Country is required' })} placeholder="Country" className="border px-3.5 py-1.5 rounded w-full" />
          </div>
          <input {...register('phone', { required: 'Phone is required' })} placeholder="Phone" className="border px-3.5 py-1.5 rounded" />

          <button type="submit" className="bg-gradient-to-r from-black to-gray-600 hover:scale-103 duration-200 text-white py-2 px-4 rounded-full">Confirm Order</button>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrderModal;
