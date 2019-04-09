const request = require('request');

// https://www.rekhta.org/ebooks/arooz-aahang-aur-bayan-shamsur-rahman-faruqi-ebooks
// First call to image
// save the image
// second call to get the assemble vectors
//
base_url = "https://www.rekhta.org/ebooks/kufr-o-iman-hari-chand-akhtar-ebooks"
book_url = "https://rbookscdn.azureedge.net/images/25df4410-9310-4c75-9f37-e518ab2e1dac/"
module.exports = {
  downloadTheBook: function(array) {
    // console.log(array)
    num_of_pages = array[0].length
    // num_of_pages = 1
    n = 0
    page_num = array[0][n]
    page_key = array[1][n]
    runTheProg(page_num, page_key, n, array)

  }
}

function runTheProg(page_num,page_key, n, array) {


  getScrambledImage(page_num, page_key, n).then(function(result) {
          console.log("Downloading " + result);
          console.log(n)
          console.log(num_of_pages)
          n += 1;
          page_num = array[0][n]
          page_key = array[1][n]
          if (n < (num_of_pages - 1)){
            runTheProg(page_num, page_key, n, array)
          } else {
            resolve("Complete")
          }

      }, function(err) {
          console.log(err);
          reject("We failed")

  })

}

function getScrambledImage(page_num, page_key, n) {

return new Promise(function(resolve, reject) {

    request({
        headers: {
          'Origin': "https://www.rekhta.org",
          'Referrer': base_url,
          'Accept': "application/json, text/javascript, */*; q=0.01",
          "User-Agent":"Mozilla/5.0 (Windows; U; Windows NT 5.1; en-GB; rv:1.8.1.6) Gecko/20070725 Firefox/2.0.0.6"
        },
        uri: book_url+page_num,
        json: true,
        method: 'GET',
        encoding: 'binary'
      }, function (err, res, body) {
        //it works!
        // var data = img.replace(/^data:image\/\w+;base64,/, "");
        callback(page_num, body, page_key, n).then(function(result) {
                  console.log("Initialized user details");
                  resolve("Images downloadded");
              }, function(err) {
                  console.log(err);
          })

        });

})
}

function callback(page_num, body, page_key, n) {

return new Promise(function(resolve, reject) {

  console.log(page_num)
  var fs = require('fs');
  fs.writeFileSync('downloaded'+page_num, body, 'binary', function (err) {});


  const loadImage = require('canvas')
  const createCanvas = require('canvas')
  const { Image } = require('canvas');



    request({
        headers: {
          'Origin': "https://www.rekhta.org",
          'Referrer': base_url,
          'Accept': "application/json, text/javascript, */*; q=0.01",
          "User-Agent":"Mozilla/5.0 (Windows; U; Windows NT 5.1; en-GB; rv:1.8.1.6) Gecko/20070725 Firefox/2.0.0.6"
        },
        uri: 'https://rbookscdn.azureedge.net/api_getebookpagebyid/?pageid='+page_key,
        json: true,
        method: 'GET'
      }, function (err, res, data) {
        //it works!
        // console.log(data);
        if (err) {
           reject(err);
        }

        try {
            var p = data.PageId;
            originalHeight = data.PageHeight;
            originalWidth = data.PageWidth;
            if(originalHeight <= 0)
            {
                originalHeight = 1100;
            }
            if(originalWidth <= 0)
            {
                originalWidth = 1000;
            }
            var s = 50;
            var m = parseInt(50);

            var h = 50 * parseInt(data.Y);
            var w = 50 * parseInt(data.X);

            if(data.PageHeight>0)
            {
                h = data.PageHeight;
            }
            if(data.PageWidth>0)
            {
                w = data.PageWidth;
            }

            var data = data
            swapped_image = fs.readFileSync('downloaded'+page_num)

            img = new Image;
            img.src = swapped_image;

            const canvas = require('canvas')
            var c = new canvas(200, 200)

            c.height = h;
            c.width = w;

            var ctx = c.getContext('2d');
            ctx.clearRect(0, 0, w, h)

            totalPageCount = data.Sub.length

            for (var i = 0; i < data.Sub.length; i++) {
                ctx.drawImage( img, data.Sub[i].X1 * (s + 16), data.Sub[i].Y1 * (s + 16), s, s, data.Sub[i].X2 * m, data.Sub[i].Y2 * m, m, m);
            }

            img = c.toDataURL("image/jpg")
            var data = img.replace(/^data:image\/\w+;base64,/, "");
            var buf = new Buffer(data, 'base64');
            fs.writeFileSync('page_number'+n+'.png', buf);
            resolve("Done");

          } catch (e) {
              console.log(e)
          }

      });
    })
}
