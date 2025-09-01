import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

// === Constants ===
const IMGBB_API_KEY = 'cd68133847ac183652c7197283ee5f97';

const categories = [
  { id: 1, name: 'Clothing' },
  { id: 2, name: 'Electronics' },
  { id: 3, name: 'Jewellery' }
];

const subcategories = [
  { id: 1, name: 'topwear', categoryId: 1 },
  { id: 2, name: 'bottomwear', categoryId: 1 },
  { id: 3, name: 'winterwear', categoryId: 1 },
  { id: 4, name: 'summerwear', categoryId: 1 },
  { id: 5, name: 'tv', categoryId: 2 },
  { id: 6, name: 'mobile', categoryId: 2 },
  { id: 7, name: 'gaming', categoryId: 2 },
  { id: 8, name: 'audio', categoryId: 2 },
  { id: 9, name: 'accessories', categoryId: 2 },
  { id: 10, name: 'jewellery', categoryId: 3 }
];

const genderOptions = [
  { label: 'Men', value: 'M' },
  { label: 'Women', value: 'F' },
  { label: 'Kids', value: 'K' },
  { label: 'Unisex', value: 'U' }
];

// === Component ===
const AddItems = () => {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  // === Derived data ===
  const selectedCategoryId = watch('category');
  const selectedCategoryName = categories.find(cat => String(cat.id) === selectedCategoryId)?.name;

  // If category selected, filter; else show all subcategories
  const filteredSubcategories = selectedCategoryId
    ? subcategories.filter(sub => String(sub.categoryId) === selectedCategoryId)
    : subcategories;

  // === Handlers ===
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const onSubmit = async (data) => {
    if (!selectedFile) {
      alert('Please upload an image.');
      return;
    }

    try {
      setUploading(true);

      
      const imgFormData = new FormData();
      imgFormData.append('image', selectedFile);
      const imgRes = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, imgFormData);
      const uploadedUrl = imgRes.data?.data?.url;
      if (!uploadedUrl) throw new Error('Image upload failed');

      const payload = {
        title: data.title,
        price: parseFloat(data.price),
        description: data.description,
        image: uploadedUrl,
        rating: parseFloat(data.rating),
        gender: data.gender,
        categoryId: parseInt(data.category, 10),
        subcategoryId: parseInt(data.subcategory, 10),
        quantity: parseInt(data.quantity, 10)
      };

      const token = localStorage.getItem('token');
      await axios.post('http://localhost:9000/products', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Product added successfully!');
      reset();
      removeImage();
    } catch (error) {
      console.error('Error uploading or submitting:', error);
      alert('Something went wrong. Check console for details.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='flex justify-center items-center'>
      <div className='mt-6 sm:mt-10 p-6 w-full max-w-4xl bg-white rounded border border-gray-300 shadow-md'>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          {/* Upload preview */}
          <div>
            <p className='mb-2 font-semibold text-gray-700'>Upload Image</p>
            {!previewUrl ? (
              <label className='w-40 h-40 border border-dashed border-gray-400 flex items-center justify-center cursor-pointer rounded'>
                <input type='file' accept='image/*' onChange={handleFileChange} className='hidden' />
                <span className='text-xs text-gray-500'>Click to upload</span>
              </label>
            ) : (
              <div className='relative mt-2 w-40 h-40'>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className='w-full h-full object-contain p-1 rounded border border-gray-300 bg-white'
                />
                <button
                  type='button'
                  onClick={removeImage}
                  className='absolute top-[-6px] right-[-6px] bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center'
                >
                  ✖
                </button>
              </div>
            )}
          </div>

          {/* Title & Description */}
          <InputField
            label="Product title"
            placeholder="Type here"
            register={register('title', { required: 'Title is required' })}
            error={errors.title}
          />
          <TextareaField
            label="Product description"
            placeholder="Write content here"
            register={register('description', { required: 'Description is required' })}
            error={errors.description}
          />

          {/* Category, Subcategory, Price */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <SelectField
              label="Category"
              options={categories}
              register={register('category', { required: 'Category is required' })}
              error={errors.category}
            />
            <SelectField
              label="Subcategory"
              options={filteredSubcategories}
              register={register('subcategory', { required: 'Subcategory is required' })}
              error={errors.subcategory}
            />
            <InputField
              label="Price"
              type="number"
              step="0.01"
              register={register('price', { required: 'Price is required', min: 0 })}
              error={errors.price}
            />
          </div>

          {/* Quantity, Rating, Gender */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <InputField
              label="Quantity"
              type="number"
              defaultValue={1}
              register={register('quantity', { required: 'Quantity is required', min: 1 })}
              error={errors.quantity}
            />
            <InputField
              label="Rating"
              type="number"
              step="0.1"
              register={register('rating', { required: 'Rating is required', min: 1 })}
              error={errors.rating}
            />
            {selectedCategoryName !== 'Electronics' && selectedCategoryId && (
              <SelectField
                label="Gender"
                options={genderOptions.map(g => ({ id: g.value, name: g.label }))}
                register={register('gender', { required: 'Gender is required' })}
                error={errors.gender}
              />
            )}
          </div>

          <button
            type='submit'
            disabled={uploading}
            className='w-full sm:w-32 py-2 mt-2 bg-black text-white cursor-pointer rounded'
          >
            {uploading ? 'Uploading...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

// === Reusable components ===
const InputField = ({ label, type = 'text', step, defaultValue, register, placeholder, error }) => (
  <div>
    <p>{label}</p>
    <input
      type={type}
      step={step}
      defaultValue={defaultValue}
      {...register}
      className='w-full px-3 py-2 border border-gray-600 rounded'
      placeholder={placeholder}
    />
    {error && <p className='text-red-500 text-xs'>{error.message}</p>}
  </div>
);

const TextareaField = ({ label, placeholder, register, error }) => (
  <div>
    <p>{label}</p>
    <textarea
      {...register}
      className='w-full px-3 py-2 border border-gray-600 rounded'
      placeholder={placeholder}
    />
    {error && <p className='text-red-500 text-xs'>{error.message}</p>}
  </div>
);

const SelectField = ({ label, options, register, error }) => (
  <div>
    <p>{label}</p>
    <select
      {...register}
      defaultValue=""
      className='w-full px-3 py-2 border border-gray-600 rounded'
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map(opt => (
        <option key={opt.id} value={opt.id}>{opt.name}</option>
      ))}
    </select>
    {error && <p className='text-red-500 text-xs'>{error.message}</p>}
  </div>
);

export default AddItems;
