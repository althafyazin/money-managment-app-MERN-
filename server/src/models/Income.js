const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Income must belong to a user'],
      index: true,
    },
    source: {
      type: String,
      required: [true, 'Income source is required'],
      trim: true,
      maxlength: [100, 'Source cannot exceed 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Income amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Income category is required'],
      index: true,
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      required: function () {
        return this.isRecurring;
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for optimized query performance
incomeSchema.index({ user: 1, date: -1 });
incomeSchema.index({ user: 1, category: 1 });

const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;
