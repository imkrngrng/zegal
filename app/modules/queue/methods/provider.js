'use strict';
const amqplibHelper = require('../../../helper/amqp-helper');
const { queues } = require('../../../configs/queue.config');
// inits provider
module.exports = async (request) => {
  let asserted;
  try {
    let instance = await amqplibHelper.getInstance();
    if (!instance) {
      instance = await amqplibHelper.connect();
    }
    if (instance) {
      let channel = await amqplibHelper.createChannel(instance);
      if (channel) {
        const params = { durable: true, messageTtl: 1000, maxLength: 20 };
        let queue = 'messaging';
        let idx = queues.findIndex(x => x.queueName === queue);
        queues[idx].maxPriority ? params.maxPriority = queues[idx].maxPriority : '';

        asserted = await amqplibHelper.assertQueue(channel, queue, params);
        console.log('>>>>>>>>>>>>>>>')

        if (asserted && Object.keys(asserted).length > 0) {
          const response = await amqplibHelper.sendToQueue(channel, queue, { data: request.body });
          console.log('>>>>>>>>>>>>>>>')
          return response;
        }
      }
    }
  } catch (error) {
    console.error(error);
    console.log('>>>>>>>>>>>>>>>')
    throw error;
  }
}
