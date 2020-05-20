import { OrderDTO } from '../../dtos/order.dto';
import { UpdateOrderDTO } from '../../dtos/order.dto';

export const initialMockOrder: OrderDTO = {
  uuid: 'a76ee7b0-7f9e-4443-81ac-f4aaqfarz1u3h',
  line_items: [
    {
      uuid: '7cd7f0ef-8265-4593-95ea-dd7c2bb6396d',
      quantity: 500,
      name: 'Hamburger',
      price: 875,
      tax_rate: 0.0625,
    },
    {
      uuid: '6d419f88-b53f-49e2-af0a-832444d6ed41',
      name: 'Water',
      quantity: 1,
      price: 235,
      tax_rate: 0.0625,
    },
    {
      uuid: '47dfb3e6-b892-40b8-9ce6-f769c6e15537',
      name: 'Beer',
      quantity: 1,
      price: 1025,
      tax_rate: 0.0825,
    },
  ],
  discounts: [
    {
      uuid: '88140f25-f314-493b-ad81-32932f1ae4cc',
      name: '$1 off beer',
      type: 'amount',
      amount: 100,
      apply_to: '47dfb3e6-b892-40b8-9ce6-f769c6e15537',
    },
    {
      uuid: 'b1d52ea0-141b-4363-a42d-3bbd0b851222',
      name: '10% membership discount',
      type: 'percent',
      amount: 0.1,
      apply_to: 'a76ee7b0-7f9e-4443-81ac-f4aaqfarz1u3h',
    },
  ],
};

export const createMockOrder: OrderDTO = {
         uuid: 'a76ee7b0-7f9e-4443-81ac-f4aaqfarz1u4u',
         discounts: [
           {
             uuid: '88140f25-f314-493b-ad81-32932f1ae4cc',
             name: '$2 off beer',
             type: 'amount',
             amount: 200,
             apply_to: '47dfb3e6-b892-40b8-9ce6-f769c6e15537',
           }
         ],
         line_items: [
           {
             uuid: '7cd7f0ef-8265-4593-95ea-dd7c2bb6396d',
             name: 'Hamburger',
             price: 725,
             tax_rate: 0.0775,
           },
           {
             uuid: '47dfb3e6-b892-40b8-9ce6-f769c6e15537',
             name: 'Beer',
             quantity: 1,
             price: 1025,
             tax_rate: 0.0825,
           },
         ],
       };
export const updateMockOrder: UpdateOrderDTO = {
         uuid: 'a76ee7b0-7f9e-4443-81ac-f4aaqfarz1u4u',

         line_items: [
           {
             uuid: '6d419f88-b53f-49e2-af0a-832444d6ed41',
             name: 'Water',
             quantity: 1,
             price: 235,
             tax_rate: 0.0625,
           },
           {
             uuid: '47dfb3e6-b892-40b8-9ce6-f769c6e15537',
             name: 'Beer',
             quantity: 1,
             price: 1025,
             tax_rate: 0.0825,
           },
           {
             uuid: '7cd7f0ef-8265-4593-95ea-dd7c2bb6396d',
             name: 'Hamburger',
             price: 875,
             tax_rate: 0.0625,
           },
         ],
         discounts: [
           {
             uuid: '88140f25-f314-493b-ad81-32932f1ae4cc',
             name: '$1 off beer',
             type: 'amount',
             amount: 100,
             apply_to: '47dfb3e6-b892-40b8-9ce6-f769c6e15537',
           },
           {
             uuid: 'b1d52ea0-141b-4363-a42d-3bbd0b851222',
             name: '10% membership discount',
             type: 'percent',
             amount: 0.1,
             apply_to: 'a76ee7b0-7f9e-4443-81ac-f4aaqfarz1u4u',
           },
           {
             uuid: 'b1d52ea0-141b-4363-a42d-3bbd0b851222',
             name: '10% membership discount',
             type: 'percent',
             amount: 0.1,
             apply_to: 'a76ee7b0-7f9e-4443-81ac-f4aaqfarz1u4u',
           },
           {
             uuid: 'b1d52ea0-141b-4363-a42d-3bbd0b851222',
             name: '10% membership discount',
             type: 'amount',
             amount: 200,
             apply_to: 'a76ee7b0-7f9e-4443-81ac-f4aaqfarz1u4u',
           },
           {
             uuid: 'b1d52ea0-141b-4363-a42d-3bbd0b851222',
             name: '10% membership discount',
             type: 'amount',
             amount: 200,
             apply_to: 'a76ee7b0-7f9e-4443-81ac-f4aaqfarz1u4u',
           },
         ],
       };
