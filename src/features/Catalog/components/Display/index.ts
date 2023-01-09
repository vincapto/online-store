import './display.style.scss';

function createDisplay() {
  return `
    <div class='display'>
      <div data-display='false' class='display__block row'></div>
      <div data-display='true' class='display__block grid'></div>
    </div>
  `;
}

export default createDisplay;
