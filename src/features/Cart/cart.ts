import './cart.style.scss';
import { CatalogState } from '../../common/CatalogState';
import { ICartItem } from '../../common/model';
import {
  getDiscountStorage,
  getOrderListStorage,
  setOrderCountStorage,
  updateOrderListCount,
  getOrderCountStorage,
} from '../../common/storage';
import { ICartOrder, OrderType } from '../../data/dataModal';
import { IPagination, createPagination, getPaginationPull } from './Pagination';
import { OrderState } from '../../common/OrderState';
import { checkEmptyOrder, updateCartQuery } from '../../common/routing';

export const PROMO_ARR: Record<string, string> = { RS: '0.1', EPM: '0.2' };

export function checkDiscount() {
  return Object.keys(getDiscountStorage()).length > 0;
}

function getSum() {
  return calcSum(Object.values(getDiscountStorage())).toString() + '$';
}

export function createCart() {
  return `
    <div class='cart ${getOrderCountStorage() ? '' : 'hide'}'>
      
      <div class='cart__list-wrapper'>
        ${createPagination()}
        <div class='cart__list'></div>
      </div>

      
      <div class='form-calc'>
        <div class='discount-input__wrapper'>
          <input type='text' class='discount-input' placeholder='Enter promo RS or EPM' value=''/>
          <label class='error error-card-discount'></label>
        </div>
        <div style='display: flex; flex-direction: column;'>
          <div class='whole-count'>Count: </div>
          <div class='calc-sum' >Sum:
            <span class='form-calc__sum ${checkDiscount() ? 'old' : ''}' >${calcSum([])}</span>$
          </div> 
        </div>
        <div class='calc-sum'>
          <div class='form-calc__discount discount ${checkDiscount() ? '' : 'hide'}'>${getSum()}$</div>
        </div> 
        <div class='discount__list'>
          ${getDiscountList()}
        </div>
        <div class='btn btn_discount'>Add Discount</div>
        <div class='btn btn_modal'>Buy</div>
      </div>
    </div>
    <div class='hide block cart__confirmed'>
        <span class='confirmed__text'>Order Confirmed</span>
        <span class='confirmed__timer'></span>
      </div>
    <div class='cart__empty ${getOrderCountStorage() ? 'hide' : ''}'>Order list is empty</div>
  `;
}

export function updateCart(data: ICartOrder[], pull: IPagination) {
  if (data.length === 0) return `<div>Order list empty</div>`;
  const list = getPaginationPull(pull);
  return `
    ${list.map((a: number, key: number) => createCartItem(data[a], key, pull.perPage * (pull.current - 1))).join('')}
  `;
}

export function calcSum(discount: number[]) {
  const sum = Object.values(getOrderListStorage()).reduce<number>((acc, next) => {
    const { count, price } = next as { price: string; count: string };
    return acc + ~~count * ~~price;
  }, 0);
  return discount.length !== 0
    ? (
        sum -
        discount.reduce((acc, next) => {
          return acc + Number(next);
        }, 0) *
          sum
      ).toFixed(2)
    : sum;
}

export function getDiscountList() {
  const list = Object.entries(getDiscountStorage());
  return list.length && list.length > 0
    ? list
        .map((item) => {
          const [key, value] = item as [string, string];
          return createDiscountItem(key, value);
        })
        .join('')
    : '';
}

export function createDiscountItem(name: string, percentage: string) {
  return `
    <div class='discount__item'>
      <div class='discount__name'>${name}</div>
      <div class='discount__percentage'>${+percentage * 100}%</div>
      <div class='discount__delete btn' data-discount='${name}'>X</div>
    </div>
  `;
}

export const createCartItem = (
  { price, title, id, thumbnail, order, stock, brand, category, rating }: ICartOrder,
  index: number,
  current: number
) => {
  return `
    <div class='block cart__item''>
      <div class='cart__item-number'>${index + 1 + current}</div>
      <img class='cart__item-img' src='${thumbnail}'/>
      <div class='cart__item-info'>
        <div class='cart__item-description'>
          <h4 class='cart__item-name'><a href=${window.location.origin + `/product/${id}`}>${title}</a></h4>
          <span class='cart__item-category'><label>Category: </label>${category}</span>
          <span class='cart__item-brand'><label>Brand: </label>${brand}</span>
          <span class='cart__item-price'><label>Price: </label>${price} $</span>
          <span class='cart__item-stock'><label>Stock: </label>${stock}</span>
          <span class='cart__item-rating'><label>Rating: </label>${rating}</span>
          <div>
            Total sum:<span class='cart__item-total' data-id='${id}'>${price * Number(order.count)}$</span>
          </div>
        </div>
        <div class='cart__switch'>
            <div class='btn btn_add' data-stock='${stock}' data-id='${id}'>+</div>
            <div class='cart__item-count' data-id=${id}>${order.count}</div>
            <div class='btn btn_div' data-stock='${stock}' data-id='${id}'>-</div>
        </div>
      </div>
    </div>
  `;
};

export function cartListener(
  e: Event,
  cartList: Element,
  catalogState: CatalogState,
  orderState: OrderState,
  cartInfoUpdate: () => void,
  routingCallback: () => void
) {
  if (e.target !== null && (<Element>e.target).classList.contains('btn')) {
    const element = e.target as ICartItem;
    const id = element.dataset.id;
    const stock = element.dataset.stock;
    const countElement = <ICartItem>cartList.querySelector(`.cart__item-count[data-id='${id}']`);

    const totalSumElement = <Element>cartList.querySelector(`.cart__item-total[data-id='${id}']`);
    const count = Number(countElement.textContent);
    let amount = '0';
    if (!element.classList.contains('btn_div')) {
      amount = count < ~~stock ? (count + 1).toString() : count.toString();
    } else {
      amount = count < 0 ? '0' : (count - 1).toString();
    }
    countElement.textContent = amount;
    updateOrderListCount(id, amount, stock);
    const order = <Record<string, OrderType>>orderState.orderList;
    const total = Number(order[id].price) * Number(amount);
    totalSumElement.textContent = id in orderState.orderList ? `${total.toString()}$` : `${order[id].price}$`;
    cartInfoUpdate();

    order[id].count = amount;

    if (amount === '0') {
      orderState.orderCount = orderState.orderCount - 1;
      orderState.deleteOrder(id);
      setOrderCountStorage(orderState.orderCount);
      (<Element>cartList).innerHTML = updateCart(catalogState.getOrderList(), orderState.orderPull());
      checkEmptyOrder();
      const paginationCurrent = <Element>document.querySelector('.pagination__current');
      paginationCurrent.textContent = orderState.orderPull().current.toString();
      updateCartQuery('page', orderState.orderPull().current.toString());
    }

    const pullLength = getPaginationPull(orderState.orderPull()).length;
    if (pullLength === 0) {
      const pageBack = orderState.current - 1 !== 0 ? orderState.current - 1 : orderState.current;
      updateCartQuery('page', pageBack.toString());
      routingCallback();

      (<Element>cartList).innerHTML = updateCart(catalogState.getOrderList(), orderState.orderPull());
    }
  }
}
