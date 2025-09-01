import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ConfirmDeleteModal from '../../Components/Vendor_components/ConfirmDeleteModal'; 

const AllVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('unitsSoldDesc');
  const [deleteVendorId, setDeleteVendorId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view this data.');
        setLoading(false);
        return;
      }
      const res = await axios.get('http://localhost:9000/users/vendors', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVendors(res.data || []);
    } catch (err) {
      console.error('Failed to fetch vendors:', err);
      setError('Could not load vendors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVendor = (vendorId) => {
    setDeleteVendorId(vendorId);
  };

  const confirmDeleteVendor = async () => {
    if (!deleteVendorId) return;
    try {
      setDeleting(true);
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:9000/users/${deleteVendorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVendors(prev => prev.filter(v => v.userDTO.id !== deleteVendorId));
    } catch (err) {
      console.error('Failed to delete vendor:', err);
      alert('Failed to delete vendor. Please try again.');
    } finally {
      setDeleting(false);
      setDeleteVendorId(null);
    }
  };

  const sortedVendors = [...vendors].sort((a, b) => {
    if (sortBy === 'unitsSoldDesc') return (b.unitsSold ?? 0) - (a.unitsSold ?? 0);
    if (sortBy === 'unitsSoldAsc') return (a.unitsSold ?? 0) - (b.unitsSold ?? 0);
    if (sortBy === 'createdAtDesc') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'createdAtAsc') return new Date(a.createdAt) - new Date(b.createdAt);
    return 0;
  });

  if (loading) return <div className="p-4">Loading vendors...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">All Vendors</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="unitsSoldDesc">BestSellers</option>
          <option value="unitsSoldAsc">WorstSellers</option>
          <option value="createdAtDesc">Latest</option>
          <option value="createdAtAsc">Oldest</option>
        </select>
      </div>

      {/* Scrollable Table Container */}
      <div className="h-[500px] overflow-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <table className="min-w-full text-left">
          <thead className="bg-black text-sm text-white sticky top-0">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Units Sold</th>
              <th className="p-2">Created At</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedVendors.length ? (
              sortedVendors.map((vendor, index) => {
                const { userDTO, unitsSold } = vendor;
                const isTopVendor = index === 0 && (unitsSold ?? 0) > 0;
                return (
                  <tr
                    key={userDTO.id}
                    className={`hover:shadow-lg transition-transform hover:scale-[1.01] ${
                      isTopVendor ? 'bg-green-500 text-white' : ''
                    }`}
                  >
                    <td className="p-2">{userDTO.id}</td>
                    <td className="p-2">{userDTO.name}</td>
                    <td className="p-2">{userDTO.email}</td>
                    <td className="p-2">{userDTO.phone}</td>
                    <td className="p-2">{unitsSold ?? 0}</td>
                    <td className="p-2">{new Date(vendor.createdAt).toLocaleDateString()}</td>
                    <td className="p-2 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleDeleteVendor(userDTO.id)}
                          className="border text-xs border-black rounded px-2 py-1 text-white bg-black"
                        >
                          Delete Vendor
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-gray-600 py-6">
                  No vendors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteVendorId && (
        <ConfirmDeleteModal
          onConfirm={confirmDeleteVendor}
          onCancel={() => setDeleteVendorId(null)}
          loading={deleting}
        />
      )}
    </div>
  );
};

export default AllVendors;
