module.exports.LogsWritter = require('./ContainerLogger.write');
module.exports.LogsWritter = require('./ContainerLogger.read');

const getLogger = (mode) => {
    try {
        return require(`./ContainerLogger.${mode}`);
    } catch (err) {
        throw new Error('Available modes for logger are "read" and "write"');
    }
};

module.exports = getLogger;
