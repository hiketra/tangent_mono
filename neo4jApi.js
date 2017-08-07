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

exports.testCreation = testCreation;
exports.getMessages = getMessages;
