import createLogo from './components/logo';
import '../../common/style/global.style.scss';
import '../../common/style/reset.style.scss';
import './layout.style.scss';
import { createFooter } from './components/Footer';
import { createNotFount } from '../404/404';

export const createLayout = () => {
  return `
    <div class='layout'>
      <header class='header container'>
        ${createLogo()}
        <div class='info'>
          <div class='info__count-wrapper info-wrapper'>
            <div class='info__count'>0</div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16">
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/> 
            </svg>
          </div>
          <div class='info__sum-wrapper info-wrapper'>
            <div class='info__sum'>0</div>
            <span>$</span>
          </div>
        </div>
      </header>
      <main class='main container'>
        
        <div class='content content__catalog'></div>
        <div class='content content__product hide'></div>
        <div class='content content__cart hide'>
          <div class='cart__list'></div>
        </div>
        <div class='content content__notFound hide'>${createNotFount()}</div>
      </main>
      ${createFooter()}
    </div>
  `;
};
