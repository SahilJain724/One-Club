import React, { useState } from 'react';

const AdminOrderItem = ({ order, onChangeDeliveryStatus }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const paymentStatusColor =
    order.paymentStatus === 'PAID'
      ? 'bg-green-600'
      : order.paymentStatus === 'FAILED'
      ? 'bg-red-500'
      : 'bg-orange-500';

  const deliveryStatusColor =
    order.deliveryStatus === 'DELIVERED'
      ? 'bg-green-600'
      : order.deliveryStatus === 'CANCELLED'
      ? 'bg-red-500'
      : 'bg-orange-500';

  const handleConfirmChange = () => {
    if (selectedStatus) {
      onChangeDeliveryStatus(order.id, selectedStatus);
      setShowModal(false);
      setSelectedStatus('');
    }
  };

  return (
    <div className="relative border border-gray-200 rounded-2xl shadow hover:shadow-md transition-shadow bg-white overflow-hidden max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center bg-black text-white px-4 py-3">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">Order #{order.id}</span>
        </div>
        <span className="text-xs">{new Date(order.orderDate).toLocaleString()}</span>
      </div>

      {/* Details */}
      <div className="px-4 py-3 text-sm text-gray-700 space-y-1">
        <div className="flex justify-between items-center">
          <p>
            Total Amount: <span className="font-semibold text-black">₹ {order.totalAmount}</span>
          </p>
          <p className="flex items-center gap-1">
            Payment Status:
            <span className={`px-2 py-0.5 rounded text-xs text-white ${paymentStatusColor}`}>
              {order.paymentStatus}
            </span>
          </p>
        </div>

        <div className="flex justify-between items-center">
          <p>User ID: {order.user.id}</p>
          <p className="flex items-center gap-1">
            Delivery Status:
            <span className={`px-2 py-0.5 rounded text-xs text-white ${deliveryStatusColor}`}>
              {order.deliveryStatus}
            </span>
          </p>
        </div>

        {order.paymentId && <p>Payment ID: {order.paymentId}</p>}
        <p>
          Shipping Address: {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
          {order.shippingAddress.state}
        </p>
      </div>

      {/* Items */}
      <div className="mt-2 px-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Items</h3>
        <div className="border border-gray-300 rounded-lg overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-1 text-left font-semibold">Product</th>
                <th className="px-2 py-1 text-center font-semibold">Qty</th>
                <th className="px-2 py-1 text-center font-semibold">Price</th>
                <th className="px-2 py-1 text-center font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-t border-gray-200">
                  <td className="px-2 py-1 text-black truncate max-w-[120px]">
                    {item.productTitle}
                  </td>
                  <td className="px-2 py-1 text-center text-black">{item.quantity}</td>
                  <td className="px-2 py-1 text-center text-black">₹ {item.price}</td>
                  <td className="px-2 py-1 text-center text-black">
                    ₹ {item.price * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Change delivery status button */}
      <div className="px-4 pb-4">
        <button
          onClick={() => setShowModal(true)}
          className="mt-3 inline-block bg-white text-black border border-black hover:bg-black hover:text-white text-xs font-semibold py-1.5 px-3 rounded transition"
        >
          Change Delivery Status
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow p-5 space-y-3 w-80">
            <p className="text-center text-sm font-semibold mb-2">Select New Delivery Status</p>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="">-- Select Status --</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
            <div className="flex justify-center space-x-3 mt-3">
              <button
                onClick={handleConfirmChange}
                disabled={!selectedStatus}
                className="bg-green-600 text-white text-xs font-semibold py-1 px-3 rounded hover:bg-green-700 disabled:opacity-50"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedStatus('');
                }}
                className="bg-gray-300 text-black text-xs font-semibold py-1 px-3 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderItem;