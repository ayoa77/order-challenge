export interface LineItemDTO {
  uuid: string;
  name: string;
  quantity?: number;
  price: number;
  tax_rate?: number;
}
