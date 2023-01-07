import { IProduct } from '../../data/dataModal';
import './product.style.scss';
import { ICard } from '../Catalog/components/Card/index';

export const keysForProduct = [
  'category',
  'brand',
  'description',
  'price',
  'rating',
  'stock',
  'discountPercentage',
  'title',
  'img',
  'add',
  'buy',
];

export interface IKeyForProduct {
  category: Element;
  brand: Element;
  description: Element;
  price: Element;
  rating: Element;
  stock: Element;
  discountPercentage: Element;
  title: Element;
  img: Element;
  add: Element;
  buy: Element;
}

export const createProduct = ({
  id,
  brand,
  category,
  description,
  discountPercentage,
  images,
  price,
  rating,
  stock,
  title,
}: IProduct) => {
  return `
    <div class='product__path-wrapper'><span class='logo-link'>Store</span> - <span class='product__path'></span></div>
    <div class='product block'>
      <div class='product__img-wrapper'>
        <img class='product__img-view feature__img' src='${images[0]}'/>
        <div class='product__slider'>
          ${[...new Set(images)]
            .map((img) => {
              return `<img class='slide product__img' src='${img}' placeholder=${title}/>`;
            })
            .join('')}
        </div>
      </div>
      <div class='product__description'>
        <div class='product__title feature__title'>${title}</div>
        <ul class='product__stat'>
          <li class='product__feature'><label>Category:</label>
            <span class=' feature__category'>${category}</span>
          </li>
          <li class='product__feature '><label>Brand:</label>
            <span class=' feature__brand'>${brand}</span>
          </li>
          <li class='product__feature '><label>Description:</label>
            <span class=' feature__description'>${description}</span>
          </li>
          <li class='product__feature '><label>Price:</label>
            <span class=' feature__price'>${price}$</span>$
          </li>
          <li class='product__feature '><label>Rating:</label>
            <span class=' feature__rating'>${rating}</span>
          </li>
          <li class='product__feature '><label>Stock:</label>
            <span class=' feature__stock'>${stock}</span>
          </li>
          <li class='product__feature '><label>Discount:</label>
            <span class=' feature__discountPercentage'>${discountPercentage}</span>%
          </li>
        </ul>
        <div class='btn-wrapper'>
          <div class='feature__add btn btn_add'  data-price='${price}' data-id='${id}'>Add</div>
          <div class='feature__buy btn btn_buy'  data-price='${price}' data-id='${id}'>Buy Now</div>
        </div>
      </div>
    </div>
  `;
};

export function getSrcFromSlider(e: Event) {
  const view = document.querySelector('.product__img-view') as HTMLImageElement;
  const element = e.target as HTMLImageElement;
  if (element.classList.contains('slide')) {
    if (view.src !== element.src) view.src = element.src;
  }
}

function updateAttributeButton(add: Element, buy: Element, item: ICard) {
  add.setAttribute('data-id', item.id.toString());
  add.setAttribute('data-price', item.price.toString());
  buy.setAttribute('data-id', item.id.toString());
  buy.setAttribute('data-price', item.price.toString());
  item.ordered
    ? (add.classList.add('active'), (add.textContent = 'Remove'))
    : (add.classList.remove('active'), (add.textContent = 'Add'));
}

export function updateProduct(item: ICard | null, obj: IKeyForProduct) {
  const { category, brand, description, price, rating, stock, discountPercentage, title, img, add, buy } = obj;
  if (item === null) return;
  const view = img as HTMLImageElement;
  const productPath = document.querySelector('.product__path') as Element;
  const viewSlides = <NodeListOf<HTMLImageElement>>document.querySelectorAll('.product__img');
  updateAttributeButton(add, buy, item);

  productPath.textContent = `  ${item.category} - ${item.brand} - ${item.title}`;
  title.textContent = item.title;
  category.textContent = item.category;
  brand.textContent = item.brand;
  description.textContent = item.description;
  price.textContent = item.price.toString();
  rating.textContent = item.rating.toString();
  view.src = item.images[0];
  stock.textContent = item.stock.toString();
  discountPercentage.textContent = item.discountPercentage.toString();
  viewSlides.forEach((a, key) => {
    item.images[key] ? ((a.src = item.images[key]), a.classList.remove('hide')) : a.classList.add('hide');
  });
}
