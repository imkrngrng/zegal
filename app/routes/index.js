'use strict';

const express = require('express');
const router = express.Router();

(() => {
  // exchnage rate route
  const messageRoute = require('../modules/messaging/route');
  router.use('/message', messageRoute);

  module.exports = router;
})();
