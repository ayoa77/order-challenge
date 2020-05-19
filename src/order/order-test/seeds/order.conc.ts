import 'dotenv/config';
import { Test } from '@nestjs/testing';
import { OrderController } from '../../order.controller';
import { OrderService } from '../../order.service';
// import { orderSeed } from './order.seed';
import { OrderSchema } from 'src/models/order.schema';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

describe('OrderController', () => {
  let orderController: OrderController;
  let orderService: OrderService;


  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
      ],
      controllers: [OrderController],
      // providers: [
      //   OrderService,
      //   {
      //     provide: getModelToken('Order'),
      //     useValue: orderSeed,
      //   },
      // ],
    }).compile();

    // orderService = moduleRef.get<OrderService>(OrderService);
    orderController = moduleRef.get<OrderController>(OrderController);
  });


});
