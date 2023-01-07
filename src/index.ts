import { initBody, updateInfo, stringToFragment } from './helper';
import { toggleDisplay } from './features/Catalog/catalog';
import { products } from './data/data';
import { createCatalogCard } from './features/Catalog/components/Card/index';
import { IDisplayItem, IBtnId, IDiscountItem } from './common/model';
import { filterListener } from './features/Filter/components/Checkbox';
import { CatalogState } from './common/CatalogState';
import { OrderState } from './common/OrderState';
import { ISortType, initSort } from './features/Catalog/components/SelectSort';
import notFountProduct from './features/Catalog/components/NotFound/index';
import { toggleAddBtn, getPageContainer, buyRedirect } from './common/helper';
import {
  clearOrderList,
  deleteDiscountStorage,
  getOrderCountStorage,
  getOrderListStorage,
  setDiscountStorage,
} from './common/storage';
import { parseSearch, updateSortQuery, parseSort, pushRout, parseCartQuery, updateCartQuery } from './common/routing';
import { handleLocation, parseDisplay, updateDisplayQuery, updateSearchQuery } from './common/routing';
import { createProduct, getSrcFromSlider } from './features/Product';
import { PROMO_ARR, cartListener, createCart, getDiscountList, updateCart } from './features/Cart/cart';
import { paginationControlListener } from './features/Cart/Pagination';
import { checkSubmitForm, triggerError, updateErrorLabel } from './features/Modal/validation';
import { clearDiscountStorage } from './common/storage';
import { createModal } from './features/Modal/modal';
import { parseRange } from './common/routing';

const productList = products.slice(0, 21);

export function updateCatalogList() {
  const list = catalogState.parseCatalogList(createCatalogCard);
  const content = list.length > 0 ? list.join('').toString() : notFountProduct();
  catalogProductFound.innerHTML = list.length.toString();
  catalogList.innerHTML = content;
}

initBody(productList);

const orderState = new OrderState(getOrderListStorage(), getOrderCountStorage());

const catalogState = new CatalogState(productList, initSort, orderState);

const onPopstate = handleLocation(getPageContainer(document), catalogState, updateCatalogList, orderState);

const singleContainer = document.querySelector('.content__product');
(<Element>singleContainer).innerHTML = createProduct(products[0]);
const productElement = <Element>document.querySelector('.product');

const cartContainer = document.querySelector('.content__cart');
(<Element>cartContainer).innerHTML = createCart();
const cartList = <Element>document.querySelector('.cart__list');

(<Element>cartContainer).append(stringToFragment(createModal()));

const discountInput = <HTMLInputElement>document.querySelector('.discount-input');

const showFilterForm = <Element>document.querySelector('.filter-form__show');

const modal = <Element>document.querySelector('.modal');
const logoList = document.querySelectorAll('.logo-link');
const btnCopy = <Element>document.querySelector('.btn_copy');
const btnReset = document.querySelector('.btn_reset');

const btnModal = document.querySelector('.btn_modal');
const btnSubmit = document.querySelector('.btn_submit');

const cartConfirmedTimer = <Element>document.querySelector('.confirmed__timer');
const cartConfirmed = <Element>document.querySelector('.cart__confirmed');

const discountBtn = <Element>document.querySelector('.btn_discount');
const discountList = <Element>document.querySelector('.discount__list');

const validationState = checkSubmitForm(document);

const catalog = <Element>document.querySelector('.catalog');
const cart = <Element>document.querySelector('.info');
const catalogList = <Element>document.querySelector('.catalog__list');
const filterForm = <Element>document.querySelector('.filter-form');
const searchInput = <HTMLInputElement>document.querySelector('.search__input');
const catalogDisplay = <Element>document.querySelector('.display');
const sortSelect = <HTMLSelectElement>document.querySelector('.sort__select');
const catalogProductFound = <Element>document.querySelector('.catalog__found-count');

const paginationControl = <Element>document.querySelector('.pagination__control');
const paginationPerPageElement = <HTMLSelectElement>document.querySelector('.pagination__per-page');
const paginationCurrent = <Element>document.querySelector('.pagination__current');

