var api = require('../api/api.js');
var text = require('../localization/chat-text.js');
var parse = require('../parse/currency-parse');
var faker = require('faker');
var db = require('../models');
var config = require('../config.js');
var emoji=['0⃣', '1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'];
var events = [];

events['user/follow'] = function(req, res, callback) {
  req.content = text.hello + '\n' + text.commandInfo;
  api.createChat(req, res, function(err, res, body) {
    db.Chat.findOne({where: {user_id: req.body.data.id}}).then(function(user) {
      (new Promise(function(resolve, reject) {
        if(user) {
          user.set('chat_id', body.data.id);
          return user.save().then(resolve)
        }
        createUser({user_id: req.body.data.id, chat_id: body.data.id})
        .then(resolve);
      })).then(function() {
        req.body.data.chat_id = body.data.id;
        api.sendMessage(req, res, callback);
      })
    })
  });
}
events['user/unfollow'] = function(req, res, callback) {
  db.Chat.update({status: 0}, {where: {user_id: req.body.data.id}}).then(callback)
}
events['message/new'] = function(req, res, callback) {
  var content = req.body.data.content;
  var date = new Date();
  db.Chat.findOne({where: {user_id: req.body.data.sender_id}}).then(function(user) {
    (new Promise(function(resolve, reject) {
      if(!user) {
        createUser({user_id: req.body.data.sender_id, chat_id: req.body.data.chat_id}).then(resolve)
      }
      return resolve(user);
    })).then(function(user) {
      if(date.getHours() < 20 && date.getHours() > 6) {
        req.content = 'Чат работает только с 20:00 до 06:00';
        return api.sendMessage(req, res, callback);
      }
      else if(content == '/start') {
        setStatus({status: 1, sender_id: req.body.data.sender_id}).then(function() {
          req.content = 'Вы подключились к чату.Приятного общения.Чтобы отключиться,введите команду /end';
          api.sendMessage(req, res, callback)
        })
      }
      else if(content == '/end') {
        setStatus({status: 0, sender_id: req.body.data.sender_id}).then(function() {
          req.content = 'Вы отключились.Чтобы обратно начать общение,введите команду /start';
          return callback();
        })
      } else {
        if(user.status == 0) {
          req.content = "Чтобы подключиться к чату,введите команду /start";
          return api.sendMessage(req, res, callback);
        }
        db.ChatMessage.create({
          user_id: req.body.data.sender_id,
          chat_id: req.body.data.chat_id,
          content: req.body.data.content
        }).then(function() {
          db.Chat.findAll({
            where: {
              status: 1,
              user_id: {
                $ne: req.body.data.sender_id
              }
            }
          }).then(function(users) {
            api.sendMessageToAll({sender: user, users: users, token: config.tokens.chat, url: config.production.url, content: req.body.data.content})
            .then(callback).catch(callback);
          });
        });
      }
    });
  });
}


var setStatus = function(data) {
  return db.Chat.update({status: data.status}, {where: {user_id: data.sender_id}})
}

var createUser = function(data) {
  var user_id = data.user_id;
  var chat_id = data.chat_id;
  var user = db.Chat.build({
    user_id: user_id,
    chat_id: chat_id,
    name: faker.lorem.word()
  });
  return user.save();

}
module.exports = events;