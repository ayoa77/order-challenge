import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderDTO } from '../dtos/order.dto';
import { Order } from '../types/order';
import { LineItem } from '../types/line-item';
import { Discount } from '../types/discount';
import { LineItemDTO } from '../dtos/line-item.dto';

@Injectable()
export class OrderService {
  constructor(@InjectModel('Order') private orderModel: Model<Order>) {}

  async createOrder(newOrder: OrderDTO): Promise<Order> {
    const { uuid } = newOrder;
    const order = await this.orderModel.findOne({ uuid });
    if (order) {
      throw new HttpException(
        'An Order with that uuid already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const createdOrder = await this.calculateOrderTotals(
      new this.orderModel(newOrder),
    );
    await createdOrder.save();
    return createdOrder;
  }

  async getOrder(orderUuid: string): Promise<Order> {
    const order = await this.orderModel.findOne({ uuid: orderUuid });

    if (!order) {
      throw new HttpException('No Order with that uuid', HttpStatus.NOT_FOUND);
    }
    return order;
  }

  async listOrders(): Promise<Order[]> {
    const orders = await this.orderModel.find({});

    return orders;
  }

  async updateOrder(orderUuid: string, payload: any): Promise<Order> {
    let updatedOrder = await this.orderModel.findOne({ uuid: orderUuid });

    if (!updatedOrder) {
      throw new HttpException('No Order with that uuid', HttpStatus.NOT_FOUND);
    }

    const payLoadLineItemsHash = {};
    if (payload.line_items != null && payload.line_items.length > 0) {
      payload.line_items.forEach(li => {
        payLoadLineItemsHash[li.uuid] = li;
      });
    } else payload.line_items = [];

    if (payload.line_items.length > 0) {
      updatedOrder.line_items.forEach(li => {
        if (payLoadLineItemsHash[li.uuid]) {
          li = payLoadLineItemsHash[li.uuid];
          delete payLoadLineItemsHash[li.uuid];
        }
      });
    }

    const payloadDiscountsHash = {};
    if (payload.discounts != null && payload.discounts.length > 0) {
      payload.discounts.forEach(disc => {
        payloadDiscountsHash[disc.uuid] = disc;
      });
    } else payload.discounts = [];

    if (payload.discounts.length > 0) {
      updatedOrder.discounts.forEach(disc => {
        if (payloadDiscountsHash[disc.uuid]) {
          disc = payloadDiscountsHash[disc.uuid];
          delete payloadDiscountsHash[disc.uuid];
        }
      });
    }

    if (payload.line_items.length > 0) {
      const newLineItems: LineItem[] = Object.values(payLoadLineItemsHash);
      updatedOrder.line_items.push(...newLineItems);
    }
    if (payload.discounts.length > 0) {
      const newDiscounts: Discount[] = Object.values(payloadDiscountsHash);
      updatedOrder.discounts.push(...newDiscounts);
    }

    updatedOrder = await this.calculateOrderTotals(updatedOrder);

    await updatedOrder.save();
    return updatedOrder;
  }

  // These are helper functions for the calculations of tax_total and total
  // They are written here so that they can be tested from order.spec.ts
  async parseDiscounts(order): Promise<any> {
    let orderDiscounts: Discount[];
    let lineItemDiscounts: Discount[];

    if (order.discounts && order.discounts.length > 0) {
      orderDiscounts = order.discounts.filter(
        discount => discount.apply_to === order.uuid,
      );
      lineItemDiscounts = order.discounts.filter(
        discount => discount.apply_to !== order.uuid,
      );
    } else {
      orderDiscounts = [];
      lineItemDiscounts = [];
    }
    let percentDiscount = 0;
    let amountDiscount = 0;

    orderDiscounts.forEach(ordDisc => {
      if (ordDisc.type === 'percent') percentDiscount += ordDisc.amount;
      else amountDiscount += ordDisc.amount;
    });

    let tempTotal = 1;
    if (amountDiscount > 0) {
      tempTotal = order.line_items.reduce((acc, cur: LineItem) => {
        return acc + cur.quantity * cur.price;
      }, 0);
    }

    const lineItemPercentHash = {};
    const lineItemAmountHash = {};

    lineItemDiscounts.forEach(liDisc => {
      const applyTo = liDisc.apply_to;
      switch (true) {
        case liDisc.type === 'percent' && lineItemPercentHash[applyTo]:
          lineItemPercentHash[applyTo] += liDisc.amount;
          break;
        case liDisc.type === 'percent':
          lineItemPercentHash[applyTo] = liDisc.amount;
          break;
        case liDisc.type === 'amount' && lineItemAmountHash[applyTo]:
          lineItemAmountHash[applyTo] += liDisc.amount;
          break;
        case liDisc.type === 'amount':
          lineItemAmountHash[applyTo] = liDisc.amount;
          break;
        default:
          break;
      }
    });

    return {
      order,
      percentDiscount,
      amountDiscount,
      tempTotal,
      lineItemPercentHash,
      lineItemAmountHash,
    };
  }

  async applyDiscounts(
    order,
    percentDiscount,
    amountDiscount,
    tempTotal,
    lineItemPercentHash,
    lineItemAmountHash,
  ): Promise<Order> {
    order.line_items.forEach(li => {
      if (li.quantity == null) li.quantity = 1;
      if (li.quantity == null) li.quantity = 1;
      li.discount = 0;
      li.discount += percentDiscount * li.price;
      li.discount += (amountDiscount * li.price * li.quantity) / tempTotal;
      li.discount += (lineItemPercentHash[li.uuid] || 0) * li.price;
      li.discount += lineItemAmountHash[li.uuid] || 0;
    });
    return order;
  }

  async calculateOrderTotals(newOrder: Order): Promise<Order> {
    const {
      order,
      percentDiscount,
      amountDiscount,
      tempTotal,
      lineItemPercentHash,
      lineItemAmountHash,
    } = await this.parseDiscounts(newOrder);

    const discountedOrder = await this.applyDiscounts(
      order,
      percentDiscount,
      amountDiscount,
      tempTotal,
      lineItemPercentHash,
      lineItemAmountHash,
    );

    discountedOrder.tax_total = discountedOrder.line_items.reduce((acc, li) => {
      if (li.price == null)
      return acc + (li.price - li.discount) * li.quantity * li.tax_rate;
    }, 0);

    discountedOrder.total = discountedOrder.line_items.reduce((acc, li) => {
      return acc + (li.price - li.discount) * li.quantity;
    }, discountedOrder.tax_total);
    return discountedOrder;
  }
}
