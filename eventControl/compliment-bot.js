var api = require('../api/api.js');
var parse = require('../parse/compliment-parse.js')
//var text = require('../localization/text.js');
var events = [];

events['user/follow'] = function(req, res, callback) {
  if(req.body.data.gender === 'F') {
    req.content = 'Здравствуй,милая!Готова быть засыпанной комплиментами каждый день? Напиши-ка что-нибудь...'
  } else {
    req.content = 'Добро пожаловать! У меня ты можешь подобрать для своей милой парочки восхитительные комплименты. Напиши мне что-нибудь...';
  }
  api.createChat(req, res, function(err, res, body) {
    if(err) {
      callback(err);
    }
    req.body.data.chat_id = body.data.id;
    api.sendMessage(req, res, callback);
  });
}
events['message/new'] = function(req, res, callback) {
  parse.getCompliment(function(compliment) {
    req.content = compliment;
    api.sendMessage(req, res, callback); 
  })
  
}
module.exports = events;