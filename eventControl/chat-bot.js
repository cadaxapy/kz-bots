var api = require('../api/api.js');
var text = require('../localization/currency-text.js');
var parse = require('../parse/currency-parse');
var faker = require('faker');
var db = require('../models');
var config = require('../config.js');
var emoji=['0⃣', '1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'];
var events = [];

events['user/follow'] = function(req, res, callback) {
  req.content = text.hello + '\n' + text.commandInfo;
  api.createChat(req, res, function(err, res, body) {
    db.Chat.count({where: {user_id: req.body.data.id}}).then(function(total) {
      if(total > 0) {
        return callback();
      }
      var user = db.Chat.build({
        user_id: req.body.data.id,
        chat_id: body.data.chat_id
      });
      user.save().then(function() {
        callback();
      })
    })
  });
}
events['message/new'] = function(req, res, callback) {
  var content = req.body.data.content;
  if(content == '/start') {
    setStatus({status: 1, sender_id: req.body.data.sender_id}).then(function() {
      return callback();
    })
  }
  if(content == '/end') {
    setStatus({status: 0, sender_id: req.body.data.sender_id}).then(function() {
      return callback();
    })
  }
  db.Chat.findAll({where: {status: 1}}).then(function(users) {
    api.sendMessageToAll({users: users, token: config.tokens.chat, url: config.production.url, content: req.body.data.content})
    .then(callback).catch(callback);
  })
}


var setStatus = function(data) {
  return db.Chat.update({status: data.status}, {where: {user_id: data.sender_id}})
}

module.exports = events;