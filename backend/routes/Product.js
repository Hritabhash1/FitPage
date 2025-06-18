const express = require("express");
const router = express.Router();
const { getallproducts, createproduct } = require("../controllers/Product");

router.get("/", getallproducts);
router.post("/", createproduct);

module.exports = router;
