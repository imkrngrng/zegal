(() => {
    module.exports = {
        queues: [
            {
                queueName: 'messaging',
                maxPriority: 10,
                priorityValue: 7
            }
        ],
        message: {
            addedToQueue: 'Message is sent successfully',
            addToQueueFailed: 'Message cannot be sent successfully',
            couldNotSavePayload: 'Could not save payload before pushing to queue'
        },
        queueType: {
            messaging: [
                "BLANK_TEMP"
            ]
        }
    }
})();