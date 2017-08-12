var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var api = require('./neo4jApi');
var _ = require('lodash');


app.set('view engine', 'ejs');

app.get('/', function(req,res){
  api.getChildMessagesForNode(370).then(msgs => {
    console.log("obtained: " + msgs)
    console.log("about to remder page" + msgs)
    debugger;
    res.render('index.ejs', {messages: msgs.reverse()})
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

  socket.on('chat message', function(messageBundle){
    console.log(`received message:${messageBundle}`)
    api.makeMessageParentAndCreateChild(messageBundle.parentNode, messageBundle.message).then(x=>{
    io.emit('chat message', messageBundle.message)}
  ).catch(error => {console.log(error)})
      //api.getMessages();
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
