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
    //result.records.map(record => console.log(record.get(0).properties.message))
    console.log(result.records)
    console.log(result)
  })
}

//No discrimination between a child or channel
function getChildMessagesForNode(nodeId) {
  var session = driver.session();
  console.log(`Obtaining messages for ${nodeId}`)
  return resultPromise = session.run(
    `START n=node(${nodeId}) MATCH (n)-[:IS_PARENT_OF]->(m) return m`
  ).then(result => {
    session.close();
    result.records.map(record => console.log(record.get(0).properties.message))
    return result.records.map(record => record.get(0).properties.message)
  })
  .catch(error => {
    session.close();
    throw error;
  })
}

function getNodeTree(nodeId) {
  var session = driver.session();
  console.log("Obtaining messages for {0}".format(nodeId))
  const resultPromise = session.run(
    `START n=node(${nodeId}) MATCH (n)-[:IS_PARENT_OF*..]->(m) WHERE m.isParent=TRUE RETURN n,m`
  )
}

function makeMessageParentAndCreateChild(nodeId, childMessage) {
  //TODO: Update relationship on nodeId, make it child
  //TODO: Graphical updates to frontend - message has blue dot, tree updated/re-rendered
  var session = driver.session();
  console.log("Making message {0} have child {1}".format(nodeId, childMessage))
  const resultPromise = session.run(
    `START n=node({0}) SET node.isParent=TRUE CREATE (m:Message{message:${childMessage.message}, timestamp: ${childMessage.timestamp}}) CREATE (n)-[r:IS_PARENT_OF]->(m) RETURN n,m`
  )
}

exports.testCreation = testCreation;
exports.getMessages = getMessages;
exports.getChildMessagesForNode = getChildMessagesForNode
exports.getNodeTree = getNodeTree
exports.makeMessageParentAndCreateChild = makeMessageParentAndCreateChild
