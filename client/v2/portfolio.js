// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};

// inititiqte selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrands = document.querySelector('#brand-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const buttonReleased = document.querySelector('Recently_Released')

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */

const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    
    const body = await response.json();
      
    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }
    //console.log(body.data)
    
    

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};
/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  //console.log(products)
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
  
  //console.log(products)
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/** 
*Render brand selector
* @param  {Object} brand
* @param  {Object} brandSelected
*/
const renderBrands = (brand,brandSelected) => {
 //const brandstot = brand;
 const options = Array.from(
   brand,
   (brand) =>`<option value="${brand}">${brand}</option>`
 ).join('');
 selectBrands.innerHTML = options;
 //console.log(brandSelected)
 selectBrands.selectedIndex = brand.indexOf(brandSelected);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
};


function newrelease(products){
  const newProductRelease = [];
  for (var i=0; i<products.length; i++)
  {
    if((Math.abs(Date.now()-Date.parse(products[i].released))/(1000 * 60 * 60 * 24))<14)
    {
      newProductRelease.push(products[i]);
    }
  }
  return newProductRelease;
}

function reasonable(products){
  const reasonable=[];
  for (let i=0;i<products.length;i++)
  {if(products[i].price<50) reasonable.push(products[i]);;
  }
return reasonable}


const render2 = (products, pagination,brandSelected) => {
  let brandstot=['No brand selected'];
    for (let step=0;step<products.length;step++)
    {
       brandstot.push(products[step].brand);
    }
  brandstot=[ ... new Set(brandstot)]

  var const_brands={};
for (var i=0; i<products.length; i++)
{
  //console.log(products[i])
  const_brands[products[i].brand]=[];
}
for (var i=0; i<products.length; i++)
{
  const_brands[products[i].brand].push(products[i])
}
if (buttonrel===true){products=newrelease(products)
  renderProducts(products);}
if (buttonreasonable===true){products=reasonable(products)
    renderProducts(products);}
if(brandSelected=="No brand selected")
{
  renderProducts(products);
}
else
{
  renderProducts(const_brands[brandSelected]);
}
  renderPagination(pagination);
  renderIndicators(pagination);
  renderBrands(brandstot,brandSelected)
}



/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 * @type {[type]}
 */
selectShow.addEventListener('change', event => {
  fetchProducts(currentPagination.currentPage, parseInt(event.target.value))
    .then(setCurrentProducts)
    .then(() => render2(currentProducts, currentPagination,"No brand selected"));
});

selectBrands.addEventListener('change', event => {
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => render2(currentProducts, currentPagination,event.target.value));
    
});


selectPage.addEventListener('change', event => {
  fetchProducts( parseInt(event.target.value),currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => render2(currentProducts, currentPagination,"No brand selected"));
});

var buttonrel=false;
function changeboolrel()
{ if (buttonrel==false){buttonrel=true}
else buttonrel=false;
{
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => render2(currentProducts, currentPagination,"No brand selected"));
};}

var buttonreasonable=false;
function changeboolreasonable()
{ if (buttonreasonable==false){buttonreasonable=true}
else buttonreasonable=false;
{
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => render2(currentProducts, currentPagination,"No brand selected"));
};}



document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => render2(currentProducts, currentPagination,"No brand selected"))
);
