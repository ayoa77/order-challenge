import * as mongoose from 'mongoose';

export const DiscountSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      index: true,
      required: [true, 'UUID of discount is required'],
    },
    name: String,
    type: {
      type: String,
      enum: ['percent', 'amount'],
      required: [true, 'Name of the discount is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount of discount is required.'],
    },
    apply_to: {
      type: String,
      required: [
        true,
        'UUID of where the discount should be applied is required.',
      ],
    },
  },
  { _id: false },
);
