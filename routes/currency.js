var express = require('express');
var router = express.Router();
var eventControl = require('../eventControl/currency-bot.js')

module.exports = function(app) {
  router.post('/', function(req, res) {
    var event = req.body.event;
    if(!event || !eventControl[event]) {
      return res.json({
        success: false,
        message: 'event is not found'
      })
    }
    eventControl[event](req, res, function(err) {
      if(err) {
        throw new Error(err);
      }
      res.end();
    })
  })

  app.use('/currency', router);
}