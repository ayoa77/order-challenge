import * as mongoose from 'mongoose';

export const LineItemSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      index: true,
      required: [true, 'UUID of line item is required'],
    },
    name: {
      type: String,
      required: [true, 'Name of line item is required.'],
    },
    quantity: {
      type: Number,
      default: 1,
    },
    discount: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      min: [0, 'line item price can not be less than 0'],
      required: [true, 'Price of line item is required.'],
    },
    tax_rate: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);
