import './filter.style.scss';
import { IProduct } from '../../data/dataModal';
import { getCheckboxList } from './components/Checkbox';
import { getRangeList } from './components/DoubleRange';
import { createSearchBar } from './components/Search';

export const createForm = (data: IProduct[], checkList: Record<string, string[]> | null) => {
  return `
    <div class='filter-form'>
      <div class='filter-form__btn-wrapper'>
        <div class='btn btn_copy'>Copy</div>
        <div class='btn btn_reset'>Reset</div>
      </div>
      ${createSearchBar()}
      ${getCheckboxList(data, checkList ? checkList : null)}
      ${getRangeList(data)}
    </div>
  `;
};
