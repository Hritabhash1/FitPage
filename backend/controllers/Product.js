const Product = require('../models/Product');

exports.getallproducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

exports.createproduct = async (req, res) => {
  try {
    const { name, description } = req.body;
    const product = await Product.create({
      name,
      description,
    });
    res.status(201).json(product); 
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ message: 'Error creating product' });
  }
};
