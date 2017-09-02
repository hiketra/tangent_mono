const neo4j = require('neo4j-driver').v1;
const FlatToNested = require('flat-to-nested');
const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "neo4j"));

function extractPropertiesAndNodeId(properties, identity) {
  return {
    //TODO: Account for low and high math/big ints, just do a search for identity.low
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

//No discrimination between a child or channel
function getChildMessagesForNode(nodeId) {
  var session = driver.session();
  console.log(`Obtaining messages for ${nodeId}`)
  return resultPromise = session.run(
    `START n=node(${nodeId}) MATCH (n)-[:IS_PARENT_OF]->(m) return m`
  ).then(result => {
    session.close();
    mapped = result.records.map(record => extractPropertiesAndNodeId(record.get(0).properties, record.get(0).identity))
    return mapped
  })
  .catch(error => {
    session.close();
    throw error;
  })
}

function createNewChannel(channelName) {
//TODO:
  return "i'm unimplemented :)"
}

function getNodeTree(nodeId) {
  var session = driver.session();
  console.log(`Obtaining messages for ${nodeId}`)
  return resultPromise = session.run(
    `START n=node(${nodeId}) MATCH (n)-[r*..]->(m) WHERE m.isParent=TRUE RETURN EXTRACT(rel IN r | [startNode(rel),endNode(rel)]) as nodePairCollection`
  ).then(results => {
    session.close()

    function extraction(relation) {
      //takes in result.get(0)
      let relationDegree = relation.length-1 //0-indexed tree-level
      let maxRecord = relation[relationDegree]
      let parent = maxRecord[0].identity.low
      let child = maxRecord[1].identity.low
      return {
        parent: parent,
        id: child,
        message: maxRecord[1].properties.message
      }
    }
    console.log(results)

    let extracted = results.records.map(result => extraction(result.get(0)))
    extracted.push({id: 370})
    flatToNested = new FlatToNested();
    let flattened = flatToNested.convert(extracted)
    console.log("flattened:" + flattened)
   return flattened
  }).catch(error => {
      session.close();
      console.log(error)
      throw error;
    })
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

exports.getChildMessagesForNode = getChildMessagesForNode
exports.getNodeTree = getNodeTree
exports.makeMessageParentAndCreateChild = makeMessageParentAndCreateChild
