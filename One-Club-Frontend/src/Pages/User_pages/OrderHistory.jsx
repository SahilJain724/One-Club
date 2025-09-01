import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Title from '../../Components/User_components/Utils/Title';
import OrderItem from '../../Components/User_components/Cards/OrderItem';
import Spinner from '../../Components/User_components/Utils/Spinner';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc"); // default newest first
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:9000/orders/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  // Sort orders based on createdAt using Date.parse
  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = Date.parse(a.createdAt);
    const dateB = Date.parse(b.createdAt);
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 pt-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center text-2xl font-bold text-gray-800 mb-6">
        <Title text={''} text2="ORDER'S HISTORY" />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      <div className="grid gap-6 max-h-[500px] overflow-y-auto pr-2">
        {sortedOrders.length === 0 ? (
          <p className="text-gray-500 text-center">You have no orders yet.</p>
        ) : (
          sortedOrders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
