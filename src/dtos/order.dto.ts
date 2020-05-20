import { LineItemDTO } from './line-item.dto';
import { DiscountDTO } from './discount.dto';

export interface OrderDTO {
  uuid: string;
  line_items: LineItemDTO[];
  discounts?: DiscountDTO[];
}

export interface UpdateOrderDTO {
  uuid?: string;
  line_items?: LineItemDTO[];
  discounts?: DiscountDTO[];
}
