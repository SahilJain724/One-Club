import React, { useEffect, useState } from 'react';
import AdminOrderItem from '../../Components/Admin_components/AdminOrderItem';
import Title from '../../Components/User_components/Utils/Title';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('orderDateDesc'); // default sort

  const fetchAllOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:9000/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleChangeDeliveryStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:9000/orders/${orderId}/delivery-status?status=${newStatus}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, deliveryStatus: newStatus } : order
        )
      );
    } catch (err) {
      console.error('Failed to update delivery status', err);
      alert('Failed to update delivery status. Please try again.');
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (sortBy === 'amountDesc') return b.totalAmount - a.totalAmount;
    if (sortBy === 'amountAsc') return a.totalAmount - b.totalAmount;

    if (sortBy === 'orderDateDesc') return new Date(b.orderDate) - new Date(a.orderDate);
    if (sortBy === 'orderDateAsc') return new Date(a.orderDate) - new Date(b.orderDate);

    if (sortBy === 'deliveryStatusDelivered') {
      return a.deliveryStatus === 'DELIVERED' ? -1 : 1;
    }
    if (sortBy === 'deliveryStatusPending') {
      return a.deliveryStatus !== 'DELIVERED' ? -1 : 1;
    }

    if (sortBy === 'paymentStatusPaid') {
      return a.paymentStatus === 'PAID' ? -1 : 1;
    }
    if (sortBy === 'paymentStatusUnpaid') {
      return a.paymentStatus !== 'PAID' ? -1 : 1;
    }

    return 0;
  });

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <Title text1="ALL ORDERS"/>

      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="orderDateDesc">Newest First</option>
          <option value="orderDateAsc">Oldest First</option>
          <option value="amountDesc">Amount: High → Low</option>
          <option value="amountAsc">Amount: Low → High</option>
          <option value="deliveryStatusDelivered">Delivered First</option>
          <option value="deliveryStatusPending">Pending First</option>
          <option value="paymentStatusPaid">Paid First</option>
          <option value="paymentStatusUnpaid">Unpaid First</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="h-[500px] overflow-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {sortedOrders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            sortedOrders.map(order => (
              <AdminOrderItem
                key={order.id}
                order={order}
                onChangeDeliveryStatus={handleChangeDeliveryStatus}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
