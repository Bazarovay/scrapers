const request = require('request');

https://www.rekhta.org/ebooks/arooz-aahang-aur-bayan-shamsur-rahman-faruqi-ebooks


request({
    headers: {
      'Origin': "https://www.rekhta.org",
      'Referrer': 'https://www.rekhta.org/ebooks/arooz-aahang-aur-bayan-shamsur-rahman-faruqi-ebooks',
      'Accept': "application/json, text/javascript, */*; q=0.01",
      "User-Agent":"Mozilla/5.0 (Windows; U; Windows NT 5.1; en-GB; rv:1.8.1.6) Gecko/20070725 Firefox/2.0.0.6"
    },
    uri: 'https://rbookscdn.azureedge.net/images/e7d155dd-5522-4c56-8ba6-f86f413323a5/001.jpg',
    json: true,
    method: 'GET',
    encoding: 'binary'
  }, function (err, res, body) {
    //it works!
    // var data = img.replace(/^data:image\/\w+;base64,/, "");
    var fs = require('fs');
    fs.writeFile('downloaded.jpg', body, 'binary', function (err) {});


    const loadImage = require('canvas')
    const createCanvas = require('canvas')
    const { Image } = require('canvas');



      request({
          headers: {
            'Origin': "https://www.rekhta.org",
            'Referrer': 'https://www.rekhta.org/ebooks/arooz-aahang-aur-bayan-shamsur-rahman-faruqi-ebooks',
            'Accept': "application/json, text/javascript, */*; q=0.01",
            "User-Agent":"Mozilla/5.0 (Windows; U; Windows NT 5.1; en-GB; rv:1.8.1.6) Gecko/20070725 Firefox/2.0.0.6"
          },
          uri: 'https://rbookscdn.azureedge.net/api_getebookpagebyid/?pageid=f98781b8-db68-42f3-acc9-74a06abe2637',
          json: true,
          method: 'GET'
        }, function (err, res, data) {
          //it works!
          // console.log(data);

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
              swapped_image = fs.readFileSync('downloaded.jpg')

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
              fs.writeFile('new_image.png', buf);


            } catch (e) {
                console.log(e)
            }

        });


    });
