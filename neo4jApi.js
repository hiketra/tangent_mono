const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "neo4j"));

function extractPropertiesAndNodeId(properties, identity) {
  return {
    //TODO: Account for low and high math/big ints
    identity: identity.low,
    //this would be a lot easier if I could get the damn babel spread operator working
    message: properties.message,
    timeSeconds: properties.timeSeconds,
    timeMinutes: properties.timeMinitues,
    timeHours: properties.timeHours,
    timeDay: properties.timeDay,
    timeMonth: properties.timeMonth,
    timeYear: properties.timeYear
  }
}

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
    // result.records.map(record => console.log(record.get(0).properties.message))
    // return result.records.map(record => record.get(0).properties.message)
    //result.records.map(record => console.log(record.get(0).properties))
    mapped = result.records.map(record => extractPropertiesAndNodeId(record.get(0).properties, record.get(0).identity))

    // var bigInt = require("big-integer");
    // var jssort = require("js-sorting-algorithms");
    // function comparer(recordA, recordB){
    //   //console.log("record A: " + recordA.timestamp)
    //   var a = bigInt(recordA.timestamp);
    //   //console.log("record castA: " + a)
    //   var b = bigInt(recordB.timestamp);
    //   var comparison = a.compare(b)
    //   //console.log(comparison)
    //   return comparison;
    // }
    // var x = jssort.quickSort(mapped, undefined, undefined, comparer)
    // console.log("SORTED LIST: ***** "+ x)
    // return jssort.quickSort(mapped, undefined, undefined, comparer);
    //
    // // return result.records.map(record => record.get(0).properties)
    return mapped
  })
  .catch(error => {
    session.close();
    throw error;
  })
}

function createNewChannel(channelName) {
  return "boo"
}

function getNodeTree(nodeId) {
  var session = driver.session();
  console.log(`Obtaining messages for ${nodeId}`)
  const resultPromise = session.run(
    `START n=node(${nodeId}) MATCH (n)-[:IS_PARENT_OF*..]->(m) WHERE m.isParent=TRUE RETURN n,m`
  )
}

function makeMessageParentAndCreateChild(nodeId, childMessage) {
  //TODO: Update relationship on nodeId, make it child
  //TODO: Graphical updates to frontend - message has blue dot, tree updated/re-rendered
  var session = driver.session();
  console.log(`Making message ${nodeId} have child ${childMessage}`)
  return resultPromise = session.run(
    `START n=node(${nodeId}) SET n.isParent=TRUE CREATE (m:Message{message:'${childMessage}', timeMilliseconds: '${new Date().getMilliseconds()}', timeSeconds: '${new Date().getSeconds()}', timeMinitues: '${new Date().getMinutes()}', timeHours: '${new Date().getHours()}', timeDay: '${new Date().getDate()}', timeMonth: '${new Date().getMonth()}', timeYear: '${new Date().getFullYear()}'}) CREATE (n)-[r:IS_PARENT_OF]->(m) RETURN m`
  ).then(result => {
    session.close()
    let x = extractPropertiesAndNodeId(result.records[0].get(0).properties, result.records[0].get(0).identity)
    console.log("message bundle:" + JSON.stringify(x, null, 2))
    return x
  })
  .catch(error => {
      session.close();
      throw error;
    })
}

exports.testCreation = testCreation;
exports.getMessages = getMessages;
exports.getChildMessagesForNode = getChildMessagesForNode
exports.getNodeTree = getNodeTree
exports.makeMessageParentAndCreateChild = makeMessageParentAndCreateChild
