import { describe, expect, test } from '@jest/globals';
import {
  checkCvv,
  checkExpireDate,
  getCreditCardName,
  isCreditCardNumber,
  validate,
  regEmail,
} from '../features/Modal/validation';
import { OrderState } from './OrderState';

const orderList = {
  1: { count: '1', price: '10' },
  2: { count: '2', price: '20' },
  3: { count: '3', price: '30' },
};

const orderListAdd = {
  1: { count: '1', price: '10' },
  2: { count: '2', price: '20' },
  3: { count: '3', price: '30' },
  4: { count: '1', price: '40' },
};

const orderListDeleted = {
  2: { count: '2', price: '20' },
  3: { count: '3', price: '30' },
  4: { count: '1', price: '40' },
};

const orderListCount = Object.keys(orderList).length;

const creditCardNumber = '4111111111111111';

describe('app test', () => {
  describe('validation test', () => {
    test('check credit card ', () => {
      expect(isCreditCardNumber(creditCardNumber)).toBeTruthy();
    });

    test('check credit cardName', () => {
      expect(getCreditCardName(true, creditCardNumber)).toEqual('visa');
    });

    test('check cvv', () => {
      expect(checkCvv('123')).toBeTruthy();
    });

    test('check expire', () => {
      expect(checkExpireDate(12, 25)).toBeTruthy();
    });

    test('check email', () => {
      expect(validate('sample@mail.com', regEmail)).toBeTruthy();
    });
  });

  describe('orderState test', () => {
    test('add order count method should work', () => {
      const orderState = new OrderState(orderList, orderListCount);
      orderState.changeCartCount(false);
      expect(orderState.orderCount).toEqual(4);
    });

    test('pull method should return correct value', () => {
      const orderState = new OrderState(orderList, orderListCount);
      const pull = { count: orderListCount, current: 1, perPage: 5, modal: false };
      expect(orderState.orderPull()).toEqual(pull);
    });

    test('should return order keys', () => {
      const orderState = new OrderState(orderList, orderListCount);
      expect(orderState.getOrderListLength()).toEqual(['1', '2', '3']);
    });

    test('should add new order', () => {
      const orderState = new OrderState(orderList, 3);
      orderState.toggleOrderIdList('4', '40');
      expect(orderState.orderList).toEqual(orderListAdd);
    });

    test('should delete order', () => {
      const orderState = new OrderState(orderList, orderListCount);
      orderState.deleteOrder('1');
      expect(orderState.orderList).toEqual(orderListDeleted);
    });
  });
});
