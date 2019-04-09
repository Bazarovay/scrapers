const rp = require('request-promise');
const cheerio = require('cheerio');
var books = require('./books.js')
const options = {
  uri: 'https://www.rekhta.org/ebooks/karb-e-agahi-anand-narayan-mulla-ebooks',
  transform: function (body) {
    return cheerio.load(body);
  }
};

const acorn = require('acorn')

rp(options)
  .then(($) => {
    // console.log($('script')[4]['children'][0]['data']);
    js_res = $('script')[4]['children'][0]['data']

    prog_array = js_res.split(/\r?\n/);

    should_start = false

    page_ids = []
    page_data = []
    for (var i = 0; i < prog_array.length; i++){

        cleaned_text = prog_array[i].replace(/ /g,'').replace(/['"]+/g, '')

        if (should_start && cleaned_text.indexOf("]") > -1){
          page_data.push(page_ids)
          page_ids = []
          should_start = false
        }

        if (should_start == true && cleaned_text != "," && cleaned_text != '') {
          page_ids.push(cleaned_text)
        }
        if(!should_start && (cleaned_text.indexOf("varpageIds") > -1 || cleaned_text.indexOf('pages') > -1)) {
          // console.log(cleaned_text)
          should_start = true
        }

    }
    total_pages = page_ids.length
    books.downloadTheBook(page_data)
    // console.log(page_data)

  })
  .catch((err) => {
    console.log(err);
  });
