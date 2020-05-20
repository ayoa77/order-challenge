import {
  Controller,
  Put,
  Param,
  Body,
  Post,
  Get,
  HttpCode,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from '../types/order';
import { OrderDTO } from '../dtos/order.dto';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @HttpCode(200)
  createOrder(@Body() order: OrderDTO): Promise<Order> {
    return this.orderService.createOrder(order);
  }

  @Get(':uuid')
  getOrder(@Param('uuid') uuid: string): Promise<Order> {
    return this.orderService.getOrder(uuid);
  }

  @Get()
  listOrders(): Promise<Order[]> {
    return this.orderService.listOrders();
  }

  @Put(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @Body() payload: any,
  ): Promise<Order> {
    return await this.orderService.updateOrder(uuid, payload);
  }
}
