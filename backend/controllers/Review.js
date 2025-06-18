const Review = require('../models/Review');
const User = require('../models/User'); 

const addReview = async (req, res) => {
  try {
    const { userId, productId, rating, reviewText, imageURL } = req.body;

    const existingReview = await Review.findOne({
      where: { userId, productId },
    });

    if (existingReview) {
      if (rating !== null && existingReview.rating !== null) {
        return res.status(400).json({ message: 'Rating already submitted. Cannot update rating.' });
      }

      if (reviewText !== null && existingReview.reviewText !== null) {
        return res.status(400).json({ message: 'Review already submitted. Cannot update review.' });
      }

      const updatedReview = await existingReview.update({
        rating: rating !== null ? rating : existingReview.rating,
        reviewText: reviewText !== null ? reviewText : existingReview.reviewText,
      });

      return res.status(200).json({ message: 'Review updated with missing data', review: updatedReview });
    }

    const newReview = await Review.create({
      userId,
      productId,
      rating,
      reviewText,
      imageUrl: imageURL || null, 
    });

    return res.status(201).json({ message: 'Review created', review: newReview });

  } catch (error) {
    console.error('Error in addReview:', error);
    return res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};


const getReviewsByProductId = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.findAll({
      where: { productId },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ reviews });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addReview,
  getReviewsByProductId,
};
