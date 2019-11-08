const _ = require('lodash');
const { selector, docker } = require('../../../config');

class StartListener {
    start(containerHandler) {
        return new Promise((resolve, reject) => {
            const filters = this._getApiFilter();
            docker.getEvents({ filters }, (err, events) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Listening for starting containers...');
                    this.events = events;
                    events.on('data', (chunk) => {
                        const containerData = JSON.parse(chunk.toString());
                        if (this._matchLocalFilters(containerData)) {
                            containerHandler(containerData)
                        }
                    });
                    resolve();
                }
            });
        });
    }

    stop() {
        if (this.events) {
            this.events.destroy();
            this.events = null;
            console.log('No longer listen to docker `start` events');
        } else {
            console.log('StartListener already stopped');
        }
    }



    _matchLocalFilters(eventData) {
        const name = _.get(eventData, 'Actor.Attributes.name');
        if (selector.nameRegex && name) {
            return (new RegExp(selector.nameRegex)).test(name);
        }
        return true;
    }

    _getApiFilter() {
        const filter = {};
        _.set(filter, 'event', ['start']);
        _.set(filter, 'label', selector.labels);

        return JSON.stringify(filter);
    }
}

module.exports = new StartListener();
