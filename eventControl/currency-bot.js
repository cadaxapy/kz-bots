var api = require('../api/api.js');
var text = require('../localization/currency-text.js');
var parse = require('../parse/currency-parse');
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
    db.Currency.findOne({
      where: {
        user_id: req.body.data.id
      }
    }).then(function(user) {
      (new Promise(function(resolve, reject) {
        if(user) {
          return resolve();
        }
        var user = db.Currency.build({
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
    else if(content.length == 2 &&  content.split(' ')[0] == 'city') {
      var cityIndex = content.split[' '][1];
      parse.getCities().then(function(list) {
        if(list[cityIndex] == undefined) {
          return resolve('Неправильный индекс');
        }
        db.Currency.update({city: list[cityIndex].url}, {user_id: sender_id}).then(function(user) {
          parse.getCurrency(user.city, function(parse) {
            return resolve(getBanksList(parse));
          })
        })
      })
    }
    else if(content.split(' ')[0] == 'convert') {
      content = content.toUpperCase();
      var message = "";
      parse.getValutes().then(function(valutes) {
        var splitedContent = content.split(' ');
        if(splitedContent.length != 4 || valutes.indexOf(splitedContent[2]) == -1 || valutes.indexOf(splitedContent[3]) == -1) {
          return resolve('11Некорректный ввод.Введите как на примере:convert 100 RUB EUR.\nДоступные валюты: ' + valutes.join());
        }
        parse.convert({val1: valutes.indexOf(splitedContent[2]), val2: valutes.indexOf(splitedContent[3]), sum: splitedContent[1]}).then(function(items) {
          for(var idx in items) {
            message += splitedContent[1] + ' ' + splitedContent[2] + ' = ' + items[idx].converted + '(' + items[idx].name +')\n';
          }
          return resolve(message);
        });
      });
    }
    else {
      db.Currency.findOne({where: {user_id: sender_id}}).then(function(user) {
        parse.getCurrency(user.city, function(parse) {
          var message = "";
          for(var i = 0; i < parse.length; i++) {
            if(parseInt(content) - 1 == i) {
              message = (parse[i].name+"\n\
            ПОКУПКА     ПРОДАЖА\n\
USD:     "+parse[i].USD.in+"           "+parse[i].USD.out+"\n"+
"EUR:     "+parse[i].EUR.in+"           "+parse[i].EUR.out+"\n"+
"RUB:     "+parse[i].RUB.in+"           "+parse[i].RUB.out+'\n'+
"Обновлено:"+parse[i].time+'\n'+emoji[0]+"Вернуться в меню").trim();
              return resolve(message);
            }
          }
          message = getBanksList(parse);
          return resolve(message);
        })
      })
    }
  })
}
var getBanksList = function(parse) {
  var banks = '';
    for(var i = 0; i < parse.length; i++) {
      var c = i + 1;
      var sign = c > 9 ? emoji[parseInt(c / 10)] + emoji[c % 10] : emoji[c];
      banks=banks+sign+parse[i].name+"\n";
    }
    return 'Выберите цифру нужного банка:\n' + banks;
}

module.exports = events;