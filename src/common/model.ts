export interface IBtnId extends Element {
  dataset: {
    id: string;
    price: string;
  };
}

export type MinMaxType = Record<string, { min: string; max: string }>;

export interface ICheckboxElement extends HTMLInputElement {
  dataset: {
    name: string;
    type: string;
  };
}

export interface ICartItem extends Element {
  dataset: {
    id: string;
    stock: string;
  };
}

export interface IDisplayItem extends Element {
  dataset: {
    display: string;
  };
}

export interface IDiscountItem extends Element {
  dataset: {
    discount: string;
  };
}

export interface IDoubleRangeInput extends HTMLInputElement {
  dataset: {
    mul: string;
    min: string;
    max: string;
  };
}
