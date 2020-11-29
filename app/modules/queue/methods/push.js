'use strict';
const initProvider = require('./provider');
const { message: { addedToQueue, addToQueueFailed } } = require('../../../configs/queue.config')
const HTTPStatus = require('http-status');

module.exports = async (call, callback) => {
    try {
        const sent = await initProvider(call);
        return callback(null, { status: sent ? HTTPStatus.OK : HTTPStatus.INTERNAL_SERVER_ERROR, message: sent ? addedToQueue : addToQueueFailed })
    } catch (error) {
        return callback(null, error);
    }
}