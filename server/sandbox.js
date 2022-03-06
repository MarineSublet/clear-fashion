/* eslint-disable no-console, no-process-exit */
const { response } = require('express');
const dedicatedbrand = require('./sites/dedicatedbrand');
const dedicated_all = require('./sites/dedicated_all');
const montlimart = require('./sites/montlimart');
const adresse_paris = require('./sites/adresse_paris');
const fs = require('fs');
const db = require('./mongodb');
const { insert } = require('./mongodb');
const { connect }=require('./mongodb');

async function findbybrand(brand) { 
  try {
      
      const bybrand = await  db.find({'brand':brand});
      console.log(`total : ${bybrand.length}`);
      console.log(bybrand);

      return bybrand;
  }
  catch(error){
      console.error(error);
  return null;}
}

async function lessthanprice(price) { 
  try {
      
      const lessthan = await  db.find({'price':{$lt:price}});
      console.log(`total : ${lessthan.length}`);
      console.log(lessthan);

      return lessthan;
  }
  catch(error){
      console.error(error);
  return null;}
}

//eshop = 'https://www.dedicatedbrand.com/en/loadfilter'
//'https://adresse.paris/630-toute-la-collection?p=1'
//'https://www.montlimart.com/toute-la-collection.html?p=2'
async function sandbox () {
  try {
    await db.connect()
    let products = [];
    let pages = ['https://adresse.paris/630-toute-la-collection?p=1','https://adresse.paris/630-toute-la-collection?p=2'
    ];

    console.log(`🕵️‍♀️  browsing ${pages.length} pages with for...of`);

    // Way 1 with for of: we scrape page by page
    for (let page of pages) {
      console.log(`🕵️‍♀️  scraping ${page}`);

      let results = await adresse_paris.scrape(page);

      console.log(`👕 ${results.length} products found`);

      products.push(results);
    }

    pages = [
      'https://www.montlimart.com/toute-la-collection.html?p=1','https://www.montlimart.com/toute-la-collection.html?p=2','https://www.montlimart.com/toute-la-collection.html?p=3','https://www.montlimart.com/toute-la-collection.html?p=4'
      ,'https://www.montlimart.com/toute-la-collection.html?p=5','https://www.montlimart.com/toute-la-collection.html?p=6','https://www.montlimart.com/toute-la-collection.html?p=7',
      'https://www.montlimart.com/toute-la-collection.html?p=8'
    ];
    console.log(`🕵️‍♀️  browsing ${pages.length} pages with for...of`);

    for (let page of pages) {
      console.log(`🕵️‍♀️  scraping ${page}`);

      let results = await montlimart.scrape(page);

      console.log(`👕 ${results.length} products found`);
      products.push(results.flat());
      
    }

    pages = ['https://www.dedicatedbrand.com/en/loadfilter' ];

    let results = await dedicated_all.scrape(pages);

      console.log(`👕 ${results.length} products found`);
      products.push(results.flat());
      products = products.flat();
      //console.log(products);

      products = products.flat();
      
      products.forEach((element, index) => {
        if (element.name === 'Carte Cadeau Montlimart') {
          products.splice(index,1);
        }})

      //console.log(products[1500]);
      //fs.writeFileSync('products.json', JSON.stringify(products));
      
      //insertion
      //await db.insert(products);
      
      //db.close();
      
      //console.log(findbybrand('montlimart'));
      //console.log(lessthanprice(100));
      const sortByPrice = await db.sort();
      console.log(sortByPrice);
      ;
  } catch (e) {
    console.error(e);
    
  }}
//const [,, eshop] = process.argv;

sandbox();