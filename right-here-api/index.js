var express = require('express');
var zmq = require('zmq');

var app = express();

var publisher = zmq.socket('pub');
publisher.bindSync('tcp://127.0.0.1:3000');

var subscriber = zmq.socket('sub');
subscriber.connect('tcp://127.0.0.1:3000');
subscriber.subscribe('response');
var resultsBuffer = {};
subscriber.on('message', function(topic, msg) {
  resultsBuffer[msg.replyId].concat(msg.data);//Componer resultados
  console.log('Topic %s: %s', topic.toString(), msg.toString());
});

app.get('/geotimeline', function(req, res) {
  //res.json({clave:'Hola mundo'});
  var msgId = 1;
  publisher.send(['request', {replyId: msgId, data: {lat: 43.02345, lon: -7.23456}}]);
  setTimeout(function() {
    res.send(resultsBuffer[msgId]);
  },5000);
});

app.listen(8000, function() {
  console.log('Listening on 8000 port');
});
