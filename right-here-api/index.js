var express = require('express');
var zmq = require('zmq');

var app = express();

var sender = zmq.socket('pub');
sender.bindSync('tcp://127.0.0.1:3000');

var receiver = zmq.socket('sub');
receiver.bindSync('tcp://127.0.0.1:3333');
receiver.subscribe('')
var resultsBuffer = {};

receiver.on('message', function(msg) {
  console.log("I got a message", msg, "\n\n")
  if(msg == 'response') return
  msg = JSON.parse(msg);
  if (!resultsBuffer[msg.replyId]) {
    resultsBuffer[msg.replyId] = []
  }
  resultsBuffer[msg.replyId] = resultsBuffer[msg.replyId].concat(msg.data);//Componer resultados
  console.log("I have results..", resultsBuffer[msg.replyId])
});

app.get('/geotimeline', function(req, res) {
  var msgId = 1;
  sender.send(['request', JSON.stringify({replyId: msgId, data: {lat: 43.02345, lon: -7.23456}})]);
  setTimeout(function() {
    res.send(JSON.stringify(resultsBuffer[msgId]));
    resultsBuffer[msgId] = undefined;
  }, 1000);
});

app.listen(8000, function() {
  console.log('Listening on 8000 port');
});
