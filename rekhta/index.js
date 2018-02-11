const rp = require('request-promise');
const cheerio = require('cheerio');
const options = {
  uri: 'https://www.rekhta.org/ebooks/arooz-aahang-aur-bayan-shamsur-rahman-faruqi-ebooks',
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
    should_stop = false
    page_ids = []
    for (var i = 0; i < prog_array.length; i++){

        cleaned_text = prog_array[i].replace(/ /g,'').replace(/['"]+/g, '')

        if (should_start && cleaned_text.indexOf("]") > -1){
          break;
        }

        if (should_start == true && cleaned_text != "," && cleaned_text != '') {
          page_ids.push(cleaned_text)
        }
        if(!should_start && cleaned_text.indexOf("varpageIds") > -1) {
          should_start = true
        }

    }
    total_pages = page_ids.length
    console.log(page_ids)

  })
  .catch((err) => {
    console.log(err);
  });
