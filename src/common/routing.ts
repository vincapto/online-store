import { MinMaxType } from './model';
import { CatalogState } from './CatalogState';
import { hidePageContainer } from './helper';
import { SortType, sortName } from '../features/Catalog/components/SelectSort';
import { updateProduct } from '../features/Product';
import { getDescriptionElementList } from '../helper';
import { OrderState } from './OrderState';
import { toggleDisplay } from '../features/Catalog/catalog';
import { IProduct } from '../data/dataModal';
import dataCatalog from '../data/data';
import { getOrderCountStorage } from './storage';

export interface IRoute {
  product: string;
  cart: string;
  catalog: string;
  notFound: string;
}

export type RouteType = keyof IRoute;

export const routesPath: IRoute = {
  product: 'product',
  cart: 'cart',
  catalog: 'catalog',
  notFound: 'notFound',
};

export type ContentContainerType = Record<string, Element | null>;

export function checkEmptyOrder() {
  const empty = <Element>document.querySelector('.cart__empty');
  const cart = <Element>document.querySelector('.cart');

  getOrderCountStorage() === 0 ? cart?.classList.add('hide') : cart?.classList.remove('hide');
  getOrderCountStorage() !== 0 ? empty?.classList.add('hide') : empty?.classList.remove('hide');
}

function showModal(orderState: OrderState) {
  const modal = <Element>document.querySelector('.modal');
  orderState.modal ? modal.classList.add('show-modal') : modal.classList.remove('show-modal');
}

export const handleLocation = (
  pageContainer: ContentContainerType,
  catalogState: CatalogState,
  callbackUpdate: () => void,
  orderState: OrderState
) => () => {
  const path = window.location.pathname;
  const [root, id] = path.replaceAll('/', ' ').trim().split(' ') as [RouteType | '', number | undefined];
  const key = root !== '' ? root : 'catalog';
  const catalogList = <Element>document.querySelector('.catalog__list');
  const selectPage = <HTMLInputElement>document.querySelector('.pagination__per-page');
  console.log('ROUTING____', window.location.pathname, root);

  switch (key) {
    case 'catalog':
      console.log('CALL LOCATION CATALOG');
      orderState.current = 1;
      catalogState.checkList = parseCatalogQuery(dataCatalog.products);
      catalogState.query = parseSearch();
      catalogState.sort = parseSort();
      toggleDisplay(parseDisplay(), catalogList);
      hidePageContainer(key, pageContainer);
      callbackUpdate();
      selectPage.value = '5';
      break;
    case 'cart':
      console.log('CALL LOCATION CART');
      hidePageContainer(key, pageContainer);
      parseCartQuery(orderState);
      showModal(orderState);
      checkEmptyOrder();
      break;
    case 'product':
      console.log('CALL LOCATION PRODUCT');
      if (id && catalogState.checkIfProductExists(id)) {
        updateProduct(catalogState.getProductCard(Number(id)), getDescriptionElementList(document));
        hidePageContainer(routesPath.product, pageContainer);
      } else hidePageContainer(routesPath.notFound, pageContainer);
      break;
    default:
      hidePageContainer(routesPath.notFound, pageContainer);
      break;
  }
};

export function getQuery() {
  return new URLSearchParams(window.location.search);
}

export function pushRout(path: string) {
  window.history.pushState({}, path, window.location.origin + path);
}

export function updateRangeQuery(name: string, min: string, max: string) {
  const searchParams = new URLSearchParams(window.location.search);
  const range = `${min},${max}`;
  searchParams.set(name, range);
  pushRout(`/?${searchParams.toString()}`);
}

function getRange(str: string[]) {
  return str.reduce<MinMaxType>((acc, next) => {
    const query = getQuery().get(next)?.split(',') as string[];
    const range = query?.filter((a) => a !== undefined).length > 0 ? { min: query[0], max: query[1] } : null;
    return range ? { ...acc, [next]: range } : acc;
  }, {});
}

export function checkRange(item: { min: string; max: string }) {
  const { min, max } = item;
  const minValue = Number(min) >= 0 && Number(min) <= 100 ? min : 0;
  const maxValue = Number(max) >= 0 && Number(max) <= 100 ? max : 100;
  return { min: minValue.toString(), max: maxValue.toString() };
}

export function parseRange(catalogState: CatalogState) {
  const rangeList = getRange(['price', 'rating']);
  const keys = Object.keys(rangeList);
  keys.forEach((a) => {
    const { max, min } = checkRange(rangeList[a]);
    catalogState.setRangeValue(a, min, max);
  });
  return keys;
}

function getCheckbox(str: string[], names: string[]) {
  return str.reduce((acc, next) => {
    const list = getQuery()
      .get(next)
      ?.split(',')
      .filter((a) => {
        return names.find((b) => a.toLowerCase() === b.toLowerCase());
      });
    return { ...acc, [next]: list !== undefined ? list : [] };
  }, {});
}

export function updateCheckQuery(query: string, name: string) {
  if (query === '') return name.toLowerCase();
  const list = query.split(',').map((a) => a.toLowerCase());
  list?.includes(name) ? list.splice(list.indexOf(name.toLowerCase()), 1) : list.push(name.toLowerCase());
  return list.join(',');
}

export function parseCatalogQuery(data: IProduct[]) {
  const names = data.reduce<string[]>((acc, next) => {
    acc.push(next.brand);
    acc.push(next.category);
    return acc;
  }, []);
  const checkboxList = getCheckbox(['brand', 'category'], names);
  return checkboxList ? checkboxList : null;
}

export function updateSearchQuery(name: string, query: string) {
  const searchParams = new URLSearchParams(window.location.search);
  if (query !== '') searchParams.set(name, query);
  else searchParams.delete(name);
  pushRout(`/?${searchParams.toString()}`);
}

export function parseSearch() {
  const search = getQuery().get('search') as string;
  return search ? search : '';
}

export function updateDisplayQuery(query: boolean) {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set('display', query.toString());
  pushRout(`/?${searchParams.toString()}`);
}

export function parseDisplay() {
  const display = <string>getQuery().get('display');
  return display === 'false' ? display : 'true';
}

export function updateSortQuery(query: string) {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set('sort', query.toString());
  pushRout(`/?${searchParams.toString()}`);
}

export function parseSort() {
  const sort = getQuery().get('sort');
  const [name, type] = sort ? sort.split('_') : ['', ''];
  if (name && type) {
    const list = sortName.filter((a) => name === a);
    const second = type === 'asc' || type === 'desc';
    return list.length !== 0 && second ? <SortType>sort : <SortType>'price_asc';
  } else return <SortType>'price_asc';
}

export function updateCartQuery(name: string, value: string) {
  const searchParams = new URLSearchParams(window.location.search);
  value !== '' ? searchParams.set(name, value.toString()) : '';
  pushRout(`/cart?${searchParams.toString()}`);
}

export function parseCartQuery(orderState: OrderState) {
  const page = getQuery().get('page');
  const limit = getQuery().get('limit');
  const modal = getQuery().get('modal');

  const obj = {
    page: page && page !== '' ? page : 1,
    limit: limit && limit !== '' ? limit : 5,
    modal: modal && modal !== 'false' ? true : false,
  };
  orderState.current = ~~obj.page;
  orderState.limit = ~~obj.limit;
  orderState.modal = obj.modal;
}
