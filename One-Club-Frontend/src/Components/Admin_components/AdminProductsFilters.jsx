const AdminProductsFilters = ({
    sortOrder, setSortOrder,
    selectedCategory, setSelectedCategory,
    selectedSubcategory, setSelectedSubcategory,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    selectedVendor, setSelectedVendor,
    setCurrentPage,
    subcategoryMap,
    vendors
  }) => (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <select
        value={selectedVendor}
        onChange={e => { setSelectedVendor(e.target.value); setCurrentPage(1); }}
        className="border text-sm rounded px-2 py-1"
      >
        <option value="">All Vendors</option>
        {vendors.map(v => (
          <option key={v.userDTO.id} value={v.userDTO.id}>{v.userDTO.name}</option>
        ))}
      </select>
  
      <select
        value={selectedCategory}
        onChange={e => {
          setSelectedCategory(e.target.value);
          setSelectedSubcategory('');
          setCurrentPage(1);
        }}
        className="border text-sm rounded px-2 py-1"
      >
        <option value="">All Categories</option>
        {Object.keys(subcategoryMap).map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
  
      <select
        value={selectedSubcategory}
        onChange={e => { setSelectedSubcategory(e.target.value); setCurrentPage(1); }}
        disabled={!selectedCategory}
        className="border text-sm rounded px-2 py-1"
      >
        <option value="">All Subcategories</option>
        {selectedCategory && subcategoryMap[selectedCategory].map(sub => (
          <option key={sub} value={sub}>{sub}</option>
        ))}
      </select>
  
      <input
        type="number"
        value={minPrice}
        onChange={e => { setMinPrice(e.target.value); setCurrentPage(1); }}
        placeholder="Min Price"
        className="border text-sm rounded px-2 py-1 w-24"
      />
      <input
        type="number"
        value={maxPrice}
        onChange={e => { setMaxPrice(e.target.value); setCurrentPage(1); }}
        placeholder="Max Price"
        className="border text-sm rounded px-2 py-1 w-24"
      />
  
      <select
        value={sortOrder}
        onChange={e => { setSortOrder(e.target.value); setCurrentPage(1); }}
        className="border text-sm rounded px-2 py-1"
      >
        <option value="">Sort By</option>
        <option value="price-low-high">Price: Low → High</option>
        <option value="price-high-low">Price: High → Low</option>
        <option value="quantity-high-low">Quantity: High → Low</option>
        <option value="quantity-low-high">Quantity: Low → High</option>
        <option value="units-sold-high-low">Bestsellers</option>
        <option value="units-sold-low-high">Unpopular</option>
        <option value="name-az">Name: A → Z</option>
        <option value="name-za">Name: Z → A</option>
      </select>
    </div>
  );
  
  export default AdminProductsFilters;