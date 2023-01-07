import './modal.style.scss';

export function createModal() {
  return `
    <div class='modal'>
      <div class='buy'>
        <div class='buy__item-wrapper'>
          <label>Name</label>
          <input class='buy__input buy__name' placeholder='Name and last name' type='text'/>
          <label class='error error-name'></label>
        </div>
        <div class='buy__item-wrapper'>
          <label>Phone</label>
          <input class='buy__input buy__phone' placeholder='+XXXXXXXXX' type='text'/>
          <label class='error error-phone'></label>
        </div>
        <div class='buy__item-wrapper'>
          <label>Address</label>
          <input class='buy__input buy__address' placeholder='Address' type='text'/>
          <label class='error error-address'></label>
        </div>
        <div class='buy__item-wrapper'>
          <label>Email</label>
          <input class='buy__input buy__email' placeholder='Email' type='email'/>
          <label class='error error-email'></label>
        </div>
        ${createCreditCard()}
        <div class='btn btn_submit'>Buy Now</div>
      </div>
    </div>
  `;
}

function createCreditCard() {
  return `
  <div class='credit-card block'>
    <div class='credit-card-name'></div>
    <div class='credit-card__item-wrapper'>
      <label>Credit card number</label>
      <input class='credit-card__number' placeholder='Card number' value='' type='number'/>
      <label class='error error-card-number'></label>
    </div>
    <div class='credit-card__item-wrapper'>
      <label>CVV</label>
      <input class='credit-card__cvv' placeholder='NNN' value='' type='number'/>
      <label class='error error-cvv'> </label>
    </div>
    <div class='credit-card__item-wrapper'>
      <label>Valid</label>
      <input class='credit-card__valid' placeholder="MM/YY" value='' type='text'/>
      <label class='error error-expire'></label>
    </div>
  </div>
  `;
}
