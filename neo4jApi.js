const neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "neo4j"));

function testCreation() {
  var session = driver.session();
  console.log("blah")
  const resultPromise = session.run(
    'CREATE (a: Message {message: "Boo!", timestamp: "10.00"}) RETURN a'
  );

  resultPromise.then(result => {
    session.close();

    const singleRecord = result.records[0];
    const node = singleRecord.get(0);

    console.log(node.properties.message);
    console.log("test!");

    drive.close();
  })
}

function getMessages() {
  var session = driver.session();
  console.log("Obtaining messages...")
  const resultPromise = session.run(
    'MATCH (a:Message) RETURN a'
  )

  resultPromise.then(result => {
    session.close();
    result.records.map(record => console.log(record.get(0).properties.message))
  })
}

//No discrimination between a child or channel
function getChildMessagesForNodes(nodeId) {
  var session = driver.session();
  console.log("Obtaining messages for {0}".format(nodeId))
  const resultPromise = session.run(
    'START n=node({0}) MATCH (n)-[:IS_PARENT_OF]->(m) return n,m'.format(nodeId)
  )
  resultPromise.then(result => {
    session.close();
    result.records.map(record => console.log(record.get(0).properties.message))
  })
}

function getNodeTree(nodeId) {
  var session = driver.session();
  console.log("Obtaining messages for {0}".format(nodeId))
  const resultPromise = session.run(
    'START n=node({0}) MATCH (n)-[:IS_PARENT_OF*..]->(m) WHERE m.isParent=TRUE RETURN n,m'
  )
}

function makeMessageParentAndCreateChild(nodeId, childMessage) {
  //TODO: Update relationship on nodeId, make it child
  //TODO: Graphical updates to frontend - message has blue dot, tree updated/re-rendered
  var session = driver.session();
  console.log("Making message {0} have child {1}".format(nodeId, childMessage))
  const resultPromise = session.run(
    'START n=node({0}) SET node.isParent=TRUE CREATE (m:Message{message:{1}, timestamp: {2}}) CREATE (n)-[r:IS_PARENT_OF]->(m) RETURN n,m'.format(nodeId, childMessage.message, childMessage.timestamp)
  )
}

exports.testCreation = testCreation;
exports.getMessages = getMessages;
exports.getChildMessagesForNodes = getChildMessagesForNodes
exports.getNodeTree = getNodeTree
exports.makeMessageParentAndCreateChild = makeMessageParentAndCreateChild
