import './productFound.style.scss';

const productFound = (count: number) => {
  return `
    <div class='catalog__found'>
      <span>Found: </span><span class='catalog__found-count'>${count.toString()}</span>
    </div>
  `;
};

export default productFound;
