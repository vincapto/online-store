import { OrderState } from './OrderState';
import { IBtnId } from './model';
import { ContentContainerType } from './routing';
import { addOrderStorage, getOrderListStorage } from './storage';

export function toggleAddBtn(btn: IBtnId, orderState: OrderState) {
  const {
    dataset: { id, price },
  } = btn;
  const isIncludes = orderState.toggleOrderIdList(id, price);
  isIncludes ? addOrderStorage(id, -1, price) : addOrderStorage(id, 1, price);
  const text = !isIncludes ? 'Remove' : 'Add';
  btn.textContent = text;
  btn.classList.toggle('active');
  return orderState.changeCartCount(isIncludes);
}

export function buyRedirect(btn: IBtnId, orderState: OrderState) {
  const {
    dataset: { id, price },
  } = btn;
  const isIncludes = orderState.toggleNotExist(id, price);
  isIncludes ? '' : addOrderStorage(id, 1, price);
  return orderState.changeCountNotExist(isIncludes);
}

export function getPageContainer(block: Document) {
  const cart = block.querySelector('.content__cart');
  const product = block.querySelector('.content__product');
  const catalog = block.querySelector('.content__catalog');
  const notFound = block.querySelector('.content__notFound');
  return { cart, product, catalog, notFound };
}

export function hidePageContainer(name: string, pageContainer: ContentContainerType) {
  const entries = Object.entries(pageContainer);
  entries.forEach((item) => {
    const [key, value] = item;
    if (name === key) {
      value?.classList.remove('hide');
    } else if (!value?.classList.contains('hide')) value?.classList.add('hide');
  });
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
