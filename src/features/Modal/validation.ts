const regName = /^(\S){3,}((\s)(\S){3,}){1,}$/;
const regPhone = /^\+\(?(\d{3,})\)?[- ]?(\d{3,})[- ]?(\d{3,})$/;
const regAddress = /^[a-zA-Z0-9,.'-]{5,}$/;
const regCvv = /^[0-9]{3}$/;
const regIsCard = /^[0-9]{16}$/;
const regExpire = /^[0-9]{2}\/[0-9]{2}$/;
export const regEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

interface IValidationState {
  name: boolean;
  phone: boolean;
  address: boolean;
  email: boolean;
  isCard: boolean;
  expire: boolean;
  cvv: boolean;
}

export interface ICreditCardInput {
  number: HTMLInputElement;
  date: HTMLInputElement;
  cvv: HTMLInputElement;
}

type ValidationKeys = keyof IValidationState;
type PatternKeys = Pick<IValidationState, 'phone' | 'email' | 'address' | 'cvv' | 'name' | 'isCard' | 'expire'>;

export type errorHandler = {
  element: HTMLInputElement;
  label: Element;
  name: keyof IValidationState;
  validationState: IValidationState;
};

export const RegPatter: Record<keyof PatternKeys, RegExp> = {
  name: regName,
  phone: regPhone,
  address: regAddress,
  email: regEmail,
  cvv: regCvv,
  isCard: regIsCard,
  expire: regExpire,
};

const messageError: Record<ValidationKeys, string> = {
  name: 'Must contain two words at least 3 characters long',
  phone: 'Must stat with + and length not less than 9 characters',
  address: 'Must contain at list 3 words with 5 or more characters long',
  email: 'Must be email',
  isCard: 'Must be a card',
  expire: 'Expired',
  cvv: 'Must be 3 digits',
};

export const cardImage = {
  visa: 'https://raw.githubusercontent.com/falconmasters/formulario-tarjeta-credito-3d/master/img/logos/visa.png',
  mastercard:
    'https://raw.githubusercontent.com/falconmasters/formulario-tarjeta-credito-3d/master/img/logos/mastercard.png',
  discover: 'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/discover.png',
};

export const creditCardName = {
  visa: /^4[0-9]{15}$/,
  mastercard: /^5[0-9]{15}$/,
  discover: /^6[0-9]{15}$/,
  amex: /^3[47][0-9]{13}$/,
  diners_club: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
  jcb: /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/,
};

export function validate(str: string, pattern: RegExp) {
  return pattern.test(str);
}

export function isCreditCardNumber(ccn: string) {
  if (ccn && ccn !== '' && ccn.length === 0) return false;
  const trimmed = ccn.trim().length;
  if (trimmed !== 16) return false;
  const algorithm = (card: string) => {
    const str = card
      .toString()
      .split('')
      .reverse()
      .map((a: string) => Number(a));
    const list = str.map((a: number, key: number) => {
      const double: number = key % 2 !== 0 && key !== 0 ? a * 2 : a;
      return double > 9 ? double - 9 : double;
    });
    return list.reduce((a, b) => Number(a) + Number(b));
  };
  return algorithm(ccn) % 10 === 0;
}

export function checkCvv(cvv: string) {
  return cvv.length < 5 && validate(cvv.trim(), RegPatter.cvv);
}

export function checkExpireDate(month: number, year: number) {
  if (month > 12) return false;
  const today = new Date();
  const end = new Date();
  end.setFullYear(2000 + year, month - 1, 1);
  return end > today;
}

export function getCreditCardName(isCard: boolean, value: string) {
  if (!isCard) return 'NO MATCH';
  const cardList = Object.entries(creditCardName);
  const foundName = cardList.reduce((acc, item) => {
    const [name, pattern] = item;
    return pattern.test(value) ? name : acc;
  }, '');
  return foundName.length > 0 ? foundName : 'NO MATCH';
}

export function checkSubmitForm(block: Document) {
  const validationState: IValidationState = {
    name: false,
    phone: false,
    address: false,
    email: false,
    isCard: false,
    expire: false,
    cvv: false,
  };
  getCreditCardFormInput(block, validationState);
  getBuyFormInput(block, validationState);
  return validationState;
}

export function triggerError(block: Document, validationState: IValidationState) {
  const number = <HTMLInputElement>block.querySelector('.credit-card__number');
  const numberLabel = <HTMLInputElement>block.querySelector('.error-card-number');
  const cvv = <HTMLInputElement>block.querySelector('.credit-card__cvv');
  const cvvLabel = <HTMLInputElement>block.querySelector('.error-cvv');
  const date = <HTMLInputElement>block.querySelector('.credit-card__valid');
  const expireLabel = <HTMLInputElement>block.querySelector('.error-expire');
  const name = <HTMLInputElement>block.querySelector('.buy__name');
  const nameLabel = <HTMLInputElement>block.querySelector('.error-name');
  const phone = <HTMLInputElement>block.querySelector('.buy__phone');
  const phoneLabel = <HTMLInputElement>block.querySelector('.error-phone');
  const address = <HTMLInputElement>block.querySelector('.buy__address');
  const addressLabel = <HTMLInputElement>block.querySelector('.error-address');
  const email = <HTMLInputElement>block.querySelector('.buy__email');
  const emailLabel = <HTMLInputElement>block.querySelector('.error-email');

  const check: errorHandler[] = [
    {
      element: number,
      label: numberLabel,
      name: 'isCard',
      validationState: validationState,
    },
    {
      element: cvv,
      label: cvvLabel,
      name: 'cvv',
      validationState: validationState,
    },
    {
      element: date,
      label: expireLabel,
      name: 'expire',
      validationState: validationState,
    },
    {
      element: name,
      label: nameLabel,
      name: 'name',
      validationState: validationState,
    },
    {
      element: phone,
      label: phoneLabel,
      name: 'phone',
      validationState: validationState,
    },
    {
      element: email,
      label: emailLabel,
      name: 'email',
      validationState: validationState,
    },
  ];

  check.forEach((a) => {
    errorListener(a);
  });

  const list = address.value
    .trim()
    .split(' ')
    .filter((a) => {
      return a !== ' ' && a.length >= 5 && validate(a, RegPatter.address);
    });
  const checkAddress = list.length >= 3;
  checkAddress ? updateErrorLabel(addressLabel, '') : updateErrorLabel(addressLabel, messageError.address);
}

export function getCreditCardFormInput(block: Document, validationState: IValidationState) {
  const number = <HTMLInputElement>block.querySelector('.credit-card__number');
  const numberLabel = <HTMLInputElement>block.querySelector('.error-card-number');
  const cvv = <HTMLInputElement>block.querySelector('.credit-card__cvv');
  const cvvLabel = <HTMLInputElement>block.querySelector('.error-cvv');
  const date = <HTMLInputElement>block.querySelector('.credit-card__valid');
  const expireLabel = <HTMLInputElement>block.querySelector('.error-expire');
  const cardNameLabel = <HTMLInputElement>block.querySelector('.credit-card-name');

  number.addEventListener('keyup', () => {
    number.textContent = '';
  });
  number.addEventListener('input', (e) => {
    const element = <HTMLInputElement>e.target;
    element.value = element.value
      .split('')
      .filter((digit) => /[0-9]$/.test(digit))
      .join('');
    element.value = element.value.length > 16 ? element.value.slice(0, 16) : element.value;
    const isCreditCard = element.value.length === 16;
    type imageType = keyof typeof cardImage;
    const cardName = getCreditCardName(isCreditCard, element.value.toString()) as imageType;
    validationState.isCard = isCreditCard;
    isCreditCard ? updateErrorLabel(numberLabel, '') : updateErrorLabel(numberLabel, messageError.isCard);

    cardNameLabel.innerHTML = '';
    if (cardName in cardImage && element.value.length) {
      cardNameLabel.innerHTML = '';
      const image = document.createElement('img');
      image.src = cardImage[cardName];
      cardNameLabel.appendChild(image);
    } else if (element.value.length === 16) {
      cardNameLabel.innerHTML = cardName;
    }
  });

  cvv.addEventListener('input', (e) => {
    const element = <HTMLInputElement>e.target;
    element.value = element.value.length > 3 ? element.value.slice(0, 3) : element.value;
    const check = checkCvv(element.value);
    validationState.cvv = check;
    check ? updateErrorLabel(cvvLabel, '') : updateErrorLabel(cvvLabel, messageError.cvv);
  });

  date.addEventListener('input', (e) => {
    const element = <HTMLInputElement>e.target;
    const [month, year] = element.value.split('/').map((a) => Number(a));
    const notNumber = /^[a-zA-Z.!#$%&'*+=?^_`{|}~-\s]*$/;
    const value = element.value
      .split('')
      .filter((a, key) => {
        const isSlash = a === '/' && key !== 2;
        return !notNumber.test(a) && !isSlash;
      })
      .join('');

    element.value = value.length === 3 && !value.includes('/') ? `${value.slice(0, 2)}/${value.slice(2, 3)}` : value;
    element.value = value.length > 5 ? element.value.slice(0, 5) : element.value;
    const check = checkExpireDate(month, year);
    validationState.expire = check;

    check ? updateErrorLabel(expireLabel, '') : updateErrorLabel(expireLabel, messageError.expire);
  });
  return { number, date, cvv } as ICreditCardInput;
}

export function updateErrorLabel(element: Element, message: string) {
  element.textContent = message;
}

function errorListener({ element, label, name, validationState }: errorHandler) {
  const pattern = name as keyof PatternKeys;
  const check = validate(element.value.trim(), RegPatter[pattern]);
  validationState[name] = check;
  check ? updateErrorLabel(label, '') : updateErrorLabel(label, messageError[name]);
}

export function getBuyFormInput(block: Document, validationState: IValidationState) {
  const name = <HTMLInputElement>block.querySelector('.buy__name');
  const nameLabel = <HTMLInputElement>block.querySelector('.error-name');
  const phone = <HTMLInputElement>block.querySelector('.buy__phone');
  const phoneLabel = <HTMLInputElement>block.querySelector('.error-phone');
  const address = <HTMLInputElement>block.querySelector('.buy__address');
  const addressLabel = <HTMLInputElement>block.querySelector('.error-address');
  const email = <HTMLInputElement>block.querySelector('.buy__email');
  const emailLabel = <HTMLInputElement>block.querySelector('.error-email');
  name.addEventListener('input', (e) => {
    errorListener({
      element: <HTMLInputElement>e.target,
      label: nameLabel,
      name: 'name',
      validationState,
    });
  });
  email.addEventListener('input', (e) => {
    errorListener({
      element: <HTMLInputElement>e.target,
      label: emailLabel,
      name: 'email',
      validationState,
    });
  });
  phone.addEventListener('input', (e) => {
    const element = <HTMLInputElement>e.target;
    element.value = element.value
      .split('')
      .filter((digit, key) => {
        const isStart = digit === '+' && key == 0;
        return isStart || /[0-9]$/.test(digit);
      })
      .join('');
    element.value = element.value.length > 15 ? element.value.slice(0, 15) : element.value;
    errorListener({
      element: <HTMLInputElement>e.target,
      label: phoneLabel,
      name: 'phone',
      validationState,
    });
  });
  address.addEventListener('input', (e) => {
    const element = <HTMLInputElement>e.target;
    const list = element.value
      .trim()
      .split(' ')
      .filter((a) => {
        return a !== ' ' && a.length >= 5 && validate(a, RegPatter.address);
      });
    const check = list.length >= 3;
    validationState.address = check;
    check ? updateErrorLabel(addressLabel, '') : updateErrorLabel(addressLabel, messageError.address);
  });

  return { name, address, phone, email };
}
