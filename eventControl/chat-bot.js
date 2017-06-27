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
        var user = db.Chat.build({
          user_id: req.body.data.id,
          chat_id: body.data.id,
          name: faker.lorem.word()
        });
        user.save().then(resolve);
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
  db.Chat.findOne({where: {user_id: req.body.data.sender_id}}).then(function(user) {
    if(content == '/start') {
      setStatus({status: 1, sender_id: req.body.data.sender_id}).then(function() {
        return callback();
      })
    }
    else if(content == '/end') {
      setStatus({status: 0, sender_id: req.body.data.sender_id}).then(function() {
        return callback();
      })
    } else {
      if(user.status == 0) {
        req.content = "Чтобы подключится к чату,введите команду /start";
        return api.sendMessage(req, res, callback);
      }
      db.Chat.findAll({
        where: {
          status: 1,
          user_id: {
            $ne: req.body.data.sender_id
          }
        }
      }).then(function(users) {
        api.sendMessageToAll({users: users, token: config.tokens.chat, url: config.production.url, content: req.body.data.content})
        .then(callback).catch(callback);
      })
    }
  })
}


var setStatus = function(data) {
  return db.Chat.update({status: data.status}, {where: {user_id: data.sender_id}})
}

module.exports = events;