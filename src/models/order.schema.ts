import * as mongoose from 'mongoose';
import { setPrice } from '../utils/helpers/set-price.helper';
import { LineItemSchema } from './line-item.schema';
import { DiscountSchema } from './discount.schema';

export const OrderSchema = new mongoose.Schema({
  uuid: {
    type: String,
    index: true,
  },
  line_items: [LineItemSchema],
  discounts: [DiscountSchema],
  tax_total: { type: Number, set: setPrice, min: 0 },
  total: {
    type: Number,
    set: setPrice,
    min: [0, 'Order price can not be less than 0'],
  },
});
