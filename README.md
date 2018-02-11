# tangent-mono

A node project that uses socket IO and the neo4j database for conversation-tree instant messaging.

Originally forked from the socket io chat example.

## TODO:
[-] Channel search functionality

[-] Add log-in system/user functionality

[-] Use D3 library to render conversation tree

[-] Implememnt back to parent functionality

[-] Split out into different services/no longer 'mono'lith

[-] Account for time zone difference on the client-side (currently statically displaying timestamp retrieved from DB)

[-] Modularise/break down index.js (i.e seperation of socket.io login from route handling)

[-] Bind data coming back from DB to model classes

[-] Add user property to Message objects

[-] Cleanse user input/prevent NoSQL injection

[-] Clean up frontend/get rid of inline CSS/use static directory/etc. (IN PROGRESS)

[X] Live updates of conversation tree based on new messages

[X] Utilise socket.io group broadcasting to update new messages to specific branch of conversation rather than entire channel

[X] Bug fix: prevent from falling over when users try to enter a channel with no messages

[X] Fix alignment of channel-tre

[X] Recursive EJS rendering of channel-tree on frontend

[X] API for getChannelByName

[X] /channel/:nodeId routing, where nodeId is any node with child messages (i.e does not have to have the label of Channel - could be a Message in it self)

[X] Establish basic Neo4j connectivity to retrieve and send messages in a 'flat' channel (e.g not tree-based/single-tier/flat conversation)

[X] Implement ordering of channel messages by timestamp

[X] Add node-inspector

[X] Add in bootstrap CDN

[X] Fix timestamp format

[X] Establish logic/potential data design for switching of branched conversations and how to represent non-root data that has children
