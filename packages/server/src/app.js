const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const chalk = require('chalk');

const { mongo } = require('../config');
const index = require('./api/index');

const app = express();
const server = http.createServer(app);

/**
 * Connect to MongoDB.
 */
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(mongo.uri)
    .then(() => console.log(`CONNECTED TO ${mongo.uri}`))
    .catch(err => {
        console.error(err);
        console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
        process.exit();
    });

/**
 * Express configuration.
 */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/api', index);

app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});

server.listen(process.env.PORT || 8080);

module.exports = app;
