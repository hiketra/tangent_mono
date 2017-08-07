var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var api = require('./neo4jApi');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    api.getMessages();
  });
});

// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     api.testCreation;
//     console.log("something");
//     io.emit('chat message', msg);
//   }
//   });
// );

http.listen(port, function(){
  console.log('listening on *:' + port);
});
