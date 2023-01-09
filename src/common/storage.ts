import { OrderType } from '../data/dataModal';

export enum EStorageName {
  orderList = 'my_order_list',
  orderCount = 'my_order_count',
  search = 'my_search',
  display = 'my_display',
  discount = 'my_discount',
}

export function updateOrderListCount(id: string, count: string, stock: string) {
  const list = getOrderListStorage();
  if (list) {
    if (count === '0') delete list[id];
    else list[id] = { ...list[id], count: ~~count < ~~stock ? count : stock };
    setOrderListStorage(list);
  }
}

export function addOrderStorage(id: string, count: number, price: string) {
  const list = getOrderListStorage();
  const length = Object.entries(list).length;
  let newList = list;
  if (list[id]) {
    if (count > 0) {
      newList = list
        ? ({
            ...list,
            [id]: {
              count: list[id] ? (Number(list[id].count) + count).toString() : count.toString(),
              price,
            },
          } as Record<string, OrderType>)
        : ({ [id]: { count: count.toString(), price } } as Record<string, OrderType>);
    } else {
      delete newList[id];
      setOrderCountStorage(length !== 0 ? length - 1 : 0);
    }
  } else {
    newList[id] = { count: count.toString(), price };
    setOrderCountStorage(length + 1);
  }
  setOrderListStorage(newList);
}

export function getCountOrderSum() {
  const list = Object.values(getOrderListStorage());
  return list.length
    ? list.reduce((acc, next) => {
        return acc + ~~next.count;
      }, 0)
    : 0;
}

export function setOrderListStorage<T>(list: T) {
  localStorage.setItem(EStorageName.orderList, JSON.stringify(list));
}

export function setOrderCountStorage<T>(count: T) {
  localStorage.setItem(EStorageName.orderCount, JSON.stringify(count));
}

export function getOrderCountStorage() {
  const str = localStorage.getItem(EStorageName.orderCount);
  if (str === null) return 0;
  const count = JSON.parse(str);
  return count ? count : 0;
}

export function clearOrderList() {
  setOrderCountStorage(0);
  setOrderListStorage({});
}

export function getOrderListStorage() {
  const str = localStorage.getItem(EStorageName.orderList);
  if (str === null) return {};
  const list = JSON.parse(str) as Record<string, OrderType>;
  return list ? list : {};
}

export function getDiscountStorage() {
  const display = localStorage.getItem(EStorageName.discount);
  return display ? JSON.parse(display) : {};
}

export function getDiscountArray() {
  const list = getDiscountStorage();
  return Object.values(list).map((a) => Number(a));
}

export function deleteDiscountStorage(str: string) {
  const list = getDiscountStorage();
  str in list ? delete list[str] : '';
  localStorage.setItem(EStorageName.discount, JSON.stringify({ ...list }));
}

export function clearDiscountStorage() {
  localStorage.setItem(EStorageName.discount, JSON.stringify({}));
}

export function setDiscountStorage(str: Record<string, string>) {
  const list = getDiscountStorage();

  localStorage.setItem(EStorageName.discount, JSON.stringify({ ...list, ...str }));
}