toggleDisplay(parseDisplay(), catalogList);
searchInput.value = parseSearch();
sortSelect.value = parseSort() ? parseSort() : initSort;
parseCartQuery(orderState);
parseRange(catalogState);
paginationCurrent.textContent = orderState.current.toString();
paginationPerPageElement.value = orderState.limit.toString();

cartList.innerHTML = updateCart(catalogState.getOrderList(), orderState.orderPull());

window.onpopstate = onPopstate;
onPopstate();

const updateCartInfo = updateInfo();
updateCartInfo();
(<Element>cartList).addEventListener('click', (e) => {
  cartListener(e, cartList, catalogState, orderState, updateCartInfo, onPopstate);
});

logoList.forEach((a) => {
  a.addEventListener('click', () => {
    pushRout('/');
    onPopstate();
  });
});

showFilterForm.addEventListener('click', (e) => {
  filterForm.classList.toggle('filter-form--active');
  showFilterForm.textContent?.includes('Filter')
    ? (showFilterForm.textContent = 'Close')
    : (showFilterForm.textContent = 'Filter');
});

function resetAll() {
  const checkboxList = document.querySelectorAll('input[type=checkbox]');
  const rangeList = catalogState.rangeSliders;
  checkboxList.forEach((item) => {
    const element = <HTMLInputElement>item;
    element.checked = false;
    catalogState.resetCheckboxList();
  });
  rangeList.forEach((item) => {
    item[0].value = '0';
    item[1].value = '100';
  });
}

btnReset?.addEventListener('click', () => {
  resetAll();
  const list = ['price', 'brand', 'category', 'rating'];
  const searchParams = new URLSearchParams(window.location.search);
  list.forEach((a) => searchParams.delete(a));
  pushRout(`/?${searchParams.toString()}`);
  onPopstate();
});

let timerCopy: null | NodeJS.Timeout = null;

btnCopy?.addEventListener('click', (e) => {
  navigator.clipboard.writeText(window.location.href);
  btnCopy.textContent = 'Copied!';
  if (timerCopy === null) {
    timerCopy = setTimeout(() => {
      btnCopy.textContent = 'Copy';
      timerCopy = null;
    }, 400);
  }
});

modal?.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('show-modal');
    updateCartQuery('modal', 'false');
  }
});

btnModal?.addEventListener('click', () => {
  modal.classList.toggle('show-modal');
  updateCartQuery('modal', 'true');
});

discountInput.addEventListener('input', (e) => {
  const element = <HTMLInputElement>e.target;
  const discountLabel = <Element>document.querySelector('.error-card-discount');
  element.value !== '' ? (discountLabel.textContent = '') : '';
});

discountBtn.addEventListener('click', () => {
  const element = discountInput.value;
  element && PROMO_ARR[element] ? setDiscountStorage({ [element]: PROMO_ARR[element] }) : '';
  discountList.innerHTML = getDiscountList();
  updateCartInfo();
  const discountLabel = <Element>document.querySelector('.error-card-discount');
  PROMO_ARR[element] ? '' : updateErrorLabel(discountLabel, 'No such a promo');
  discountInput.value === '' ? updateErrorLabel(discountLabel, 'Discount is empty') : '';
});

discountList.addEventListener('click', (e) => {
  const element = e.target as IDiscountItem;
  if (element.classList.contains('discount__delete')) {
    deleteDiscountStorage(element.dataset.discount);
    discountList.innerHTML = getDiscountList();
    updateCartInfo();
  }
});

productElement.addEventListener('click', (e) => {
  const element = <IBtnId>e.target;
  if (element.classList.contains('slide')) getSrcFromSlider(e);
  if (element.classList.contains('btn_add')) {
    toggleAddBtn(element, orderState);
    updateCartInfo();
  }
  if (element.classList.contains('btn_buy')) {
    console.log(catalogState.getOrderList(), orderState.orderPull());
    buyRedirect(element, orderState);
    console.log(catalogState.getOrderList(), orderState.orderPull());
    updateCartInfo();
    (<Element>cartList).innerHTML = updateCart(catalogState.getOrderList(), orderState.orderPull());
    pushRout('/cart?modal=true');
    onPopstate();
  }
});

