import React from 'react';

export default function ProductFormFields({
  register,
  errors,
  watch,
  categories,
  subcategories,
  genderOptions,
  selectedCategoryId,
}) {
  const filteredSubcategories = subcategories.filter(
    sc => sc.categoryId === Number(selectedCategoryId)
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Title */}
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          {...register('title', { required: 'Title is required' })}
          className="border p-2 w-full rounded"
          placeholder="Product title"
        />
        {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
      </div>

      {/* Price */}
      <div>
        <label className="block mb-1 font-medium">Price</label>
        <input
          type="number"
          step="0.01"
          {...register('price', { required: 'Price is required' })}
          className="border p-2 w-full rounded"
          placeholder="e.g., 299.99"
        />
        {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          className="border p-2 w-full rounded"
          placeholder="Product description"
        />
        {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
      </div>

      {/* Rating */}
      <div>
        <label className="block mb-1 font-medium">Rating</label>
        <input
          type="number"
          step="0.1"
          {...register('rating', { required: 'Rating is required' })}
          className="border p-2 w-full rounded"
          placeholder="e.g., 4.5"
        />
        {errors.rating && <p className="text-red-500 text-xs">{errors.rating.message}</p>}
      </div>

      {/* Quantity */}
      <div>
        <label className="block mb-1 font-medium">Quantity</label>
        <input
          type="number"
          {...register('quantity', { required: 'Quantity is required' })}
          className="border p-2 w-full rounded"
        />
        {errors.quantity && <p className="text-red-500 text-xs">{errors.quantity.message}</p>}
      </div>

      {/* Gender */}
      <div>
        <label className="block mb-1 font-medium">Gender</label>
        <select
          {...register('gender', { required: 'Gender is required' })}
          className="border p-2 w-full rounded"
        >
          <option value="">Select</option>
          {genderOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        {errors.gender && <p className="text-red-500 text-xs">{errors.gender.message}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block mb-1 font-medium">Category</label>
        <select
          {...register('category', { required: 'Category is required' })}
          className="border p-2 w-full rounded"
        >
          <option value="">Select</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
      </div>

      {/* Subcategory */}
      <div>
        <label className="block mb-1 font-medium">Subcategory</label>
        <select
          {...register('subcategory', { required: 'Subcategory is required' })}
          className="border p-2 w-full rounded"
        >
          <option value="">Select</option>
          {filteredSubcategories.map(sub => (
            <option key={sub.id} value={sub.id}>{sub.name}</option>
          ))}
        </select>
        {errors.subcategory && <p className="text-red-500 text-xs">{errors.subcategory.message}</p>}
      </div>
    </div>
  );
}