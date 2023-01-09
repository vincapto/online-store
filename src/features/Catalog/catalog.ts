import Display from './components/Display';
import SelectSort from './components/SelectSort';
import './catalog.style.scss';
import productFound from './components/ProductFound';

const createCatalog = () => {
  return `
    <div class='catalog'>
      <div class='catalog__option'>
        <div class='option__list'>
          ${SelectSort()}
          ${productFound(0)}
          ${Display()}
          <button class='filter-form__show btn'>Filter</button>
        </div>
        
      </div>
      <div class='catalog__list catalog__grid'></div>
    </div>
  `;
};

export function toggleDisplay(flag: string, block: Element) {
  flag === 'true' && flag
    ? (block.classList.add('catalog__grid'), block.classList.remove('catalog__row'))
    : (block.classList.add('catalog__row'), block.classList.remove('catalog__grid'));
}

export default createCatalog;
