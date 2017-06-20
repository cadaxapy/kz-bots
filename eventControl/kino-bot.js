var api = require('../api/api.js');
var text = require('../localization/kino-text.js');
var parse = require('../parse/kino-parse');
var db = require('../models');
var emoji=['0⃣', '1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'];
var events = [];

events['user/follow'] = function(req, res, callback) {
  req.content = text.hello + '\n' + text.commandInfo;
  api.createChat(req, res, function(err, res, body) {
    console.log(body);
    if(err) {
      return callback(err);
    }
    db.Kino.findOne({
      where: {
        user_id: req.body.data.id
      }
    }).then(function(user) {
      (new Promise(function(resolve, reject) {
        if(user) {
          return resolve();
        }
        var user = db.Kino.build({
          user_id: req.body.data.id
        });
        user.save().then(function() {
          resolve();
        })
      })).then(function() {
        req.body.data.chat_id = body.data.id;
        api.sendMessage(req, res, callback);
      }).catch(function(e) {
        console.log(e);
      })
    })
  });
}
events['message/new'] = function(req, res, callback) {
  answers(req).then(function(message) {
    req.content = message;
    api.sendMessage(req, res, callback)
  }).catch(function(e) {
    callback(e);
  }); 
}


var answers = function(req) {
  var content = req.body.data.content.toLowerCase();
  var sender_id = req.body.data.sender_id;
  return new Promise(function(resolve, reject) {
    db.Kino.findOne( { where: { user_id: sender_id } }).then(function(kino) {
      switch(kino.state) {
        case 0:
          if(content == 'help') {
            return resolve(text.commandInfo);
          }
          else if(content == 'city') {
            var message = 'Список городов: \n';
            parse.getCities().then(function(list) {
              for(var i = 0; i < list.length; i++) {
                message = message + i + ' - ' + list[i].name + '\n';
              }
              message = message + '\n' + 'Чтобы выбрать город введите команду city и индекс города,например: "city 1"';
              return resolve(message);
            })
          }
          else if(content.split(' ').length == 2 &&  content.split(' ')[0] == 'city') {
            var cityIndex = content.split(' ')[1];
            parse.getCities().then(function(list) {
              if(list[cityIndex] == undefined) {
                return resolve('Неправильный индекс');
              }
              kino.set('city', list[cityIndex].index);
              kino.save().then(function() {
                parse.getCurrency(list[cityIndex].index, function(parse) {
                  return resolve(getBanksList(parse));
                });
              });
            });
          }
          else if(content.split(' ').length == 2 && content.split(' ')[0] == 'day') {
            content = content.split(' ')[1];
            var validDays = [1, 2 , 3];
            if(validDays.indexOf(parseInt(content)) == -1 ) {
              return resolve('Невалидный день');
            } 
            parse.getMoviesList({day: content - 1, city: kino.city}).then(function(moviesList) {
              kino.set('state', 1);
              kino.set('day', content - 1)
              kino.save().then(function() {
                return resolve(getMoviesList(moviesList));
              })
            })
          }
          else {
            return resolve(text.commandInfo);
          }
          break;
        case 1:
          parse.getMoviesList({day: kino.day, city: kino.city, index: content - 1, movie: true}).then(function(movies) {
            kino.set('state', 0);
            kino.set('day', 0);
            kino.save().then(function() {
              return resolve(getMovieTime(movies));
            })
          }).catch(function(e) {
            return resolve(e);
          })
      }
    })
  });
}
var getMoviesList = function(parse) {
  var banks = '';
    for(var i = 0; i < parse.length; i++) {
      var c = i + 1;
      var sign = c > 9 ? emoji[parseInt(c / 10)] + emoji[c % 10] : emoji[c];
      banks=banks+sign+parse[i]+"\n";
    }
    return 'Выберите цифру нужного фильма:\n' + banks;
}

var getMovieTime = function(parse) {
  var item = '';
  for(var i = 0; i < parse.length; i++) {
    item += 'Имя:' + parse[i].name + '\nВремя:' + parse[i].time + '\nБилеты:\n' + '  Взрослые: ' + parse[i].adult + '\n  Дети: ' + parse[i].child + '\n  Студенты: ' + parse[i].student + '\n\n'; 
  }
}
module.exports = events;