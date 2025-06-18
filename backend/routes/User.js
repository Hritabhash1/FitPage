const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/User');
const { loginOrRegister } = require('../controllers/User');
router.post('/', createUser);
router.post('/login', loginOrRegister);
module.exports = router;
