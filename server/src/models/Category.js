const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    type: {
      type: String,
      required: [true, 'Category type is required'],
      enum: {
        values: ['expense', 'income'],
        message: 'Category type must be either expense or income',
      },
    },
    icon: {
      type: String,
      default: 'tag',
      trim: true,
    },
    color: {
      type: String,
      default: '#6B7280', // Default hex grey
      trim: true,
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null indicates a global system default category
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast lookup of categories by user and type
categorySchema.index({ user: 1, type: 1 });
categorySchema.index({ name: 1, user: 1 }, { unique: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
