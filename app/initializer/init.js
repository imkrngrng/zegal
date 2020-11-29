'use strict';

const amqpinit = require('../helper/amqp-helper');
module.exports = () => {
    try {
        amqpinit.init();
    } catch (error) {
        console.log(error)
        throw error
    }
}
