(() => {
  'use strict';
  const amqplibHelper = require('../../../helper/amqp-helper');
  const qConfig = require('../../../configs/queue.config');
  const handler = require('../../handlers');

  const consumerCallback = async (channel, queueName, msg) => {
    try {
      if (msg && msg.content) {
        const messageContent = JSON.parse(msg.content.toString());
        const dataContent = JSON.stringify(messageContent);
        const bufferDataContent = new Buffer(dataContent);
        return handler[queueName] ?
          await handler[queueName](channel, bufferDataContent, msg) :
          await handler['messaging'](channel, bufferDataContent, msg);
      }
    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  // inits consumers
  module.exports = async () => {
    // const metaData = grpcMetaHelper.getMetadata(call.metadata);
    try {
      let channel, asserted, params;
      const instance = await amqplibHelper.connect();
      if (instance) {
        qConfig.queues.forEach(async (queue, index) => {
          let { queueName, maxPriority, priorityValue } = queue;
          channel = await amqplibHelper.createChannel(instance);
          if (channel) {
            params = { durable: true, messageTtl: 1000, maxLength: 20 };
            maxPriority ? params.maxPriority = maxPriority : '';
            asserted = await amqplibHelper.assertQueue(channel, queueName, params);

            if (asserted && Object.keys(asserted).length > 0) {
              console.log(`${queueName} consumer initiated on ${new Date()}`)
              await amqplibHelper.consume(channel, queueName, queueName, consumerCallback);
            }
          }
        });
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
})();
