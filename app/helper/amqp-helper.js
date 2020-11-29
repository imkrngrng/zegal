'use strict';
const amqplib = require('amqplib');
const { queues } = require('../configs/queue.config');
const { v4: uuidv4 } = require('uuid');

((helper) => {

    let _instance = Object.create({});

    helper.getInstance = () => {
        return _instance;
    }

    helper.connect = async () => {
        try {
            console.log(`Connecting to amqp in : ${process.env.AMQP_HOST} in ${new Date()}`);
            _instance = await amqplib.connect(`${process.env.AMQP_HOST}`);
            return _instance;
        } catch (error) {
            console.error(error)
            log.error({}, error, process.env.SERVICE_NAME, __filename);
            throw error
        }
    }

    helper.createChannel = async (instance) => {
        return await instance.createChannel();
    }

    helper.assertQueue = async (channel, queue, params) => {
        return await channel.assertQueue(queue, params);
    }

    helper.sendToQueue = async (channel, queue, data) => {
        try {

            const extraParams = { messageId: uuidv4(), persistance: true };
            let idx = queues.findIndex(x => x.queueName === queue);
            queues[idx].priorityValue = data.data.priority;
            // queues[idx].priorityValue ? extraParams.priority = queues[idx].priorityValue : '';
            if (queues[idx].priorityValue >= 7) {
                setTimeout(async () => {
                    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(data.data)), extraParams);
                }, 1000 / 20);
            }
            return true
        } catch (error) {
            throw error
        }
    }

    helper.consume = async (channel, queue, queueName, callback) => {
        await channel.consume(queue, async (msg) => {
            callback(channel, queueName, msg);
        });

    }

})(module.exports);