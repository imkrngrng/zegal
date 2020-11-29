(() => {
  'use strict';
  const socketHelper = require('../../../helper/socket-io.heper');
  module.exports = async (server, users) => {
    try {
      await socketHelper.connect(server, users);
      return true
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
})();
