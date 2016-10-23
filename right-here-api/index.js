var express = require('express');
var zmq = require('zmq');

var app = express();

var sender = zmq.socket('push');
sender.bindSync('tcp://127.0.0.1:3000');

var receiver = zmq.socket('pull');
receiver.bindSync('tcp://127.0.0.1:3333');
var resultsBuffer = {};

receiver.on('message', function(msg) {
  msg = JSON.parse(msg);
  if (!resultsBuffer[msg.replyId]) {
      resultsBuffer[msg.replyId] = []
  }
  resultsBuffer[msg.replyId].push(msg.data);//Componer resultados
});

app.get('/geotimeline', function(req, res) {
  //res.json({clave:'Hola mundo'});
  var msgId = 1;
  sender.send(JSON.stringify({replyId: msgId, data: {lat: 43.02345, lon: -7.23456}}));
  setTimeout(function() {
    res.send(resultsBuffer[msgId]);
  },5000);
});

app.listen(8000, function() {
  console.log('Listening on 8000 port');
});
