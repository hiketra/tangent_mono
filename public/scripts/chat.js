//these global state vars are clumsy, but at present a quick-fix
var upcomingSubthread = false; //whether the message the user is currently typing
                              //to become part of a subthread

var newParentNodeId = null;         // if there is to be a newParent, what that node ID is

var isOwnMessage = false;
const CHANNEL_ID = -1
const HARDCODED_USER = "Bob";
const HARDCODED_USER_URL = "https://thumbs.dreamstime.com/z/happy-man-perfect-white-smile-thumb-up-isolated-background-40905445.jpg";

/*called onload of the page, obtained from the ESJ of the chat page
initialises certain variables specific to the channel needed for the
chat logic
e.g see the socketio closure
*/
function setup(channelId) {
  CHANNEL_ID = channelId;
}

/*triggered when a user indicates the message
  they are currently typing is a to go into a new thread.
  Updates the global state to reflect this.
*/
function createSubthread(node) {
  console.log("chat.js: in the subthread, setting node to: " + node)
  upcomingSubthread = true;
  newParentNodeId = node;
}

//Adds a new message to a HTML list. Triggered upon receiving a socket.io event
//or when the client clicks send (for their own messages). Or on initial load
//of the page.
function addNewMessageToList(messageBundle) {
  //the new list element to be appended to the message list
  //TODO: Take in boolean to determine message alignment (left or right, could be added to messageBundle)
  let liElement = document.createElement("li");
  liElement.setAttribute("style", "width:100%;")

  liElement.innerHTML =
    `<div class='msj macro'>
      <div class='avatar' style='padding:0px 0px 0px 10px !important'><img class='img-circle' style='width:100%;' src=${HARDCODED_USER_URL} />
      </div>
      <div class='text text-l'>
          <p>${messageBundle.message}</p>
          <div style='display: inline-flex; width: 100%'>
              <div style='display: flex; align-items: left;'>
                  <p style=' width: 90%;'><small>Sent by ${HARDCODED_USER} at ${messageBundle.timeHours:messageBundle.timeMinutes}</small></p>
              </div>
              <div style='display: flex; align-items: right;'>
                  <p style='float:left; text-align: left; width: 5%;'><small><a href=${'chat/' + messageBundle.identity}>#${messageBundle.identity}</a></small></p>
              </div>
          </div>
      </div>
  </div>`

  $('#messages').append(liElement);
}


//socketIO logic and send message logic
$(function() {
  //TODO: does this really need to be a closure...

  var socket = io.connect();
  socket.on('connect', function() {
    socket.emit('room', CHANNEL_ID)
  })

  $('form').submit(function() {
    debugger;
    if (subthreadCreation) {
      var channel = newParent;
    } else {
      var channel = <%=channelId%>;
    }
    console.log(subthreadCreation)
    var msg = $('#m').val()
    console.log(channel)
    console.log(msg)
    var messageBundle = {
      currentRoom: <%=channelId%>,
      parentNode: channel,
      message: msg.toString()
    }
    console.log(`bundle node ${messageBundle.parentNode} message ${messageBundle.message}`)
    console.log("Inside the page" + messageBundle)
    socket.emit('chat message', messageBundle);
    $('#m').val(''); //TODO: update this clearing down of the message logic (e.g wipe out the subthread box too)
    subthreadCreation = false;
    return false;
    debugger;
  });

  //Upon a new message being sent by a user
  socket.on('chat message', function(messageBundle) {
    addNewMessageToList(messageBundle);
    debugger;
    window.scrollTo(0, document.body.scrollHeight);
  });

  //TODO: Legacy?
  // socket.on('retrieved_messages', function(messages) {
  //   $('#messages').append($('<li>').text(messages));
  //   window.scrollTo(0, document.body.scrollHeight);
  // });

  /*Whenever a new child has been created in the channel a 'tree update'
  event is sent out of the entire tree (tremendously inefficient, I know) to all clients/
  sockets in the room/channel.
  This then triggers the rerendering of the entire tree.*/
  socket.on('tree update', function(tree) {
    debugger;
    console.log(tree);
    var listTree = ``;
    if('children' in tree){
    console.log(`obtained nodes ${JSON.stringify(tree, null, 2)}`);
    debugger;
    function traverse(branches) {
      debugger;
      for(let i=0; i < branches.length; i++) {
        // console.log(branches)
        debugger;
        obj = branches[i]
        console.log(obj)
        listTree += `<li id=${obj.id}> <a href='/chat/${obj.id}'>${obj.message} </a>`;
        if(obj.hasOwnProperty('children')) {
          debugger;
          listTree += `<ul id=${obj.id}>`;
          traverse(branches[i].children);
          listTree += `</ul>`
        }
        else {
          debugger;
        }
        listTree += ` </li>`;
      }
    }
    console.log(`child nodes to be processed nodes ${JSON.stringify(tree.children, null, 2)}`);
    traverse(tree.children)
  }
  debugger;
      $('#updateable').empty().append(listTree);
  });
})
