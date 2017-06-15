var cheerio = require('cheerio');
var request = require('request');

exports.getCompliment = function(callback) {
  request("http://online-generators.ru/compliments",function(err, res, page) {
    var $ = cheerio.load(page);
    var text = $("div[class='compliment-text']").text();
    callback(text);
  })
}

exports.getQuotes = function(callback) {
  request('http://citaty.info/random', function(err, res, page) {
    var $ = cheerio.load(page);
    var quote = $('div.random__quote > article > div.node__content > ').text().trim();
  })
}