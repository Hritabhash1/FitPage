import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const ProductCard = ({ product }) => {
  const [rating, setRating] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [image, setImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tags, setTags] = useState([]);
  const [isAlreadyReviewed, setIsAlreadyReviewed] = useState(false);
  const [averageRating, setAverageRating] = useState(null);
  const [ratingCount, setRatingCount] = useState(0);
  const [allReviews, setAllReviews] = useState([]);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!image) {
      setPreviewURL(null);
      return;
    }
    const objectURL = URL.createObjectURL(image);
    setPreviewURL(objectURL);
    return () => URL.revokeObjectURL(objectURL);
  }, [image]);

  const calculateAverageRating = (reviews) => {
    const valid = reviews.filter((r) => r.rating && r.rating > 0);
    if (!valid.length) return null;
    const total = valid.reduce((sum, r) => sum + r.rating, 0);
    setRatingCount(valid.length);
    return total / valid.length;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tagsRes, reviewsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/tags/${product.id}`),
          axios.get(`http://localhost:5000/api/reviews/${product.id}`)
        ]);

        setTags(tagsRes.data.tags || []);
        const reviews = reviewsRes.data.reviews || [];
        setAllReviews(reviews);

        if (reviews.find((r) => r.userId === userId)) {
          setIsAlreadyReviewed(true);
        }

        setAverageRating(calculateAverageRating(reviews));
      } catch (err) {
        console.error('Error loading product data:', err);
      }
    };

    fetchData();
  }, [product.id, userId]);

  const handleImageUpload = async () => {
    if (!image) return null;
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );
    const data = await res.json();
    console.log('Image upload response:', data);
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!rating && !reviewText && !image) {
      setError('Please add at least a rating, review, or image.');
      return;
    }
    if (rating && (rating < 1 || rating > 5)) {
      setError('Rating must be between 1 and 5.');
      return;
    }

    try {
      const uploadedImageURL = await handleImageUpload();
      console.log(uploadedImageURL)
      await axios.post('http://localhost:5000/api/reviews', {
        userId,
        productId: product.id,
        rating: rating ? parseInt(rating, 10) : null,
        reviewText: reviewText || null,
        imageURL: uploadedImageURL || null
      });

      setSuccess('Review submitted!');
      setRating('');
      setReviewText('');
      setImage(null);
      setIsAlreadyReviewed(true);
      setPreviewURL(null);

      const [tagsRes, reviewsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/tags/${product.id}`),
        axios.get(`http://localhost:5000/api/reviews/${product.id}`)
      ]);
      setTags(tagsRes.data.tags || []);
      const reviews = reviewsRes.data.reviews || [];
      setAllReviews(reviews);
      setAverageRating(calculateAverageRating(reviews));
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-5 hover:shadow-xl transition duration-300">
      <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
      <p className="text-gray-600 mt-1 mb-2">{product.description}</p>

      {averageRating !== null && (
        <p className="text-yellow-600 font-medium mb-3">
          Average Rating: {averageRating.toFixed(1)} ({ratingCount} ratings)
        </p>
      )}

      {tags.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700">Common Tags:</h4>
          <div className="flex flex-wrap gap-2 mt-1">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {allReviews.some((r) => r.imageUrl) && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700">Review  Images:</h4>
          <div className="flex flex-wrap gap-2 mt-2 max-h-96 overflow-y-auto">
            {allReviews
              .filter((r) => r.imageUrl)
              .map((r, idx) => (
                <img
                  key={idx}
                  src={r.imageUrl}
                  alt={`review-img-${idx}`}
                  className="w-24 h-24 object-cover rounded-md border"
                />
              ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Rating (1-5)
          </label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
            disabled={isAlreadyReviewed}
            className={`w-full border px-3 py-1 rounded ${
              isAlreadyReviewed
                ? 'border-red-500 bg-red-50 cursor-not-allowed'
                : 'border-gray-300'
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Review
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows="3"
            disabled={isAlreadyReviewed}
            placeholder="Write your thoughts..."
            className={`w-full border px-3 py-2 rounded ${
              isAlreadyReviewed
                ? 'border-red-500 bg-red-50 cursor-not-allowed'
                : 'border-gray-300'
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Image (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            disabled={isAlreadyReviewed}
            className={`w-full px-2 py-1 border rounded ${
              isAlreadyReviewed
                ? 'border-red-500 bg-red-50 cursor-not-allowed'
                : 'border-gray-300'
            }`}
          />
          {previewURL && (
            <img
              src={previewURL}
              alt="preview"
              className="w-24 h-24 object-cover rounded-md border mt-2"
            />
          )}
        </div>

        {isAlreadyReviewed && (
          <p className="text-blue-600 text-sm">
            You've already reviewed this product.
          </p>
        )}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <button
          type="submit"
          disabled={isAlreadyReviewed}
          className={`px-4 py-2 rounded text-white ${
            isAlreadyReviewed
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ProductCard;
