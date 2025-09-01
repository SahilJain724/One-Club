import React from 'react';

const Pagination = ({ currentPage, totalPages, setCurrentPage, getPageNumbers }) => (
  <div className="flex justify-center mt-6 mb-10 gap-2">
    <button
      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className={`px-3 py-1 border rounded ${currentPage === 1 ? 'text-gray-400 border-gray-300' : 'hover:bg-gray-100'}`}
    >
      Prev
    </button>
    {getPageNumbers().map(page => (
      <button
        key={page}
        onClick={() => setCurrentPage(page)}
        className={`px-3 py-1 border rounded ${page === currentPage ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
      >
        {page}
      </button>
    ))}
    <button
      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'text-gray-400 border-gray-300' : 'hover:bg-gray-100'}`}
    >
      Next
    </button>
  </div>
);

export default Pagination;
