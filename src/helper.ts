import { parseCatalogQuery } from './common/routing';
import createCatalog from './features/Catalog/catalog';
import { createForm } from './features/Filter/filter';
import { createLayout } from './features/Layout/layout';
import { IProduct } from './data/dataModal';
import { IKeyForProduct, keysForProduct } from './features/Product';
import { calcSum, checkDiscount, getDiscountList } from './features/Cart/cart';
import { getCountOrderSum, getDiscountStorage } from './common/storage';

export function stringToFragment(element: string) {
  const renderer = document.createElement('template');
  renderer.innerHTML = element;
  return renderer.content;
}

export function initBody(data: IProduct[]) {
  const body = <Element>document.querySelector('body');
  body.innerHTML = createLayout();
  const main = <Element>document.querySelector('.content__catalog');
  main.append(stringToFragment(createForm(data, parseCatalogQuery(data))), stringToFragment(createCatalog()));
}

export function getDescriptionElementList(block: Document) {
  return keysForProduct.reduce<IKeyForProduct>((acc, next) => {
    const element = block.querySelector(`.feature__${next}`) as Element;
    return { ...acc, [next]: element };
  }, {} as IKeyForProduct);
}

export function updateInfo() {
  const cartCount = <Element>document.querySelector('.info__count');
  const cartSum = <Element>document.querySelector('.info__sum');
  const discountList = <Element>document.querySelector('.discount__list');
  const discountSum = <Element>document.querySelector('.form-calc__discount');
  const cartTotalSum = <Element>document.querySelector('.form-calc__sum');
  const wholeCount = <Element>document.querySelector('.whole-count');

  return () => {
    discountList.innerHTML = getDiscountList();
    cartTotalSum.innerHTML = calcSum([]).toString();
    wholeCount.innerHTML = 'Count ' + getCountOrderSum().toString() + ' ';
    cartSum.innerHTML = calcSum([]).toString();
    cartCount.innerHTML = getCountOrderSum().toString();
    discountSum.innerHTML = 'Lower: ' + calcSum(Object.values(getDiscountStorage())).toString() + '$';
    !checkDiscount() ? discountSum.classList.add('hide') : discountSum.classList.remove('hide');
    checkDiscount() ? cartTotalSum.classList.add('old') : cartTotalSum.classList.remove('old');
  };
}
