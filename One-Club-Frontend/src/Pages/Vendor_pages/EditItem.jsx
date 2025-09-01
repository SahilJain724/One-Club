import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Title from '../../Components/User_components/Utils/Title';

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

const fallbackImage = 'https://i.ibb.co/YTZn5gQL/p-img8.png';

export default function EditItem({ product: propProduct }) {
  const navigate = useNavigate();
  const location = useLocation();
  const product = propProduct || location.state?.product;

  const {
    register, handleSubmit, watch, reset, formState: { errors }
  } = useForm({
    defaultValues: {
      title: '', price: '', description: '', image: '',
      rating: '', gender: '', category: '', subcategory: '', quantity: ''
    }
  });

  const [changingPhoto, setChangingPhoto] = useState(false);
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState('');

  const fileInputRef = useRef(null); // to reset file input

  const selectedCategoryId = watch('category');
  const selectedCategoryName = categories.find(c => String(c.id) === selectedCategoryId)?.name;

  const filteredSubcategories = selectedCategoryId
    ? subcategories.filter(s => String(s.categoryId) === selectedCategoryId)
    : subcategories;

  // Prefill form when product is loaded
  useEffect(() => {
    if (product) {
      const categoryObj = categories.find(c => c.name === product.categoryName);
      const subcategoryObj = subcategories.find(s => s.name === product.subcategoryName);

      reset({
        title: product.title || '',
        price: product.price || '',
        description: product.description || '',
        image: product.image || '',
        rating: product.rating || '',
        gender: product.gender || '',
        category: categoryObj ? String(categoryObj.id) : '',
        subcategory: subcategoryObj ? String(subcategoryObj.id) : '',
        quantity: product.quantity || ''
      });
    }
  }, [product, reset]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewImageFile(file);
    setNewImagePreview(URL.createObjectURL(file));
  };

  const clearNewImage = () => {
    setNewImageFile(null);
    setNewImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (data) => {
    let finalImageUrl = data.image;

    if (newImageFile) {
      try {
        const formData = new FormData();
        formData.append('image', newImageFile);

        // Replace with your real imgbb API key
        const res = await axios.post('https://api.imgbb.com/1/upload?key=YOUR_API_KEY', formData);
        finalImageUrl = res.data.data.url;
      } catch (err) {
        console.error('Failed to upload image:', err);
        alert('Image upload failed.');
        return;
      }
    }

    const payload = {
      title: data.title,
      price: parseFloat(data.price),
      description: data.description,
      image: finalImageUrl,
      rating: parseFloat(data.rating),
      gender: data.gender,
      categoryId: parseInt(data.category, 10),
      subcategoryId: parseInt(data.subcategory, 10),
      quantity: parseInt(data.quantity, 10)
    };

    try {
      await axios.put(`http://localhost:9000/products/${product.id}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Product updated!');
      navigate(-1);
    } catch (err) {
      console.error('Failed to update product:', err);
      alert('Update failed. Check console.');
    }
  };

  if (!product) return <div className="p-4">Product data not found</div>;

  return (
    <div className="flex justify-center items-center">
      <div className="mt-6 sm:mt-10 p-6 w-full max-w-4xl bg-white rounded border border-gray-300 shadow-md relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
        >✕</button>
        <Title text1="EDIT PRODUCT" />

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          {/* Old + new images */}
          <div className="flex gap-4">
            <ImageBox label="Old Photo" src={watch('image') || fallbackImage} />
            {changingPhoto && newImagePreview && (
              <div className="relative w-32 h-32">
                <p className="text-xs mb-1">New Photo</p>
                <img
                  src={newImagePreview}
                  alt="New Preview"
                  className="w-full h-full object-contain border border-green-400 rounded"
                />
               
              </div>
            )}
          </div>

          {!changingPhoto ? (
            <button
              type="button"
              onClick={() => setChangingPhoto(true)}
              className="w-full sm:w-32 py-2 mt-2 bg-black text-white cursor-pointer rounded hover:bg-gray-800 transition"
            >Change Photo</button>
          ) : (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                className="w-full sm:w-64 px-2 py-1 border border-gray-600 rounded text-sm"
              />
              {newImagePreview && (
                <button
                  type="button"
                  onClick={clearNewImage}
                  className="bg-black bg-opacity-60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-opacity-80"
                  title="Clear selected image"
                >✕</button>
              )}
            </div>
          )}

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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="Quantity"
              type="number"
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

          <button type="submit" className="w-full sm:w-32 py-2 mt-2 bg-black text-white cursor-pointer rounded hover:bg-gray-800 transition">
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}

// === Reusable components ===
const ImageBox = ({ label, src }) => (
  <div className="relative w-32 h-32">
    <p className="text-xs mb-1">{label}</p>
    <img
      src={src}
      alt={label}
      onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
      className="w-full h-full object-contain border border-gray-300 rounded"
    />
  </div>
);

const InputField = ({ label, type = 'text', step, register, placeholder, error }) => (
  <div>
    <p>{label}</p>
    <input
      type={type}
      step={step}
      {...register}
      className="w-full px-3 py-2 border border-gray-600 rounded"
      placeholder={placeholder}
    />
    {error && <p className="text-red-500 text-xs">{error.message}</p>}
  </div>
);

const TextareaField = ({ label, placeholder, register, error }) => (
  <div>
    <p>{label}</p>
    <textarea
      {...register}
      className="w-full px-3 py-2 border border-gray-600 rounded"
      placeholder={placeholder}
    />
    {error && <p className="text-red-500 text-xs">{error.message}</p>}
  </div>
);

const SelectField = ({ label, options, register, error }) => (
  <div>
    <p>{label}</p>
    <select
      {...register}
      className="w-full px-3 py-2 border border-gray-600 rounded"
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map(opt => (
        <option key={opt.id} value={opt.id}>{opt.name}</option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs">{error.message}</p>}
  </div>
);
