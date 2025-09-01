import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ConfirmDeleteModal from '../Vendor_components/ConfirmDeleteModal';
import Spinner from '../User_components/Utils/Spinner'; // Import your spinner component

const AdminProductsTable = ({ currentProducts, fallbackImage }) => {
  const navigate = useNavigate();
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});

  const handleEdit = (product) => {
    navigate(`/editItem/${product.id}`, { state: { product } });
  };

  const handleDelete = (id) => {
    setDeleteProductId(id);
  };

  const confirmDelete = async () => {
    if (!deleteProductId) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found');
        return;
      }

      await axios.delete(`http://localhost:9000/products/${deleteProductId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      window.location.reload();
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeleting(false);
      setDeleteProductId(null);
    }
  };

  return (
    <div>
      <table className="min-w-full text-left">
        <thead className="bg-black text-sm text-white">
          <tr>
            <th className="p-2">Image</th>
            <th className="p-2">Name</th>
            <th className="p-2">Category</th>
            <th className="p-2">Subcategory</th>
            <th className="p-2">Price</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Units Sold</th>
            <th className="p-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
  {currentProducts.length ? (
    currentProducts.map((item) => {
      const { responseDTO} = item;
      const isLowStock = responseDTO.quantity < 10;
      const isImageLoaded = loadedImages[responseDTO.id];

      return (
        <tr
          key={responseDTO.id}
          className={`hover:shadow-lg transition-transform hover:scale-[1.01] ${
            isLowStock ? 'bg-red-500 text-white' : ''
          }`}
        >
          <td className="p-2 w-12 h-12">
            {!isImageLoaded ? <Spinner /> : null}
            <img
              src={responseDTO.image || fallbackImage}
              onLoad={() =>
                setLoadedImages((prev) => ({ ...prev, [responseDTO.id]: true }))
              }
              onError={(e) => {
                e.target.src = fallbackImage;
                setLoadedImages((prev) => ({ ...prev, [responseDTO.id]: true }));
              }}
              alt={responseDTO.title}
              className={`w-12 h-12 object-contain ${!isImageLoaded ? 'hidden' : ''}`}
            />
          </td>
          <td className="p-2 max-w-[150px] truncate">{responseDTO.title}</td>
          <td className="p-2">{responseDTO.categoryName}</td>
          <td className="p-2 capitalize">{responseDTO.subcategoryName}</td>
          <td className="p-2">₹{responseDTO.price}</td>
          <td className="p-2">{responseDTO.quantity}</td>
          <td className="p-2">{responseDTO.unitsSold ?? 0}</td>
          <td className="p-2 text-center">
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => handleEdit(responseDTO)}
                className={`border text-xs rounded px-2 py-1 ${
                  isLowStock ? 'border-white text-white' : 'border-black text-black'
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(responseDTO.id)}
                className={`text-xs rounded px-3 py-1 ${
                  isLowStock ? 'bg-white text-red-500' : 'bg-black text-white'
                }`}
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="8" className="text-center text-gray-600 py-6">
        No products available.
      </td>
    </tr>
  )}
</tbody>

      </table>

      {deleteProductId && (
        <ConfirmDeleteModal
          onConfirm={confirmDelete}
          onCancel={() => setDeleteProductId(null)}
          loading={deleting}
        />
      )}
    </div>
  );
};

export default AdminProductsTable;
