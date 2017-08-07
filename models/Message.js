var _ = require('lodash');

function Message(_node) {
  _.extend(this, _node.properties);

  if(this.id) {
    this.id =  this.id.toNumber();
  }
  if(this.duration) {
    this.duration = this.duration.toNumber();
  }
}

module.exports = Message
