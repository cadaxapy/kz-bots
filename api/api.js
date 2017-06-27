var request = require('request');
var async = require('async');
var api = {};
api.sendMessage = function(req, res, callback) {
  var data = {
    url: req.server.url + '/' + req.body.data.chat_id + '/write',
    method:"POST",
    headers: {
      'X-Namba-Auth-Token': req.server.token
    },
    body: {
      "type":"text/plain",
      "content": req.content
    },
    json: true
  }
  console.log(data);
  setTimeout(function() {
    request(data, callback);
  }, 500);
}
api.createChat = function(req, res, callback) {
  var data = {
    url: req.server.url + '/create',
    method: 'POST',
    headers: {
      'X-Namba-Auth-Token': req.server.token
    },
    body: {
      "members": [req.body.data.id],
      'image': ''
    },
    json: true
  }
  request(data, callback);
}


api.sendMessageToAll = function(data) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      async.each(data.users, function(user, callback) {
        request({
          url: data.url + '/' + user.get('chat_id') + '/write',
          method: 'POST',
          headers: {
            'X-Namba-Auth-Token': data.token, 
          },
          body: {
            "type":"text/plain",
            "content": user.get('name') + ':\n' + data.content
          },
          json: true
        }, callback);
      }, function(err) {
        if(err) {
          return reject(err);
        }
        resolve();
      })
    }, 500)
  })
}

module.exports = api;