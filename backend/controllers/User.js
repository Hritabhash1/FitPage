const User = require('../models/User');

exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

exports.loginOrRegister = async (req, res) => {
  try {
    const { name, email } = req.body;

    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({ name, email });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error during login/register:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};