var cheerio = require('cheerio')
var axios = require('axios')

// ===============================CALL==========================================
getPedals(getCheerioElements)
// ================================FUNCTIONS===========================================
async function getPedals (next) {
  const query = process.argv
    .splice(2)
    .join(' ')
    .replace(/\s/g, '%20')

  console.log('query: ', query)
  const result = await axios.get(
    `https://reverb.com/marketplace?query=${query}&condition=used`
  )

  next(result)
}
function getCheerioElements (result) {
  const $ = cheerio.load(result.data)
  const output = []
  $('a.csp-square-card__inner').each(function (index, element) {
    const title = $(element)
      .children()
      .text()
    const link = $(element).attr('href')
    const condition = $(element)
      .children('.condition-indicator__label')
      .text()
    let price = title.substr(title.indexOf('$') + 1)
    price = parseFloat(price).toFixed(2)

    output.push({
      index,
      title,
      link,
      price,
      condition
    })
  })
  console.log(output.sort((a, b) => a.price - b.price))
}

function filterByPriceRange (arr, [min, max]) {
  return arr.filter(e => e.price >= min && e.price <= max)
}

function sortByPriceAsc (arr) {
  return arr.sort((a, b) => a.price - b.price)
}
