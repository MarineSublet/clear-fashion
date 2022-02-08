/* eslint-disable no-console, no-process-exit */
const { response } = require('express');
const dedicatedbrand = require('./sites/dedicatedbrand');
const dedicated_all = require('./sites/dedicated_all');
const montlimart = require('./sites/montlimart');
const adresse_paris = require('./sites/adresse_paris');

//eshop = 'https://www.dedicatedbrand.com/en/loadfilter'
//'https://adresse.paris/630-toute-la-collection?p=1'
async function sandbox (eshop = 'https://www.montlimart.com/toute-la-collection.html?p=2') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const products = await montlimart.scrape(eshop);
    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);
