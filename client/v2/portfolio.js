// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};
let favouriteuuid =[];
let favouritelist=[];

// inititiqte selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrands = document.querySelector('#brand-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const spanNbNewProducts = document.querySelector('#nbNewProducts');
const selectSort = document.querySelector('#sort-select')
const span50 = document.querySelector('#p50')
const span90 = document.querySelector('#p90')
const span95= document.querySelector('#p95')
const span_last_released_date= document.querySelector('#last_released_date')

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


function favourite(uuidtxt)
    {favouriteuuid.push(uuidtxt);
    console.log(favouriteuuid)}

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
        <button onclick=favourite("${product.uuid}")>favourite</button>
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
//console.log(count)
  spanNbProducts.innerHTML = count;
};

/**
 * Render new products selector
 * @param  {Object} paginationnew
 */
 const renderIndicatorsNew = paginationnew => {
  const countnew = paginationnew.length;
  //console.log(paginationnew)
  spanNbNewProducts.innerHTML = countnew;
};

function percentile(arr, p) {
  if (arr.length === 0) return 0;
  if (p <= 0) return arr[0];
  if (p >= 1) return arr[arr.length - 1];
  var index = (arr.length - 1) * p,
      lower = Math.floor(index),
      upper = lower + 1,
      weight = index % 1;

  if (upper >= arr.length) 
  return arr[lower].price;
  return arr[lower].price * (1 - weight) + arr[upper].price * weight;
}


/**
 * Render p50 indicator
 * @param  {Object} p50
 */
 const renderIndicatorsp50 = p50 => {
  
  p50=p50.sort((a,b) => (a.price<b.price)?1:-1);
  const count50 = percentile(p50,0.5)
//console.log(count50)
  span50.innerHTML = count50;
};

/**
 * Render p90 indicator
 * @param  {Object} p90
 */
 const renderIndicatorsp90 = p90 => {
  
  p90=p90.sort((a,b) => (a.price<b.price)?1:-1);
  const count90 = percentile(p90,0.9)
//console.log(count50)
  span90.innerHTML = count90;
};

/**
 * Render p95 indicator
 * @param  {Object} p90
 */
 const renderIndicatorsp95 = p95 => {
  
  p95=p95.sort((a,b) => (a.price<b.price)?1:-1);
  const count95 = percentile(p95,0.95)
//console.log(count50)
  span95.innerHTML = count95;
};

/**
 * Render last released date indicator
 * @param  {Object} last
 */
 const render_last_released_date = last => {
  
  last=sortbydateDesc(last);
  const last_date = last[0].released
//console.log(count50)
span_last_released_date.innerHTML = last_date;
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

function sortbypriceDesc(products){
products=products.sort((a,b) => (a.price<b.price)?1:-1);
return products;
}

function sortbypriceAsc(products){
  products=products.sort((a,b) => (a.price>b.price)?1:-1);
  return products;
  }

function sortbydateDesc(products){
    products=products.sort((a,b) => (Date.parse(a.released)<Date.parse(b.released))?1:-1);
    return products;
    }
function sortbydateAsc(products){
    products=products.sort((a,b) => (Date.parse(a.released)>Date.parse(b.released))?1:-1);
    return products;
    }

const render2 = (products, pagination,brandSelected) => {
  let brandstot=['No brand selected'];

if (buttonrel===true){products=newrelease(products)
  //renderProducts(products);
}
if (buttonreasonable===true){products=reasonable(products)
    //renderProducts(products);
  }
  if (buttonfavourite===true)
{
  favouriteuuid=[ ... new Set(favouriteuuid)]
  favouriteuuid.forEach(element => {
    products.forEach(elemuuid=> {
      if (element==elemuuid.uuid)
      {favouritelist.push(elemuuid);}
    })  
  });
  favouritelist=[ ... new Set(favouritelist)]
  console.log(favouritelist)
  console.log(favouriteuuid)
  products=favouritelist;
  //renderProducts(products);
}
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
if(brandSelected=="No brand selected")
{
  //renderProducts(products);
}
else
{
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
  products=const_brands[brandSelected];
  //renderProducts(const_brands[brandSelected]);
}


  //console.log(pagination)
  renderPagination(pagination);
  renderIndicators(pagination);
  renderIndicatorsNew(newrelease(products));
  renderProducts(products);
  renderBrands(brandstot,brandSelected);
  renderIndicatorsp50(products);
  renderIndicatorsp90(products);
  renderIndicatorsp95(products);
  render_last_released_date(products);
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
  fetchProducts(currentPagination.currentPage, parseInt(selectShow.value))
    .then(setCurrentProducts)
    .then(() => render2(currentProducts, currentPagination,event.target.value));
    
});


selectPage.addEventListener('change', event => {
  fetchProducts( parseInt(event.target.value),parseInt(selectShow.value))
    .then(setCurrentProducts)
    .then(() => render2(currentProducts, currentPagination,"No brand selected"));
});

selectSort.addEventListener('change', event => { if (event.target.value=="price-desc")
  {fetchProducts(currentPagination.currentPage, parseInt(selectShow.value))
    .then(setCurrentProducts)
    .then(() => render2(sortbypriceDesc(currentProducts), currentPagination,"No brand selected"));} 
    else if (event.target.value=="price-asc")
    {fetchProducts(currentPagination.currentPage, parseInt(selectShow.value))
      .then(setCurrentProducts)
      .then(() => render2(sortbypriceAsc(currentProducts), currentPagination,"No brand selected"));}
      else {if (event.target.value=="date-asc")
      {fetchProducts(currentPagination.currentPage, parseInt(selectShow.value))
        .then(setCurrentProducts)
        .then(() => render2(sortbydateAsc(currentProducts), currentPagination,"No brand selected"));}
      else {if(event.target.value=="date-desc")
        {fetchProducts(currentPagination.currentPage, parseInt(selectShow.value))
          .then(setCurrentProducts)
          .then(() => render2(sortbydateDesc(currentProducts), currentPagination,"No brand selected"));}
          else {fetchProducts(currentPagination.currentPage, parseInt(selectShow.value))
            .then(setCurrentProducts)
            .then(() => render2(currentProducts, currentPagination,"No brand selected"));}
//console.log(event.target.value);}
}}

});

var buttonrel=false;
function changeboolrel()
{ if (buttonrel==false){buttonrel=true}
else buttonrel=false;
{
  fetchProducts(currentPagination.currentPage, parseInt(selectShow.value))
    .then(setCurrentProducts)
    .then(() => render2(currentProducts, currentPagination,"No brand selected"));
};}

var buttonreasonable=false;
function changeboolreasonable()
{ if (buttonreasonable==false){buttonreasonable=true}
else buttonreasonable=false;
{
  fetchProducts(currentPagination.currentPage, parseInt(selectShow.value))
    .then(setCurrentProducts)
    .then(() => render2(currentProducts, currentPagination,"No brand selected"));
};}

var buttonfavourite=false
function filterfavourite()
{ if (buttonfavourite==false){buttonfavourite=true}
else buttonfavourite=false;
{
  fetchProducts(currentPagination.currentPage, parseInt(selectShow.value))
    .then(setCurrentProducts)
    .then(() => render2(currentProducts, currentPagination,"No brand selected"));
};}


document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => render2(currentProducts, currentPagination,"No brand selected"))
    
);
