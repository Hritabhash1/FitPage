const express = require("express");
const cors = require("cors");
const connectDB = require("./models");
require("dotenv").config();
const productRoutes = require("./routes/product");
const reviewRoutes = require("./routes/Review");
const userRoutes = require('./routes/User');
const tagRoutes = require('./routes/Tags');

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tags', tagRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
});
