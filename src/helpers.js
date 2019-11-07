const _ = require('lodash');

module.exports.logContainer = (message, container) => {
    let str = message;

    if (container.id) {
        str += `\n\tid: ${container.id}`;
    }

    const { image, name } = module.exports.getImageAndName(container);
    if (name) {
        str += `\n\tname: ${name}`;
    }
    if (image) {
        str += `\n\timage: ${image}`;
    }
    console.log(str);
};

module.exports.normalizeId = (container) => {
    container.id = container.id.slice(0, 12);
};

module.exports.getImageAndName = (container) => {
    const output = {};
    output.name = _.get(container, 'Actor.Attributes.name');
    output.image = _.get(container, 'Actor.Attributes.image');
    return output;
};

module.exports.delay = (time) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ StatusCode: 0 });
        }, time);
    });
};
