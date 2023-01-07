import { IProduct, ProductKeyType } from '../../../../data/dataModal';
import './selectSort.style.scss';

export const sortName = ['rating', 'price', 'discountPercentage'];
export const initSort = <SortType>'price_asc';
export interface ISortType {
  asc: number;
  desc: number;
}
export type SortType = keyof ISortType;
export const sortFrom: ISortType = { asc: 1, desc: -1 };

function selectSort() {
  return `
    <div class='sort'>
      <select class='sort__select'>
        ${createSelectListOption(sortName)}
      </select>
    </div>
  `;
}

const createSelectListOption = (nameList: string[]) => {
  const keys = Object.keys(sortFrom);
  return nameList
    .map((name) => {
      return keys.map((key) => createSelectOption(name, key)).join('');
    })
    .join('');
};

export function sortBy(sort: SortType) {
  return (a: IProduct, b: IProduct) => {
    const [name, type] = sort ? (sort.split('_') as [ProductKeyType, SortType]) : [];
    if (name && type && typeof a[name] === 'number' && typeof b[name] === 'number') {
      const first = Number(a[name]);
      const second = Number(b[name]);
      return sortFrom[type] > 0 ? first - second : second - first;
    }
    return 1;
  };
}

const createSelectOption = (name: string, type: string) => {
  return `
    <option value="${name}_${type}">${name} ${type}</option>
  `;
};

export default selectSort;
