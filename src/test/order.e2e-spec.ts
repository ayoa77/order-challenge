import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { app, database } from './constants';
import { createMockOrder, updateMockOrder } from './seeds/order.seed';
import { totalsTester } from './test-helpers/test-order-calculations.helper';

beforeAll(async () => {
  await mongoose.connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await mongoose.connection.db.dropDatabase();
});

afterAll(async done => {
  await mongoose.disconnect(done);
});

describe('/orders', () => {
  it('should create order of lineitems and calculate the taxes and totals', async () => {
    return request(app)
      .post('/orders')
      .set('Accept', 'application/json')
      .send(createMockOrder)
      .expect(async ({ body }) => {
        expect(body.uuid).toEqual(createMockOrder.uuid);
        expect(body.line_items.length).toEqual(
          createMockOrder.line_items.length,
        );
        expect(
          createMockOrder.line_items
            .map(li => li.uuid)
            .includes(body.line_items[0].uuid),
        ).toBeTruthy();
        const { tax_total, total } = await totalsTester(createMockOrder);
        expect(body.tax_total).toEqual(tax_total);
        expect(body.total).toEqual(total);
      })
      .expect(200);
  });

  it('should reject a duplicated uuid', async () => {
    return (
      request(app)
        .post('/orders')
        .set('Accept', 'application/json')
        .send(createMockOrder)
        // .expect(({ body }) => {
        // })
        .expect(400)
    );
  });

  it('should list all the orders', () => {
    return request(app)
      .get('/orders')
      .expect(async ({ body }) => {
        expect(body.length).toEqual(1);
        expect(body[0].line_items.length).toEqual(
          createMockOrder.line_items.length,
        );
        expect(body[0].discounts.length).toEqual(
          createMockOrder.discounts.length,
        );
        expect(
          createMockOrder.line_items
            .map(li => li.uuid)
            .includes(body[0].line_items[0].uuid),
        ).toBeTruthy();
        const { tax_total, total } = await totalsTester(body[0]);
        expect(body[0].tax_total).toEqual(tax_total);
        expect(body[0].total).toEqual(total);
      })
      .expect(200);
  });

  it('should fetch the order by the uuid', () => {
    return request(app)
      .get(`/orders/${createMockOrder.uuid}`)
      .expect(async ({ body }) => {
        expect(body.line_items.length).toEqual(
          createMockOrder.line_items.length,
        );
        expect(body.discounts.length).toEqual(createMockOrder.discounts.length);
        expect(
          createMockOrder.line_items
            .map(li => li.uuid)
            .includes(body.line_items[0].uuid),
        ).toBeTruthy();
        const { tax_total, total } = await totalsTester(body);
        expect(body.tax_total).toEqual(tax_total);
        expect(body.total).toEqual(total);
      })
      .expect(200);
  });

  it('should update the order by the uuid and recaculate taxes and totals', () => {
    return request(app)
      .put(`/orders/${createMockOrder.uuid}`)
      .set('Accept', 'application/json')
      .send(updateMockOrder)
      .expect(async ({ body }) => {
        expect(body.line_items.length).toEqual(
          createMockOrder.line_items.length + updateMockOrder.line_items.length,
        );
        expect(body.discounts.length).toEqual(
          createMockOrder.discounts.length + updateMockOrder.discounts.length,
        );
        expect(
          updateMockOrder.line_items
            .map(li => li.uuid)
            .includes(
              body.line_items[
                createMockOrder.line_items.length +
                  updateMockOrder.line_items.length -
                  1
              ].uuid,
            ) ||
            updateMockOrder.discounts
              .map(li => li.uuid)
              .includes(
                body.discounts[
                  createMockOrder.discounts.length +
                    updateMockOrder.discounts.length -
                    1
                ].uuid,
              ),
        ).toBeTruthy();
        const { tax_total, total } = await totalsTester(body);
        expect(body.tax_total).toEqual(tax_total);
        expect(body.total).toEqual(total);
      })
      .expect(200);
  });
});
