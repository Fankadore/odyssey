"use strict";

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/client/index.html");
});

app.use('/client', express.static(__dirname + '/client'));

server.listen(process.env.PORT || 2000, function() {
  console.log("Server started - Listening on port: " + server.address().port);
});

let SOCKET_LIST = {};

function getLowestId() {
  let id = 0;
  while (SOCKET_LIST[id]) {
    id++;
  }
  return id;
}

io.sockets.on('connection', function(socket) {
  socket.id = getLowestId();
  SOCKET.LIST[socket.id] = socket;
  console.log("New Connecton: " + socket.id)

  socket.on('disconnect', function() {
    delete SOCKET.LIST[socket.id];
  });
});
