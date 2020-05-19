import { Document } from 'mongoose';
import { LineItem } from './line-item';
import { Discount } from './discount';

export interface Order extends Document {
  uuid: string;
  line_items: LineItem[];
  discounts: Discount[];
  tax_total?: number;
  total?: number;
}
