import { Document } from 'mongoose';

export interface LineItem extends Document {
  uuid: string;
  name: string;
  quantity?: number;
  discount?: number;
  price: number;
  tax_rate?: number;
}
