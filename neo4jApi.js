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
    // result.records.map(record => console.log(record.get(0).properties.message))
    // return result.records.map(record => record.get(0).properties.message)
    //result.records.map(record => console.log(record.get(0).properties))

    mapped = result.records.map(record => record.get(0).properties)

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
    `START n=node(${nodeId}) SET n.isParent=TRUE CREATE (m:Message{message:'${childMessage}', timestamp: '${Date.now()}'}) CREATE (n)-[r:IS_PARENT_OF]->(m) RETURN n,m`
  ).catch(error => {
      session.close();
      throw error;
    })
}

function sortByTimestamp(list){
  sortedList = list.records.map(record => record.get(0).properties)
  console.log("mapped list: " + sortedList)
  var bigInt = require("big-integer");
  var jssort = require("js-sorting-algorithms");
  function comparer(recordA, recordB){
    //console.log("record A: " + recordA.timestamp)
    var a = bigInt(recordA.timestamp);
    //console.log("record castA: " + a)
    var b = bigInt(recordB.timestamp);
    var comparison = a.compare(b)
    //console.log(comparison)
    return comparison;
  }
  var x = jssort.quickSort(sortedList, undefined, undefined, comparer);
  console.log("SORTED LIST: ***** "+ x)
  return jssort.quickSort(sortedList, undefined, undefined, comparer);
}

exports.testCreation = testCreation;
exports.getMessages = getMessages;
exports.getChildMessagesForNode = getChildMessagesForNode
exports.getNodeTree = getNodeTree
exports.makeMessageParentAndCreateChild = makeMessageParentAndCreateChild
