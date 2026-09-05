const mongoose = require('mongoose');
const config = require('./env');
const seedDefaultCategories = require('../utils/seedCategories');

/**
 * Connects to MongoDB database using Mongoose ODM.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}`);
    
    // Seed system default categories if missing
    await seedDefaultCategories();
  } catch (error) {
    console.error(`[Database Error] Connection Failed: ${error.message}`);
    // Exit process with failure code 1
    process.exit(1);
  }
};

module.exports = connectDB;
