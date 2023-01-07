import { CatalogState } from '../../../../common/CatalogState';
import { ICheckboxElement } from '../../../../common/model';
import { getQuery, pushRout, updateCheckQuery } from '../../../../common/routing';
import { ProductKeyType, IProduct, ProductValueType } from './../../../../data/dataModal';

export const checkboxTitleList: Array<ProductKeyType> = ['brand', 'category'];
export type checkTitleType = 'category' | 'brand';

export interface ICheckboxOption {
  name: string;
  optionList: string[];
  checkList: Record<string, string[]> | null;
}

export function parseInitCheckboxValue(data: IProduct[]) {
  const init = data.reduce<Record<string, string[]>>((acc, item) => {
    checkboxTitleList.forEach((title) => {
      const key = title as checkTitleType;
      const value = item[key].toLowerCase();
      acc[key] = acc[key] ? (!acc[key].includes(value) ? [...acc[key], value] : [...acc[key]]) : [value];
    });
    return acc;
  }, {});
  return init;
}

export function createCheckBoxContainer({ name: title, optionList, checkList }: ICheckboxOption) {
  const list = filterCheckbox(checkList);
  return `
    <div class="form__field ${title}" data-num="$">
      <h4 class='form__field-title'>${title.toUpperCase()}</h4>
      ${optionList
        .map((name) => {
          return createCheckbox(name, title, list.length > 0 ? list.includes(name.toLowerCase()) : false);
        })
        .join('')}
    </div>`;
}

function filterCheckbox(list: Record<string, string[]> | null): string[] {
  return list && Object.values(list).filter((a) => a !== undefined).length !== 0
    ? Object.keys(list).reduce<string[]>((acc, next): string[] => {
        return [...acc, ...list[next]];
      }, [])
    : [];
}

const createCheckbox = (text: string, type: string, checked: boolean) => {
  const name = `${text}_checkbox`;
  return `
    <div class='checkbox__wrapper'>
      <input 
        id='${name}' 
        ${checked ? 'checked' : ''}
        class='filter__checkbox'
        data-name='${text}'
        data-type='${type}'
        type='checkbox' 
      />
      <label for=${name}>${text}</label>
    </div>
    
  `;
};

export function getCheckboxList(data: IProduct[], checkList: Record<string, string[]> | null) {
  const checkBoxArr = checkboxTitleList.reduce((value, nextValue) => {
    const arr = data.reduce<ProductValueType>((acc, next) => {
      const item = typeof next[nextValue] == 'string' ? (<string>next[nextValue]).toLowerCase() : next[nextValue];
      if (!acc.includes(item)) acc.push(item);
      return [...acc];
    }, []);
    return { ...value, [nextValue]: arr };
  }, {}) as Record<string, string[]>;

  const settingsCheckBox = Object.entries(checkBoxArr)
    .map(([name, optionList]) => {
      return createCheckBoxContainer({
        name,
        optionList,
        checkList,
      });
    })
    .join('');

  return settingsCheckBox;
}

export function filterListener(e: Event, catalogState: CatalogState) {
  const element = e.target as Element;
  if (element.classList.contains('filter__checkbox')) {
    const checkbox = <ICheckboxElement>element;
    catalogState.toggleCheckboxList(checkbox.dataset.type, checkbox.dataset.name, checkbox.checked);
    const query = getQuery().get(checkbox.dataset.type);
    const mod = updateCheckQuery(query ? query : '', checkbox.dataset.name);
    const searchParams = new URLSearchParams(window.location.search);
    if (mod === '') {
      searchParams.delete(checkbox.dataset.type);
    } else searchParams.set(checkbox.dataset.type, mod);
    pushRout(`/?${searchParams.toString()}`);
  }
}
