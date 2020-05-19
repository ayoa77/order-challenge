import { Document } from 'mongoose';

export interface Discount extends Document {
  uuid: string;
  name: string;
  type: string;
  amount: number;
  apply_to: string;
}
