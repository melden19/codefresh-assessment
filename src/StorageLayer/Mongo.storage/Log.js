const mongoose = require('mongoose');

const logsSchema = new mongoose.Schema({
    _id: String,
    data: String
});

const ContainerLog = mongoose.model('ContainerLog', logsSchema);

module.exports = ContainerLog;
