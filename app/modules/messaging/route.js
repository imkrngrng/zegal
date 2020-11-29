'use strict';

(() => {
    const express = require('express');
    const messageRoute = express.Router();
    const messageController = require('.');
    messageRoute.route('/push').post(messageController.pushMessage);

    module.exports = messageRoute;
})();
