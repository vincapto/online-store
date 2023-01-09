import { ICartOrder, OrderType } from './../data/dataModal';
import { productTulip } from './../features/Filter/components/Search/index';
import { MinMaxType, IDoubleRangeInput } from './model';
import { IProduct, ProductKeyType } from '../data/dataModal';
import { SortType, sortBy } from '../features/Catalog/components/SelectSort';
import { ICard } from '../features/Catalog/components/Card';
import { checkboxTitleList } from '../features/Filter/components/Checkbox/index';
import {
  rangeTitleList,
  getRangeSliders,
  initRangeListener,
  updateDoubleRange,
} from '../features/Filter/components/DoubleRange/index';
import { OrderState } from './OrderState';
import { parseCatalogQuery } from './routing';

export class CatalogState {
  productList: IProduct[] | [] = [];
  initialList: IProduct[] | [] = [];
  sort: SortType;
  checkList: Record<string, string[]> | null = null;
  current = 1;
  rangeState: MinMaxType = {};
  query = '';
  rangeSliders: NodeListOf<IDoubleRangeInput>[];
  checkboxType = checkboxTitleList;
  limit = 5;
  orderState: OrderState;
  reducedObj: Record<string, IProduct>;
  existNames;

  constructor(data: IProduct[], initialSort: SortType, orderState: OrderState) {
    this.initialList = data;
    this.productList = data;
    this.sort = initialSort;
    this.existNames = this.getAllNames(data);
    this.resetCheckboxList();
    this.reducedObj = this.reduceToObject(data);
    this.checkList = parseCatalogQuery(data);
    this.orderState = orderState;
    this.rangeSliders = getRangeSliders();
    rangeTitleList.forEach((a, key) => initRangeListener(a, this.rangeSliders[key], this.setRangeState.bind(this)));
  }

  reduceToObject(data: IProduct[]) {
    return data.reduce((acc, next) => {
      return { ...acc, [next.id]: next };
    }, {});
  }

  getAllNames(data: IProduct[]) {
    return data.reduce<string[]>((acc, next) => {
      acc.push(next.brand);
      acc.push(next.category);
      return acc;
    }, []);
  }

  checkIfProductExists(id: number) {
    return id in this.reducedObj;
  }

  setRangeState(type: string, min: string, max: string) {
    this.rangeState[type] = { min, max };
  }

  checkIsOrdered(id: number) {
    const keys = Object.keys(this.orderState.orderList);
    return keys.includes(id.toString());
  }

  getProductCard(id: number) {
    const item = this.filterById(id);
    return item ? { ...item, ordered: this.checkIsOrdered(id) } : null;
  }

  sortProductList() {
    const list = this.productList.sort(sortBy(this.sort)).map((item) => {
      const keys = Object.keys(this.orderState.orderList);
      const ordered = keys.includes(item.id.toString());
      return { ...item, ordered } as ICard;
    });

    return list;
  }

  checkCheckboxList() {
    if (this.checkList)
      return Object.keys(this.checkList).filter((a) => {
        const item = (<Record<string, string[]>>this.checkList)[a];
        return item !== undefined && item.length > 0;
      });
    return [];
  }

  getOrderList() {
    const keys = Object.keys(this.orderState.orderList);
    const list = this.initialList
      ?.filter(({ id }) => {
        return keys?.includes(id.toString());
      })
      .map((a) => {
        const count = (<Record<string, OrderType>>this.orderState.orderList)[a.id.toString()];
        return { ...a, order: { ...count } } as ICartOrder;
      });
    return list;
  }

  filterCheckboxCallback(item: IProduct) {
    return (a: ProductKeyType) => {
      const name = a as ProductKeyType;
      const my = item[name].toString().toLowerCase() as string;
      const list = <Record<string, string[]>>this.checkList;
      return list[name] ? (<Record<string, string[]>>this.checkList)[name].includes(my) : false;
    };
  }

  filterByCheckbox() {
    if (this.checkList === null) return this.initialList;
    if (this.checkCheckboxList().length === 0) return this.initialList;
    const res = this.initialList.filter((item) => {
      const filter =
        this.checkCheckboxList().length > 1
          ? this.checkboxType.every(this.filterCheckboxCallback(item))
          : this.checkboxType.some(this.filterCheckboxCallback(item));
      return filter;
    });
    return res;
  }

  resetCheckboxList() {
    this.checkList = null;
  }

  setRangeValue(name: string, min: string, max: string) {
    const slider = <NodeListOf<IDoubleRangeInput>>document.querySelectorAll(`.range__${name}`);
    slider[0].value = min;
    slider[1].value = max;
  }

  filterByRange() {
    const entries = Object.entries(this.rangeState);
    this.productList = entries.reduce<IProduct[]>((acc: IProduct[], item) => {
      const [key, value] = item;
      acc = this.checkRange(acc, key as ProductKeyType, Number(value.min), Number(value.max));
      return acc;
    }, this.productList);
  }

  filterBySearchQuery() {
    if (this.query !== '') {
      return this.productList.filter((item) => {
        return this.checkProp(item, this.query);
      });
    } else {
      return this.productList;
    }
  }

  checkProp(product: IProduct, query: string) {
    const res = Object.entries(product).some((item: productTulip) => {
      if (item[0] === 'id' || item[0] === 'thumbnail' || item[0] === 'images') return false;
      return item[1].toString().toLowerCase().includes(query.toLowerCase());
    }, []);
    return res;
  }

  filterById(id: number) {
    const found = this.initialList.filter((item) => {
      return item.id === id;
    });
    return found ? found[0] : null;
  }

  checkRange(acc: IProduct[], name: ProductKeyType, min: number, max: number): IProduct[] {
    return acc.filter((item) => {
      return item[name] >= min && item[name] <= max;
    });
  }

  toggleCheckboxList(title: string, name: string, checked: boolean) {
    if (!this.checkList) this.checkList = { [title]: [name] };
    if (this.checkList[title]) {
      checked
        ? this.checkList[title].indexOf(name) < 0
          ? this.checkList[title].push(name)
          : ''
        : this.checkList[title].splice(this.checkList[title].indexOf(name), 1);
    } else {
      this.checkList[title] = [name];
    }
  }

  parseCatalogList(callback: (d: ICard) => string) {
    this.productList = this.filterByCheckbox();
    this.productList = this.filterBySearchQuery();
    updateDoubleRange(this.productList, this.rangeSliders, this.setRangeState.bind(this));
    this.filterByRange();
    const sorted = this.sortProductList();
    return sorted.map(callback);
  }
}
