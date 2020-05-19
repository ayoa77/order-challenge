import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../../order.service';
import { getModelToken } from '@nestjs/mongoose';

import * as mongoose from 'mongoose';
import { OrderDTO } from 'src/dtos/order.dto';
import { OrderSchema } from '../../../models/order.schema';
import { initialMockOrder } from './order.seed';

describe('OrderService', () => {
  let service: OrderService;
  let db: mongoose.Mongoose;

  beforeAll(async () => {
    // db = await mongoose.connect(process.env.MONGO_URI);
    // await db.connection.db.dropDatabase();
  });

  afterAll(async done => {
    await mongoose.disconnect(done);
  });

  beforeEach(async () => {
    function mockOrderModel(mockOrder: OrderDTO) {
      console.log(this)
      this.data = [mockOrder];
      this.save = () => {
        return this.data;
      };
      this.findOne = uuid => {
        return this.data.filter(order => order.uuid === uuid);
      };
      this.find = () => {
        return this.data;
      };
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getModelToken('Order'),
          // useValue: new mockOrderModel(orderSeed),
          useValue: OrderSchema,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create one Order', async () => {
      const result = await service.createOrder(initialMockOrder);

      expect(result.uuid).toBe(initialMockOrder.uuid);
      expect(result.total).toBe(service.calculateOrderTotals(result).total);
    });
  });

  describe('getOrder', () => {
    it('should return one Order', async () => {
      const result = await service.getOrder(initialMockOrder.uuid);
      expect(result.uuid).toBe(initialMockOrder.uuid);
    });
  });

  describe('listOrders', () => {
    it('should return one Order', async () => {
      const result = await service.listOrders();
      expect(result.length).toBe(1);
    });
  });
});
