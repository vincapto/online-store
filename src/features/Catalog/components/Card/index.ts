import { IProduct } from '../../../../data/dataModal';
import './card.style.scss';

export interface ICard extends IProduct {
  ordered: boolean;
}

export const createCatalogCard = ({
  price,
  title,
  id,
  thumbnail,
  rating,
  ordered,
  stock,
  discountPercentage,
  brand,
  category,
}: ICard) => {
  return `
    <div class='block catalog__item card'>
      <img class='card-img' src='${thumbnail}'/>
      <div class='card-description'>
        <h4 class='product__name'>${title}</h4>
        <div class='product__span-list'>
          <span class='product__brand'><label>Brand:</label> ${brand}</span>
          <span class='product__category'><label>Category:</label> ${category}</span>
          <span class='product__stock'><label>Stock:</label> ${stock}</span>
          <span class='product__price'><label>Price: </label>${price}$</span>
          <span class='product__rating'><label>Rating:</label> ${rating}</span>
          <span class='product__discount'><label>Discount:</label> ${discountPercentage}%</span>
        </div>
      </div>
        <div class='btn__wrapper'>
          <div class='btn btn_add ${ordered ? 'active' : ''}' data-id='${id}' data-price='${price}'>${
    ordered ? 'Remove' : 'Add'
  }
          </div>
          <div class='btn btn_show' data-id='${id}'>Show More</div>
        </div>
    </div>
  `;
};
