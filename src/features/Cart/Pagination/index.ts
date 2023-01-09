import './pagination.style.scss';
import { OrderState } from '../../../common/OrderState';

export function createPagination() {
  return `
    <div class='pagination'>
      <select class='pagination__per-page'>
        <option value='5'>5</option>
        <option value='10'>10</option>
      </select>
      <div class='pagination__control'>
        <div class='btn pagination__btn pagination__back'><</div>
        <div class='pagination__current'>1</div>
        <div class='btn pagination__btn pagination__next'>></div>
      </div>
    </div>
  `;
}

export interface IPagination {
  count: number;
  current: number;
  perPage: number;
  modal: boolean;
}

export function checkPaginationRange<T>(current: number, list: Array<T>, perPage: number) {
  return current <= Math.ceil(list.length / perPage);
}

export function getPaginationPull({ count, current, perPage }: IPagination) {
  current = current - 1;
  const start = perPage * current > count ? perPage * (current - 1) : perPage * current;
  const end = perPage + start;
  const final = count >= end ? perPage : count % perPage;
  const pull = new Array(final).fill(start).map((a, key) => {
    return a + key;
  });

  return pull;
}

export const paginationControlListener = (element: Element, orderState: OrderState, textContent: string) => {
  const current = Number(textContent);
  const contain = element.classList.contains('pagination__next');
  const page = contain
    ? checkPaginationRange(current + 1, orderState.getOrderListLength(), ~~orderState.orderPull().perPage)
      ? current + 1
      : current
    : current - 1 !== 0
    ? current - 1
    : current;
  return page;
};
