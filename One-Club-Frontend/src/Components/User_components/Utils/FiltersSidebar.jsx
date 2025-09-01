import React, { useState } from 'react';
import Title from './Title';

const FiltersSidebar = ({
  showFilter, setShowFilter, Dropdown,
  selectedCategory, handleCategoryChange,
  selectedSubcategory, handleSubcategoryChange,
  minPrice, maxPrice, handleMinPriceChange, handleMaxPriceChange,
  sortOrder, handleSortChange, subcategoryMap
}) => {

  const [isSortOpen, setIsSortOpen] = useState(false);

  const handleMinPriceInput = (e) => {
    const value = e.target.value;
    if (value === '') {
      handleMinPriceChange('');
    } else {
      const num = parseInt(value, 10);
      if (!isNaN(num)) {
        handleMinPriceChange(num);
      }
    }
  };

  const handleMaxPriceInput = (e) => {
    const value = e.target.value;
    if (value === '') {
      handleMaxPriceChange('');
    } else {
      const num = parseInt(value, 10);
      if (!isNaN(num)) {
        handleMaxPriceChange(num);
      }
    }
  };

  const handleSortFocus = () => setIsSortOpen(true);
  const handleSortBlur = () => setIsSortOpen(false);

  return (
    <>
      <div className="flex justify-between items-center mt-5 my-auto">
        <Title text1="FILTERS" />
      </div>

      <button
        onClick={() => setShowFilter(!showFilter)}
        className="flex items-center gap-2 text-lg font-semibold mb-4 sm:hidden"
      >
        FILTERS
        <img src={Dropdown} alt="Toggle" className={`h-3 transform ${showFilter ? 'rotate-90' : ''}`} />
      </button>

      <div className={`${showFilter ? '' : 'hidden'} sm:block space-y-4`}>

        {/* Categories */}
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <p className="mb-2 text-sm font-medium">CATEGORIES</p>
          {['Clothing', 'Electronics', 'Jewellery'].map(cat => (
            <label key={cat} className="flex items-center gap-2 mb-2 text-sm text-gray-700">
              <input
                type="checkbox"
                value={cat}
                checked={selectedCategory === cat}
                onChange={() => handleCategoryChange(cat)}
                className="w-3 h-3"
              />
              {cat}
            </label>
          ))}
        </div>

        {/* Subcategories */}
        {selectedCategory && (
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <p className="mb-2 text-sm font-medium">SUBCATEGORIES</p>
            {subcategoryMap[selectedCategory]?.map(sub => (
              <label key={sub} className="flex items-center gap-2 mb-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  value={sub}
                  checked={selectedSubcategory === sub}
                  onChange={() => handleSubcategoryChange(sub)}
                  className="w-3 h-3"
                />
                {sub.charAt(0).toUpperCase() + sub.slice(1)}
              </label>
            ))}
          </div>
        )}

        {/* Price range */}
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <p className="mb-2 text-sm font-medium">PRICE RANGE</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              min="0"
              value={minPrice}
              onChange={handleMinPriceInput}
              className="w-16 border rounded px-1 py-0.5 text-xs"
            />
            <span className="text-xs text-gray-500">-</span>
            <input
              type="number"
              placeholder="Max"
              min="0"
              value={maxPrice}
              onChange={handleMaxPriceInput}
              className="w-16 border rounded px-1 py-0.5 text-xs"
            />
          </div>
        </div>

        {/* Sort By */}
        <div className={`border rounded-lg px-4 pt-4 pb-2 bg-white shadow-sm transition-all duration-300 ease-in-out ${isSortOpen ? 'pb-6' : 'pb-2'}`}>
          <p className="mb-2 text-sm font-medium">SORT BY</p>
          <select
            value={sortOrder}
            onChange={e => handleSortChange(e.target.value)}
            onFocus={handleSortFocus}
            onBlur={handleSortBlur}
            className="border px-2 py-1 text-sm rounded w-full outline-none"
          >
            <option value="relevant">Relevance</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>

      </div>
    </>
  );
};

export default FiltersSidebar;