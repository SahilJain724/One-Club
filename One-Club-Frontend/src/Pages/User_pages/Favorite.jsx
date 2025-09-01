import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Title from '../../Components/User_components/Utils/Title';
import Gridcard from '../../Components/User_components/Cards/Gridcard';

const Favorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 10; // 5 items per row, 2 rows = 10
  const maxPageTabs = 5;

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const { data } = await axios.get('http://localhost:9000/products/fav', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favourites:', error);
      }
    };

    fetchFavorites();
  }, []);

  const totalPages = Math.ceil(favorites.length / productsPerPage);
  const currentFavorites = favorites.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const getPageNumbers = () => {
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + maxPageTabs - 1, totalPages);
    if (end - start < maxPageTabs - 1) start = Math.max(end - maxPageTabs + 1, 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col pt-5 max-w-screen-xl mx-auto">
      <div className="flex justify-between text-base sm:text-2xl mb-4">
        <Title text1="YOUR" text2="FAVORITES" />
      </div>

      {/* Scrollable grid */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 max-h-[600px] overflow-y-auto pr-2">
        {currentFavorites.length > 0 ? (
          currentFavorites.map((product) => (
            <div key={product.id} className="w-full h-full">
              <Gridcard product={product} />
            </div>
          ))
        ) : (
          <p className="text-gray-600 col-span-full text-center">
            No favorite products available.
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded ${currentPage === 1 ? 'text-gray-400 border-gray-300' : 'hover:bg-gray-200'}`}
          >
            Prev
          </button>
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 border rounded ${page === currentPage ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'text-gray-400 border-gray-300' : 'hover:bg-gray-200'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Favorite;
