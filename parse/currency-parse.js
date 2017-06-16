var request=require("request");
var cheerio=require("cheerio");
var utf8=require("utf8");

module.exports.getCities = function() {
  return new Promise(function(resolve, reject) {

    request({url: 'https://kurs-valut.kz/kurs/almaty', method: 'GET', encoding:"binary"}, function(err, res, page) {
      var $ = cheerio.load(page);
      var a = [];
      $('div[class="modal-dialog"] > div > div[class="modal-body"] > ul > li').each(function(i, elem) {
        var city = {
          name: utf8.decode($(elem).text().trim()),
          url: $(elem).children('a').attr('href')
        };
        a.push(city);
      });
      resolve(a);
    })
  })
}
module.exports.getCurrency = function(city, callback) {
  request({uri: "https://kurs-valut.kz" + city, method:"GET", encoding:"binary"}, function(err,res,page) {
    var $ = cheerio.load(page);
    var array = [];
    console.log(res);
    $('div[id="tab-1"] > div > table > tbody > tr').each(function(i, elem) {
      var titles = [];
      $(elem).children('td').each(function(index, values) {
        titles.push(values);
      })
      obj = {
        name: utf8.decode($(titles[1]).children('a').text().trim()),
        USD: {
          in: $(titles[2]).text().trim(),
          out: $(titles[3]).text().trim()
        },
        EUR: {
          in: $(titles[4]).text().trim(),
          out: $(titles[5]).text().trim()
        },
        RUB: {
          in: $(titles[6]).text().trim(),
          out: $(titles[7]).text().trim()
        },
        time: utf8.decode($(titles[1]).children('div').text().trim())
      }
      array.push(obj);
    })
    callback(array);
  })
}
module.exports.getValutes = function() {
  return new Promise(function(resolve, reject) {
    request({url: 'https://kurs.kz/index.php?s=default&mode=calk', method: 'GET', encoding: 'binary'}, function(err, res, page) {
      var $ = cheerio.load(page);
      var valutes = [];
      $('select[name="val1"] > option').each(function(i, elem) {
        valutes.push($(elem).text().trim());
      })
      resolve(valutes);
    })
  })
}
module.exports.convert = function(data) {
  return new Promise(function(resolve, reject) {
    request({url: 'https://kurs.kz/index.php?s=default&mode=calk&val1=' + data.val1 + '&val2=' + data.val2 + '&sum=' + data.sum, method: 'GET', encoding: 'binary'}, function(err, res, page) {
      var $ = cheerio.load(page);
      var converts = [];
      $('table[bgcolor="#BDBABD"]  > tr[bgcolor="#F9F9F9"]').each(function(i, elem) {
        var tds = [];
        $(elem).children('td').each(function(idx, td) {
          tds.push(utf8.decode($(td).text().trim()));
        })
        var obj = {
          name: tds[0],
          converted: tds[2]
        }
        converts.push(obj)
      });
      console.log(converts);
      resolve(converts);
    })
  })
}