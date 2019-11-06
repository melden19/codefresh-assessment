const EventEmitter = require('events');
const Docker = require('dockerode');
const _ = require('lodash');
const { selector, docker } = require('../../config');

class Listener extends EventEmitter {
    start() {
        const filters = this._getApiFilter();
        docker.getEvents({ filters }, (err, events) => {
            if (err) {
                console.error(err)
            } else {
                console.log('Listening for starting containers...');

                this.events = events;
                events.on('data', (chunk) => {
                    const data = JSON.parse(chunk.toString());
                    if (this._matchLocalFilters(data)) {
                        this.emit('container_start', data);
                    }
                });
            }
        });
    }

    stop() {
        if (this.events) {
            this.events.destroy();
            this.events = null;
            console.log('No longer listen to docker `start` events');
        } else {
            console.log('Listener already stopped');
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

module.exports = new Listener();
