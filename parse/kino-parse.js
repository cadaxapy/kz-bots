var request=require("superagent");
var cheerio=require("cheerio");
var utf8=require("utf8");

module.exports.getCities = function() {
  return new Promise(function(resolve, reject) {
    //request({uri: 'http://kino.kz/thisweek.asp', method: 'GET', encoding: "binary"}, function(err, res, page) {
    request.get('http://kino.kz/thisweek.asp').end(function(err, res) {
      var page = res.text;
      var $ = cheerio.load(page);
      var a = [];
      $('select[name="city"] > option').each(function(i, elem) {
        var city = {
          name: $(elem).text().trim(),
          index: $(elem).attr('value')
        };
        a.push(city);
      });
      console.log(a);
      resolve(a);
    })
  })
}

module.exports.getMoviesList = function(data) {
  return new Promise(function(resolve, reject) {
    request.get('http://kino.kz/thisweek.asp?city=' + data.city + '&day=' + data.day).end(function(err, res) {
      var page = res.text;
      var $ = cheerio.load(page);
      var movies = [];
      $('div[class="mov_week"]').each(function(i, elem) {
        if(data.index == i && data.movie) {
          var seances = [];
          $($('div[class="mov_week_detail"]').get(i)).children('div').children('table').children('tr:nth-child(5)').children('td').children('table').children('tr[class="seance_active"]').each(function(idx, tr) {
            var titles = []; 
            $(tr).children('td').each(function(idx, td) {
              titles.push(td);
            })
            var obj = {
              time: $(titles[0]).text().trim(),
              name: $(titles[1]).text().trim(),
              adult: $(titles[4]).text().trim(),
              child: $(titles[5]).text().trim(),
              student: $(titles[6]).text().trim(),
            }
            seances.push(obj);
          });
          return resolve(seances);
          /*
          var movieInfo = {
            originalName: $(titles[1]).children('td:nth-child(1)').children('div[class="title_gray"]').text().trim(),
            name: $(titles[1]).children('td:nth-child(1)').children('div[class="title_red"]').text().trim(),
            rate: $(title[2]).children('td').children('div[class="rate-box"]').children('div[class="star-rate-text"]').children('b').text().trim(),
            voiceCount: $(title[2]).children('td').children('div[class="rate-box"]').children('span').text().trim()
          }*/
        } 
        movies.push($(elem).text().trim());
      });
      if(data.movie) {
        return reject('Неправильный номер фильма')
      }
      resolve(movies);
    })
  })
}

module.exports.getDetailedMovie = function(index) {
  return new Promise(function(resolve, reject) {
    request.get('http://kino.kz/movie.asp?id=' + index).end(function(err, res) {
    })
  })
}