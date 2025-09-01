import { useState, useEffect } from 'react';
import axios from 'axios';
import Title from '../../Components/User_components/Utils/Title';
import Pagination from '../../Components/User_components/Utils/Pagination';
import AdminProductsTable from '../../Components/Admin_components/AdminProductsTable';

const fallbackImage = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...'; // Truncated
const pageSize = 8;
const maxPageTabs = 5;

const subcategoryMap = {
  Clothing: ['topwear', 'bottomwear', 'winterwear', 'summerwear'],
  Electronics: ['tv', 'mobile', 'gaming', 'audio', 'accessories'],
  Jewellery: ['jewellery'],
};

const VendorProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:9000/products/vendor', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data || []);
      } catch (err) {
        console.error('Failed to fetch vendor products:', err);
        setError('Could not load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(item => {
    const p = item.responseDTO;
    return (
      (!selectedCategory || p.categoryName === selectedCategory) &&
      (!selectedSubcategory || p.subcategoryName === selectedSubcategory) &&
      (!minPrice || p.price >= parseFloat(minPrice)) &&
      (!maxPrice || p.price <= parseFloat(maxPrice))
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const pa = a.responseDTO;
    const pb = b.responseDTO;
    switch (sortOrder) {
      case 'price-low-high': return pa.price - pb.price;
      case 'price-high-low': return pb.price - pa.price;
      case 'quantity-high-low': return pb.quantity - pa.quantity;
      case 'quantity-low-high': return pa.quantity - pb.quantity;
      case 'units-sold-high-low': return pb.unitsSold - pa.unitsSold;
      case 'units-sold-low-high': return pa.unitsSold - pb.unitsSold;
      case 'name-az': return pa.title.localeCompare(pb.title);
      case 'name-za': return pb.title.localeCompare(pa.title);
      default: return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / pageSize);
  const indexOfLast = currentPage * pageSize;
  const currentProducts = sortedProducts.slice(indexOfLast - pageSize, indexOfLast);

  const getPageNumbers = () => {
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + maxPageTabs - 1, totalPages);
    if (end - start < maxPageTabs - 1) start = Math.max(end - maxPageTabs + 1, 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="flex flex-col gap-6 max-w-screen-xl mx-auto px-4">
      <Title text1="My Products" />

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
          value={selectedCategory}
          onChange={e => {
            setSelectedCategory(e.target.value);
            setSelectedSubcategory('');
            setCurrentPage(1);
          }}
          className="border rounded px-2 py-1"
        >
          <option value="">All Categories</option>
          {Object.keys(subcategoryMap).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {selectedCategory && (
          <select
            value={selectedSubcategory}
            onChange={e => {
              setSelectedSubcategory(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1"
          >
            <option value="">All Subcategories</option>
            {subcategoryMap[selectedCategory].map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        )}

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={e => { setMinPrice(e.target.value); setCurrentPage(1); }}
          className="border rounded px-2 py-1 min-w-[100px]"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={e => { setMaxPrice(e.target.value); setCurrentPage(1); }}
          className="border rounded px-2 py-1 min-w-[100px]"
        />

        <select
          value={sortOrder}
          onChange={e => { setSortOrder(e.target.value); setCurrentPage(1); }}
          className="border rounded px-2 py-1"
        >
          <option value="">No Sort</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="quantity-high-low">Quantity: High to Low</option>
          <option value="quantity-low-high">Quantity: Low to High</option>
          <option value="units-sold-high-low">Units Sold: High to Low</option>
          <option value="units-sold-low-high">Units Sold: Low to High</option>
          <option value="name-az">Name: A-Z</option>
          <option value="name-za">Name: Z-A</option>
        </select>
      </div>

      {/* Scrollable Products Table */}
      <div className="overflow-y-auto max-h-[500px]">
        <AdminProductsTable currentProducts={currentProducts} fallbackImage={fallbackImage} />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          getPageNumbers={getPageNumbers}
        />
      )}

      {/* Loading and error messages */}
      {loading && (
        <div className="text-center text-lg text-gray-600">Loading products...</div>
      )}
      {error && (
        <div className="text-center text-red-500 text-lg font-semibold mt-4">
          {error}
        </div>
      )}
      {!loading && !error && products.length === 0 && (
        <div className="text-center text-gray-500 text-lg">No products found.</div>
      )}
    </div>
  );
};

export default VendorProducts;
