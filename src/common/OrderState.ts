import { OrderType } from '../data/dataModal';

export class OrderState {
  orderList: Record<string, OrderType> | object = {};
  orderCount = 0;
  current = 1;
  limit = 5;
  modal = false;

  constructor(orderList: Record<string, OrderType>, orderCount: number) {
    this.orderList = orderList;
    this.orderCount = orderCount;
  }

  setOrder(list: Record<string, OrderType>, count: number) {
    this.orderList = list;
    this.orderCount = count;
  }

  resetOrder() {
    this.orderList = {};
    this.orderCount = 0;
  }

  calculateCurrent() {
    const count = this.orderCount;
    const current = this.current;
    const perPage = this.limit;
    const start = perPage * current > count ? perPage * (current - 1) : perPage * current;
    const end = perPage + start;
    const final = count >= end ? perPage : count % perPage;
    if (perPage * (current - 1) == count) {
      console.log('equals !', current - 1, Math.floor(count / perPage) + 1);
      this.current = current - 1;
      return current > 1 ? current - 1 : 1;
    }
    if (perPage * (current - 1) + final > count) {
      console.log('grater !', perPage * (current - 1) + final);
      const maxPage = Math.floor(count / perPage) + 1;
      this.current = final !== 0 ? maxPage : maxPage - 1;
      return final !== 0 ? maxPage : maxPage - 1;
    } else {
      console.log('default !', current);
      return current !== 0 ? current : 1;
    }
  }

  orderPull() {
    const count = this.orderCount;
    const perPage = this.limit;
    const modal = this.modal;

    const current = this.calculateCurrent();
    console.log('AAAAAAAA', current);
    return {
      count,
      current,
      modal,
      perPage,
    };
  }

  deleteOrder(id: string) {
    delete (<Record<string, number>>this.orderList)[id.toString()];
  }

  changeCountNotExist(isIncludes: boolean) {
    this.orderCount += isIncludes ? 0 : +1;
    return this.orderCount.toString();
  }

  changeCartCount(isIncludes: boolean) {
    this.orderCount += isIncludes ? -1 : +1;
    return this.orderCount.toString();
  }

  toggleNotExist(id: string, price: string) {
    const flag = id in this.orderList;
    if (this.orderList) {
      flag ? '' : ((<Record<string, { count: string; price: string }>>this.orderList)[id] = { count: '1', price });

      return flag;
    } else this.orderList = { [id]: { count: '1', price } };
    return false;
  }

  toggleOrderIdList(id: string, price: string) {
    const flag = id in this.orderList;
    if (this.orderList) {
      flag
        ? delete (<Record<string, number>>this.orderList)[id]
        : ((<Record<string, { count: string; price: string }>>this.orderList)[id] = { count: '1', price });

      return flag;
    } else this.orderList = { [id]: { count: '1', price } };
    return false;
  }

  getOrderListLength() {
    const keys = Object.keys(this.orderList);
    return keys;
  }
}
