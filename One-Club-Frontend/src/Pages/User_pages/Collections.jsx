import { useState, useEffect, useContext, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Dropdown from '../../assets/dropdown.png';
import Gridcard from '../../Components/User_components/Cards/Gridcard';
import FiltersSidebar from '../../Components/User_components/Utils/FiltersSidebar';
import Pagination from '../../Components/User_components/Utils/Pagination';
import { searchContext } from '../../Contexts/SearchContext';
import Spinner from '../../Components/User_components/Utils/Spinner'; // <-- import spinner

const subcategoryMap = {
  Clothing: ['topwear', 'bottomwear', 'winterwear', 'summerwear'],
  Electronics: ['tv', 'mobile', 'gaming', 'audio', 'accessories'],
  Jewellery: ['jewellery']
};

const productsPerPage = 12;
const maxPageTabs = 5;

const Collections = () => {
  const { searchText } = useContext(searchContext);
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState('relevant');
  const [currentPage, setCurrentPage] = useState(1);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(false); // <-- loading state

  // Extract initial category from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) setSelectedCategory(category);
  }, [location.search]);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // start loading
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:9000/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(data || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load products');
      } finally {
        setLoading(false); // stop loading
      }
    };
    fetchProducts();
  }, []);

  // Apply all filters
  useEffect(() => {
    let temp = [...products];

    if (searchText) {
      const search = searchText.toLowerCase();
      temp = temp.filter(p =>
        (p?.title?.toLowerCase() || '').includes(search) ||
        (p?.description?.toLowerCase() || '').includes(search)
      );
    }

    if (selectedCategory) {
      temp = temp.filter(p => p.categoryName === selectedCategory);
    }

    if (selectedSubcategory) {
      temp = temp.filter(p => p.subcategoryName === selectedSubcategory);
    }

    if (minPrice) {
      temp = temp.filter(p => p.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      temp = temp.filter(p => p.price <= parseFloat(maxPrice));
    }

    if (sortOrder === 'low-high') {
      temp.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high-low') {
      temp.sort((a, b) => b.price - a.price);
    }

    // Reverse the filtered list before rendering
    temp.reverse();

    setFilteredProducts(temp);
    setCurrentPage(1);
  }, [products, searchText, selectedCategory, selectedSubcategory, minPrice, maxPrice, sortOrder]);

  const toggleFavorite = useCallback((id) => {
    setFavoriteIds(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  }, []);

  const handleCategoryChange = (value) => {
    setSelectedCategory(prev => (prev === value ? '' : value));
    setSelectedSubcategory('');
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLast = currentPage * productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfLast - productsPerPage, indexOfLast);

  const getPageNumbers = () => {
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + maxPageTabs - 1, totalPages);
    if (end - start < maxPageTabs - 1) start = Math.max(end - maxPageTabs + 1, 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6 max-w-screen-xl mx-auto h-screen">
      {/* Sidebar */}
      <aside className="w-64 pr-4 max-h-[550px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        <FiltersSidebar
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          Dropdown={Dropdown}
          selectedCategory={selectedCategory}
          handleCategoryChange={handleCategoryChange}
          selectedSubcategory={selectedSubcategory}
          handleSubcategoryChange={setSelectedSubcategory}
          minPrice={minPrice}
          maxPrice={maxPrice}
          handleMinPriceChange={setMinPrice}
          handleMaxPriceChange={setMaxPrice}
          sortOrder={sortOrder}
          handleSortChange={setSortOrder}
          subcategoryMap={subcategoryMap}
        />
      </aside>

      {/* Main scrollable content */}
      <main className="flex-1 overflow-y-auto">
  {loading ? (
    <div className="flex justify-center items-center h-64">
      <Spinner />
    </div>
  ) : (
    <>
      {searchText && (
        <div className="mb-4 text-gray-600">
          Showing results for: <span className="font-semibold">"{searchText}"</span>
          {filteredProducts.length !== products.length && (
            <span> ({filteredProducts.length} of {products.length} products)</span>
          )}
        </div>
      )}

      {currentProducts.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentProducts.map(product => (
            <li key={product.id}>
              <Gridcard
                product={product}
                isInitiallyFavorite={favoriteIds.includes(product.id)}
                onRemove={() => toggleFavorite(product.id)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex justify-center items-center h-[60vh] w-full">
          <p className="text-gray-600 text-lg">
            {searchText ? 'No products match your search.' : 'No products available.'}
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          getPageNumbers={getPageNumbers}
        />
      )}
    </>
  )}
</main>

    </div>


  );
};

export default Collections;
