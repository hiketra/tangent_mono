var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var api = require('./neo4jApi');
var _ = require('lodash');


app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    api.getChildMessagesForNode(375).then(msgs => {
        api.getNodeTree(370).then(tree => {
            res.render('index.ejs', {
                messages: msgs.reverse(),
                nodes: tree
            })
        })
    }).catch(error => {
        console.log(error)
    })
});


io.on('connection', function(socket) {

    socket.on('chat message', function(messageBundle) {
        console.log(`received message:${messageBundle}`)
        api.getNodeTree(370)
        api.makeMessageParentAndCreateChild(messageBundle.parentNode, messageBundle.message).then(msg => {
            io.emit('chat message', msg)
        }).catch(error => {
            console.log(error)
        })
    });
});

http.listen(port, function() {
    console.log('listening on *:' + port);
});
