import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderDTO } from 'src/dtos/order.dto';
import { Order } from '../types/order';
import { LineItem } from '../types/line-item';
import { Discount } from '../types/discount';

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
      throw new HttpException('No Order with that uuid', HttpStatus.NO_CONTENT);
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
      throw new HttpException('No Order with that uuid', HttpStatus.NO_CONTENT);
    }
    // console.log(payload);

    if (payload.line_items) {
      updatedOrder.line_items.push(...payload.line_items);
    }
    // updatedOrder.line_items.concat(payload.line_items);
    // updatedOrder.markModified('line_items');
    // }
    if (payload.discounts) {
      updatedOrder.discounts.push(...payload.discounts);
      // updatedOrder.discounts.concat(payload.discounts);
      // updatedOrder.markModified('discounts');
    }

    updatedOrder = await this.calculateOrderTotals(updatedOrder);
    // updatedOrder = await this.calculateOrderTotals(
    //   await this.pushLineItemsAndDiscountsOnToArray(updatedOrder, payload),
    // );

    await updatedOrder.save();
    return updatedOrder;
  }

  // async pushLineItemsAndDiscountsOnToArray(updatedOrder:Order, payload:any): Promise<Order> {

  //   return updatedOrder;
  // }

  async parseDiscounts(order): Promise<any> {
    // console.log('parseDiscounts', order);
    const orderDiscounts: Discount[] = order.discounts.filter(
      discount => discount.apply_to === order.uuid,
    );
    const lineItemDiscounts: Discount[] = order.discounts.filter(
      discount => discount.apply_to !== order.uuid,
    );

    let percent = 0;
    let amount = 0;

    for (const orderDiscount of orderDiscounts) {
      // console.log(orderDiscount);
      if (orderDiscount.type === 'percent') percent += orderDiscount.amount;
      else amount += orderDiscount.amount;
    }

    let total = 0;
    if (amount > 0) {
      total = order.line_items.reduce((acc, cur: LineItem) => {
        return acc + cur.quantity * cur.price;
      }, 0);
    }

    const lineItemPercentHash = {};
    const lineItemAmountHash = {};
    for (const lineItemDiscount of lineItemDiscounts) {
      const applyTo = lineItemDiscount.apply_to;
      if (lineItemDiscount.type === 'percent' && lineItemPercentHash[applyTo])
        lineItemPercentHash[applyTo] += lineItemDiscount.amount;
      else if (lineItemDiscount.type === 'percent')
        lineItemPercentHash[applyTo] = lineItemDiscount.amount;
      else if (
        lineItemDiscount.type === 'amount' &&
        lineItemAmountHash[applyTo]
      )
        lineItemAmountHash[applyTo] += lineItemDiscount.amount;
      else if (lineItemDiscount.type === 'amount')
        lineItemAmountHash[applyTo] = lineItemDiscount.amount;
    }
    return {
      order,
      percent,
      amount,
      total,
      lineItemPercentHash,
      lineItemAmountHash,
    };
  }

  async applyDiscounts(
    order,
    percent,
    amount,
    total,
    lineItemPercentHash,
    lineItemAmountHash,
  ): Promise<Order> {
    for (let i = 0; i < order.line_items.length; i++) {
      const lineItem = order.line_items[i];
      lineItem.discount = 0;
      lineItem.discount += percent * lineItem.price;
      lineItem.discount +=
        (amount * lineItem.price * lineItem.quantity) / total;
      lineItem.discount +=
        (lineItemPercentHash[lineItem.uuid] || 0) * lineItem.price;
      lineItem.discount += lineItemAmountHash[lineItem.uuid] || 0;
    }
    return order;
  }
  async calculateOrderTotals(newOrder: Order): Promise<Order> {
    console.log(newOrder);
    const {
      order,
      percent,
      amount,
      total,
      lineItemPercentHash,
      lineItemAmountHash,
    } = await this.parseDiscounts(newOrder);

    console.log(percent, amount, lineItemAmountHash, lineItemPercentHash);

    const discountedOrder = await this.applyDiscounts(
      order,
      percent,
      amount,
      total,
      lineItemPercentHash,
      lineItemAmountHash,
    );
    discountedOrder.tax_total = discountedOrder.line_items.reduce(
      (acc, lineItem) => {
        // console.log(
        //   lineItem.price,
        //   lineItem.discount,
        //   lineItem.quantity,
        //   lineItem.tax_rate,
        //   acc
        // );
        // console.log(lineItem);
        return (
          acc +
          (lineItem.price - lineItem.discount) *
            lineItem.quantity *
            lineItem.tax_rate
        );
      },
      0,
    );
    // console.log(discountedOrder.tax_total)
    discountedOrder.total = discountedOrder.line_items.reduce(
      (acc, lineItem) => {
        return acc + (lineItem.price - lineItem.discount) * lineItem.quantity;
      },
      discountedOrder.tax_total,
    );
    return discountedOrder;
  }
}
