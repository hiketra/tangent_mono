var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var api = require('./neo4jApi');

app.set('view engine', 'ejs');

app.get('/', function(req,res){
  api.getChildMessagesForNode(353).then(msgs => {
    console.log("about to remder page" + msgs)
    debugger;
    console.log("messages:" + msgs)
    res.render('index.ejs', {messages: msgs})
  }).catch(error=> {
    console.log(error)
  })
});

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });

io.on('connection', function(socket){
  //console.log("I'm in the index.js" + api.getChildMessagesForNode(353))
  // api.getChildMessagesForNode(353).then(messages => {
  //   if(!message) return;
  //   io.emit('retrieved_messages', messages);
  // })
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
