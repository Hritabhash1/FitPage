const sequelize = require("../config/db");

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(" Database connected");
    await sequelize.sync({ alter: true });
    console.log("models synced");
  } catch (err) {
    console.error("DB connection error:", err);
  }
};

module.exports = connectDB;
