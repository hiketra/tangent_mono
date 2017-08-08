var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var api = require('./neo4jApi');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  //console.log("I'm in the index.js" + api.getChildMessagesForNode(353))
  api.getChildMessagesForNode(353).then(message => {
    if(!message) return;
    io.emit('chat message', message);
  })
  //io.emit('retrieved_messages', api.getChildMessagesForNode(353))
  //io.emit('messages', api.getMessages)

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    //api.getMessages();
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