paginationPerPageElement.addEventListener('change', () => {
  orderState.limit = ~~paginationPerPageElement.value;
  updateCartQuery('limit', paginationPerPageElement.value);
  (<Element>cartList).innerHTML = updateCart(catalogState.getOrderList(), orderState.orderPull());
  paginationCurrent.textContent = orderState.orderPull().current.toString();
  updateCartQuery('page', orderState.orderPull().current.toString());
});

cart?.addEventListener('click', () => {
  cartList.innerHTML = updateCart(catalogState.getOrderList(), orderState.orderPull());
  pushRout(`/cart`);
  onPopstate();
});

catalog?.addEventListener('click', (e: Event) => {
  const element = e.target as IBtnId;
  if (element.classList.contains('btn_add')) {
    toggleAddBtn(element, orderState);
    updateCartInfo();
  }
  if (element.classList.contains('btn_show')) {
    pushRout(`/product/${element.dataset.id}`);
    onPopstate();
  }
});

catalogDisplay?.addEventListener('click', (e) => {
  const element = e.target as IDisplayItem;
  if (element.classList.contains('display__block')) {
    toggleDisplay(element.dataset.display, catalogList);
    updateDisplayQuery(element.dataset.display === 'true');
  }
});

filterForm?.addEventListener('change', (e: Event) => {
  filterListener(e, catalogState);
  updateCatalogList();
});

sortSelect?.addEventListener('change', (e) => {
  const value = (<HTMLSelectElement>e?.target).value as keyof ISortType;
  catalogState.sort = value;
  updateSortQuery(value);
  updateCatalogList();
});

searchInput?.addEventListener('input', () => {
  const query = (searchInput as HTMLInputElement).value;
  catalogState.query = query;
  updateSearchQuery('search', query);
  updateCatalogList();
});

let timer: NodeJS.Timeout | null = null;
let interval: NodeJS.Timeout | null = null;

const timerCallback = () => {
  if (window.location.pathname.includes('cart')) {
    pushRout('/');
    onPopstate();
  }
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
};

function updateTimerElement(second: number) {
  cartConfirmedTimer.textContent = `Redirect in ${second}s`;
}

const intervalCallback = (start: number) => {
  const now = Math.ceil((Date.now() - start) / 1000);
  const count = 4 - now;
  if (count === 0 && interval) {
    clearInterval(interval);
    cartConfirmed.classList.add('hide');
  }
  updateTimerElement(count);
};

btnSubmit?.addEventListener('click', () => {
  const state = Object.values(validationState).every((a) => a);
  if (state && timer === null) {
    clearOrderList();
    clearDiscountStorage();
    timer = setTimeout(timerCallback, 3000);
    updateTimerElement(3);
    interval = setInterval(intervalCallback, 1000, Date.now());
    cartConfirmed.classList.remove('hide');
    modal.classList.remove('show-modal');
    updateCartInfo();
    cartList.innerHTML = 'Order list empty!';
    updateCatalogList();
    const cartHide = <Element>document.querySelector('.cart');
    const cartEmpty = <Element>document.querySelector('.cart__empty');
    cartHide.classList.add('hide');
    cartEmpty.classList.remove('hide');
    resetAll();
    orderState.resetOrder();
  }

  if (!state) {
    triggerError(document, validationState);
  }
});

paginationControl.addEventListener('click', (e) => {
  if ((<Element>e.target).classList.contains('btn')) {
    const element = e.target as Element;
    const page = paginationControlListener(element, orderState, <string>paginationCurrent.textContent);
    updateCartQuery('page', page.toString());
    orderState.current = orderState.orderPull().current !== page ? page : orderState.orderPull().current;
    paginationCurrent.textContent = page.toString();

    cartList.innerHTML = updateCart(catalogState.getOrderList(), orderState.orderPull());
  }
});
