var express = require('express');
var zmq = require('zmq');

var app = express();

var sender = zmq.socket('push');
sender.bindSync('tcp://127.0.0.1:3000');

var receiver = zmq.socket('pull');
receiver.bindSync('tcp://127.0.0.1:3333');
var resultsBuffer = {};

receiver.on('message', function(msg) {
  if (!resultsBuffer[msg.replyId]) {
      resultsBuffer[msg.replyId] = []
  }
  resultsBuffer[msg.replyId].concat(msg.data);//Componer resultados
  console.log('Message: %s', msg);
});

app.get('/geotimeline', function(req, res) {
  //res.json({clave:'Hola mundo'});
  var msgId = 1;
  sender.send("rato");
  setTimeout(function() {
    res.send(resultsBuffer[msgId]);
  },5000);
});

app.listen(8000, function() {
  console.log('Listening on 8000 port');
});
