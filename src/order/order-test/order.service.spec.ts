import 'dotenv/config';
import { OrderService } from '../order.service';
import * as mongoose from 'mongoose';
import { OrderSchema } from '../../models/order.schema';
import { Model } from 'mongoose';
import {
  createMockOrder,
  updateMockOrder,
  initialMockOrder,
} from '../../test/seeds/order.seed';
import { Order } from '../../types/order';
import {
  totalsTester,
  testParseDiscounts,
} from '../../test/test-helpers/test-order-calculations.helper';

describe('OrderService', () => {
  let orderService: OrderService;
  let db: mongoose.Connection;
  let orderModel: Model<Order>;

  beforeAll(async () => {
    db = await mongoose.createConnection(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db.dropDatabase();
    orderModel = await db.model('Order', OrderSchema);
    orderService = new OrderService(orderModel);
  });

  afterAll(async done => {
    await orderModel.deleteMany({});
    await mongoose.disconnect(done);
  });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create one Order', async () => {
      const result = await orderService.createOrder(createMockOrder);

      const { total, tax_total } = await totalsTester(result);

      expect(result.uuid).toBe(createMockOrder.uuid);
      const newResult = await orderService.calculateOrderTotals(result);
      expect(result.total).toBe(newResult.total);
      expect(result.total).toBe(total);
      expect(result.tax_total).toBe(tax_total);
    });
  });

  describe('getOrder', () => {
    it('should return one Order', async () => {
      const result = await orderService.getOrder(createMockOrder.uuid);
      expect(result.uuid).toBe(createMockOrder.uuid);
    });
  });

  describe('listOrders', () => {
    it('should return a list of Orders', async () => {
      const result = await orderService.listOrders();
      expect(result.length).toBe(1);
    });
  });

  describe('updateOrder', () => {
    it('should return one Order', async () => {
      const result = await orderService.updateOrder(
        updateMockOrder.uuid,
        updateMockOrder,
      );

      // making uniqe arrays of discounts and line items to see if these were
      // successfully combined
      const cmoDiscs = createMockOrder.discounts.map(cmoLi => cmoLi.uuid);
      const umoDiscs = updateMockOrder.discounts.map(umoLi => umoLi.uuid);
      const uniqueDiscsSize = new Set([...cmoDiscs, ...umoDiscs]).size;

      const cmoLis = createMockOrder.line_items.map(cmoLi => cmoLi.uuid);
      const umoLis = updateMockOrder.line_items.map(umoLi => umoLi.uuid);
      const uniqueLisSize = new Set([...cmoLis, ...umoLis]).size;
      const { total, tax_total } = await totalsTester(result);
      expect(result.total).toBe(total);
      expect(result.tax_total).toBe(tax_total);
      expect(result.discounts.length).toBe(uniqueDiscsSize);
      expect(result.line_items.length).toBe(uniqueLisSize);
    });
  });

  describe('parseDiscounts, applyDiscounts, and calculateOrderTotals', () => {
    let created: Order;
    let testParsedOrder: any;
    let parsedOrder: any;
    describe('parseDiscounts', () => {
      it('should return Order with proper tax total and totals', async () => {
        created = await orderModel.create(initialMockOrder);
        testParsedOrder = await testParseDiscounts(created);
        parsedOrder = await orderService.parseDiscounts(created);
        expect(parsedOrder.order.uuid).toBe(testParsedOrder.testOrder.uuid);
        expect(parsedOrder.order.line_items.length).toBe(
          testParsedOrder.testOrder.line_items.length,
        );
        expect(parsedOrder.order.discounts.length).toBe(
          testParsedOrder.testOrder.discounts.length,
        );
        expect(parsedOrder.tempTotal).toBe(testParsedOrder.testTempTotal);
        expect(parsedOrder.amountDiscount).toBe(
          testParsedOrder.testAmountDiscount,
        );
        expect(parsedOrder.percentDiscount).toBe(
          testParsedOrder.testPercentDiscount,
        );
      });
    });

    describe('applyDiscounts & calculateOrderTotals', () => {
      it('should return Order with proper tax total and totals', async () => {
        const { total, tax_total, testOrder } = await totalsTester(
          initialMockOrder,
        );
        let created = await orderModel.create(initialMockOrder);
        created = await orderService.calculateOrderTotals(created);
        // creating an array of discounts and converting to string
        // to check for array equality and applyDiscounts() effectiveness
        expect(
          created.line_items
            .map(li => li.discount)
            .sort()
            .toString(),
        ).toBe(
          testOrder.line_items
            .map(li => li.discount)
            .sort()
            .toString(),
        );
        expect(created.tax_total).toBe(tax_total);
        expect(created.total).toBe(total);
      });
    });
  });
});
