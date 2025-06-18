const express = require('express');
const router = express.Router();
const extractTags = require('../Utils/Tags');
const review = require('../Models/Review');

router.get('/:productId', async (req, res) => {
  try {
    const reviews = await review.findAll({
      where: { ProductId: req.params.productId },
      attributes: ['reviewText']
    });

    const tags = extractTags(reviews);
    res.json({ tags });
  } catch (err) {
    console.error('Error generating tags:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;