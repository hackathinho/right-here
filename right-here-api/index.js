var express = require('express');
var zmq = require('zmq');

var app = express();

var sender = zmq.socket('pub');
sender.bindSync('tcp://127.0.0.1:3000');

var receiver = zmq.socket('pull');
receiver.bindSync('tcp://127.0.0.1:3333');
var resultsBuffer = {};

receiver.on('message', function(msg) {
  console.log("I got a message", msg, "\n\n")
  if (msg == 'response') return

  msg = JSON.parse(msg);
  if (!resultsBuffer[msg.replyId]) {
    resultsBuffer[msg.replyId] = []
  }

  resultsBuffer[msg.replyId] = resultsBuffer[msg.replyId].concat(msg.data);//Componer resultados
  console.log("I have results..", resultsBuffer[msg.replyId])
});

app.get('/geotimeline', function(req, res) {
  var msgId = 1;
  sender.send(JSON.stringify({replyId: msgId, data: {lat: req.query.lat, lon: req.query.lon}}));
  setTimeout(function() {
    res.send(resultsBuffer[msgId]);
    resultsBuffer[msgId] = []
  },1000);
});

app.listen(8000, function() {
  console.log('Listening on 8000 port');
});
