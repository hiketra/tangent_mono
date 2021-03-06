var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var api = require('./neo4jApi');
var _ = require('lodash');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	api.getChildMessagesForNode(370).then(msgs => {
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

app.get('/chat/:nodeId', function(req, res) {
	let nodeId = req.params.nodeId;
  api.getChannelInfoById(nodeId).then( channelInfo => {
	api.getChildMessagesForNode(nodeId).then(msgs => {
		api.getNodeTree(channelInfo).then(tree => {
      debugger;
			res.render('index.ejs', {
				messages: msgs.reverse(),
				nodes: tree,
        channelId: nodeId
			})
		})
	})})
});



app.get('/create-channel', function(req, res) {
	res.render('createNewChannel.ejs', {})
})

app.post('/channel-creation-complete', function(req, res) {
	api.createNewChannel(req.body.channel.name).then(channel => {
		console.log(channel)
		res.render('channelCreationPage.ejs', {
			identity: channel.channelId
		})
	})
})

app.get('/healthcheck', function(req, res) {
	res.sendStatus(200);
})


io.on('connection', function(socket) {

	socket.on('room', function(room){
		socket.join(room);
	});

	socket.on('chat message', function(messageBundle) {
		console.log(`received message:${messageBundle}`)
		//api.getNodeTree(370)
    debugger;
		var parentNode = messageBundle.parentNode
		api.makeMessageParentAndCreateChild(parentNode, messageBundle.message).then(msg => {
			debugger;
			api.getChannelInfoById(messageBundle.currentRoom).then(channelInfo => {
			api.getNodeTree(channelInfo).then(tree => {
				debugger;
			io.sockets.in(parentNode).emit('chat message', msg);
			io.sockets.in(messageBundle.currentRoom).emit('tree update', tree);
			debugger;
		})})
		}).catch(error => {
			console.log(error)
		})
	});
});

http.listen(port, function() {
	console.log('listening on *:' + port);
});
