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

  return $('data-new-gr-c-s-check-loaded')
    .map((i, element) => {
      const link = `https://www.dedicatedbrand.com/en/loadfilter?category=men?${$(element)
        .find('body')
        .attr('word-wrap: break-word; white-space: pre-wrap;')}`;
      
        var rand=Math.floor(Math.random()*(3))
        var rand2=Math.floor(Math.random()*28)
        var date=new Date(2022,rand,rand2)
      return {
        link,
        'brand': 'dedicated',
        'price': parseInt(
          $(element)
            .find('.productList-price')
            .text()

        ),
        'name': $(element)
          .find('.productList-title')
          .text()
          .trim()
          .replace(/\s/g, ' '),
        'photo': $(element)
          .find('.productList-image img').attr('data-src'),
        '_id': uuidv5(link, uuidv5.URL),
        'released':date
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
      const body = await response.json();
      let final = [];
        body.products.forEach((element) => {
            if(element.name!=undefined)
      {final.push({
        link: "https://www.dedicatedbrand.com/en/" + element["canonicalUri"],
        brand: "dedicated",
        price: parseFloat(element["price"].price),
        name: element["name"],
        photo: element["image"][0],
        _id: uuidv5("https://www.dedicatedbrand.com/en/" + element["canonicalUri"], uuidv5.URL),
        'released':new Date(element["price"]["saleStartDate"])
        
      })};
    });
    //console.log(final);
      //return body.products;
      return final;
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
