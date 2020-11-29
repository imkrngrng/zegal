'use strict';

(() => {
  module.exports = {
    consumer: require('./methods/consumer'),
    provider: require('./methods/provider'),
    push: require('./methods/push')
  }
})();
