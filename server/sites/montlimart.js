const fetch = require('node-fetch');
const cheerio = require('cheerio');
const {'v5': uuidv5} = require('uuid');

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.product-name')
    .map((i, element) => {
      const link = $(element).parent()
        .find('.product-name a')
        .attr('href');
        
      return {
        link,
        'brand': 'montlimart',
        'price':parseFloat( 
          $(element).parent()
            .find('.price').text())
        ,
        'name': $(element).parent()
          .find('.product-name a')
        .attr('title'),

        'photo': $(element).parent().parent()
          .find('.product-image a img').attr('src'),
        '_id': uuidv5(link, uuidv5.URL)
      };
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();
      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
