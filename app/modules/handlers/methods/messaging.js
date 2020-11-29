
(() => {
    'use strict';
    const socketHelper = require('../../../helper/socket-io.heper')

    module.exports = async (channel, bufferDataContent, msg) => {
        try {
            const payload = JSON.parse(bufferDataContent.toString());
            socketHelper.broadcast(payload);
            channel.ack(msg);
            return true;
        } catch (error) {
            throw error
        }
    }
})();