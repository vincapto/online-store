import { IProduct, ProductValueType } from '../../../../data/dataModal';
import './search.style.scss';

export const createSearchBar = () => {
  return `
      <div class='search'>
        <input 
          type='text' 
          class='search__input input'
          placeholder='Search'
        />
      </div>`;
};

export type productTulip = [string, ProductValueType];

export function searchQuery(productList: IProduct[], query = '') {
  if (query !== '') {
    return productList.filter((item) => {
      return checkProp(item, query);
    });
  } else {
    return productList;
  }
}

function checkProp(product: IProduct, query: string) {
  const rg = new RegExp('\\b' + query.toLowerCase() + '\\b');
  return Object.entries(product).some((item: productTulip) => {
    return rg.test(item[1].toString().toLowerCase());
  }, []);
}
