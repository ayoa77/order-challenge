export interface LineItemDTO {
  uuid: string;
  name: string;
  quantity?: number;
  discount?: number;
  price: number;
  tax_rate?: number;
}
