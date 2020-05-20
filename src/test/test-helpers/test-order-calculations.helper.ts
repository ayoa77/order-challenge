import { setPrice } from '../../utils/helpers/set-price.helper';
import { Discount } from '../../types/discount';

export const totalsTester = async function(newOrder) {
  const {
    testOrder,
    testPercentDiscount,
    testAmountDiscount,
    testTempTotal,
    testLineItemPercentHash,
    testLineItemAmountHash,
  } = await this.testParseDiscounts(newOrder);
  testOrder.line_items.forEach(li => {
    if (li.quantity == null) li.quantity = 1;
    li.discount = 0;
    li.discount += testPercentDiscount * li.price;
    li.discount +=
      (testAmountDiscount * li.price * li.quantity) / testTempTotal;
    li.discount += (testLineItemPercentHash[li.uuid] || 0) * li.price;
    li.discount += testLineItemAmountHash[li.uuid] || 0;
  });

  const tax_total = setPrice(
    testOrder.line_items.reduce((acc, li) => {
      return acc + (li.price - li.discount) * li.quantity * li.tax_rate;
    }, 0),
  );

  const total = setPrice(
    testOrder.line_items.reduce((acc, li) => {
      return acc + (li.price - li.discount) * li.quantity;
    }, tax_total),
  );
  return { total, tax_total, testOrder };
};

export const testParseDiscounts = async function(testOrder) {
  let orderDiscounts: Discount[];
  let lineItemDiscounts: Discount[];

  if (testOrder.discounts && testOrder.discounts.length > 0) {
    orderDiscounts = testOrder.discounts.filter(
      discount => discount.apply_to === testOrder.uuid,
    );
    lineItemDiscounts = testOrder.discounts.filter(
      discount => discount.apply_to !== testOrder.uuid,
    );
  } else {
    orderDiscounts = [];
    lineItemDiscounts = [];
  }

  let testAmountDiscount = 0;
  let testPercentDiscount = 0;
  let testTempTotal = 1;

  orderDiscounts.forEach(ordDisc => {
    if (ordDisc.type === 'percent') testPercentDiscount += ordDisc.amount;
    else testAmountDiscount += ordDisc.amount;
  });

  if (testAmountDiscount > 0) {
    testTempTotal = testOrder.line_items.reduce(
      (acc: number, li: { quantity: number; price: number }) => {
        if (li.quantity == null) li.quantity = 1;
        return acc + li.quantity * li.price;
      },
      0,
    );
  }

  const testLineItemPercentHash: object = {};
  const testLineItemAmountHash: object = {};

  lineItemDiscounts.forEach(liDisc => {
    const applyTo = liDisc.apply_to;
    switch (true) {
      case liDisc.type === 'percent' && testLineItemPercentHash[applyTo]:
        testLineItemPercentHash[applyTo] += liDisc.amount;
        break;
      case liDisc.type === 'percent':
        testLineItemPercentHash[applyTo] = liDisc.amount;
        break;
      case liDisc.type === 'amount' && testLineItemAmountHash[applyTo]:
        testLineItemAmountHash[applyTo] += liDisc.amount;
        break;
      case liDisc.type === 'amount':
        testLineItemAmountHash[applyTo] = liDisc.amount;
        break;
      default:
        break;
    }
  });

  return {
    testOrder,
    testPercentDiscount,
    testAmountDiscount,
    testTempTotal,
    testLineItemPercentHash,
    testLineItemAmountHash,
  };
};
