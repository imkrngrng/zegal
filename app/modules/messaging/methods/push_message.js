const httpStatus = require('http-status');

(() => {
    const httpStatus = require('http-status');
    const initProvider = require('./../../queue/methods/provider');
    module.exports = async (req, res) => {
        try {
            const sent = await initProvider(req);
            return res
                .status(httpStatus.OK)
                .send({ status: sent ? httpStatus.OK : httpStatus.INTERNAL_SERVER_ERROR, message: 'success' });

        } catch (err) {
            console.log(err)
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .send({ status: httpStatus.INTERNAL_SERVER_ERROR, message: err });

        }
    }
})();
