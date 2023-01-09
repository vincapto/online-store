import './doubleRange.style.scss';
import { ProductKeyType } from './../../../../data/dataModal';
import { IDoubleRangeInput } from '../../../../common/model';
import { IProduct } from '../../../../data/dataModal';
import { updateCatalogList } from '../../../..';
import { updateRangeQuery } from '../../../../common/routing';

export interface IDoubleRange {
  name: string;
  min: string;
  max: string;
  step: string;
}

const MAX_RANGE_VALUE = 100;
const MIN_RANGE_VALUE = 0;

export const rangeTitleList: Array<ProductKeyType> = ['price', 'rating'];

export function createRangeSlider({ name, min, max, step }: IDoubleRange) {
  return `
    <div class="settings__range  ${name}">
    <h4>${name}</h4>
      <div class='range__label-container'>
        <div class="range__${name}-min">${Number(min)}</div>
        <div class="range__${name}-max">${Number(max)}</div>
      </div>
        <div class="range-container">
          ${createRange(MIN_RANGE_VALUE, { name, min, max, step })}
          ${createRange(MAX_RANGE_VALUE, { name, min, max, step })}
        </div>
  </div>`;
}

const createRange = (value: number, { name, min, max }: IDoubleRange) => {
  const mul = (Number(max) - Number(min)) / 100;
  return `
    <input
      type="range" 
      data-min=${min} 
      data-max=${max} 
      data-mul=${mul} 
      class="range__slider range__${name}" 
      name="${name}" 
      min="${MIN_RANGE_VALUE}" 
      max="${MAX_RANGE_VALUE}" 
      value="${value}" 
      step="${1}"
    />
  `;
};

export function getRange(data: IProduct[], key: ProductKeyType) {
  const range = data.map((a: IProduct) => {
    return typeof a[key] === 'number' ? Number(a[key]) : 0;
  });
  const max = Math.max(...range);
  const min = Math.min(...range);
  const step = (max - min) / 100;
  return { max, min, step };
}

export function getRangeValue(min: string, slider: IDoubleRangeInput, step: number) {
  return (Number(min) + Number(slider.value) * step).toString();
}

export function updateRangeText(element: Element, slider: IDoubleRangeInput, min: string) {
  const step = Number(slider.dataset.mul);
  const value = Number(min) + Number(slider.value) * step;
  element.innerHTML = isNaN(value) ? '' : value.toFixed(2);
  return value;
}

export function getRangeList(data: IProduct[]) {
  const rangeSlider = rangeTitleList.map((name) => {
    const { min, max, step } = getRange(data, name);
    return createRangeSlider({
      name,
      min: min.toString(),
      max: max.toString(),
      step: step.toString(),
    });
  });
  return rangeSlider.join('');
}

export function updateDoubleRange(
  data: IProduct[],
  rangeSliders: NodeListOf<IDoubleRangeInput>[],
  setRangeState: (type: string, min: string, max: string) => void
) {
  if (rangeSliders === null) return;
  rangeSliders.forEach((slider, key) => {
    const obj = getRange(data, rangeTitleList[key] as ProductKeyType);
    slider[0].dataset.mul = obj.step.toString();
    slider[1].dataset.mul = obj.step.toString();
    setRangeState(
      rangeTitleList[key],
      getRangeValue(obj.min.toString(), slider[0], obj.step),
      getRangeValue(obj.min.toString(), slider[1], obj.step)
    );
    const className = `.range__${rangeTitleList[key]}`;
    const min = document.querySelector(`${className}-min`) as Element;
    const max = document.querySelector(`${className}-max`) as Element;

    updateRangeText(min, slider[0], obj.min.toString());
    updateRangeText(max, slider[1], obj.min.toString());
  });
}

export function initRangeListener(
  name: string,
  sliders: NodeListOf<IDoubleRangeInput>,
  callback: (x: string, y: string, z: string) => void
) {
  sliders[0].addEventListener('input', () => {
    if (+sliders[0].value > +sliders[1].value) {
      sliders[1].value = sliders[0].value;
    }
  });

  sliders[1].addEventListener('input', () => {
    if (+sliders[1].value < +sliders[0].value) {
      sliders[0].value = sliders[1].value;
    }
  });

  sliders.forEach((slider) => {
    slider.addEventListener('input', () => {
      callback(name, sliders[0].value.toString(), sliders[1].value.toString());
      updateCatalogList();
      updateRangeQuery(name, sliders[0].value.toString(), sliders[1].value.toString());
    });
  });
}

export function getRangeSliders() {
  const sliders = rangeTitleList.map(
    (name) => document.querySelectorAll(`.range__${name}`) as NodeListOf<IDoubleRangeInput>
  );

  return sliders;
}
