var request = require('request');

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
  request(data, callback);
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

module.exports = api;