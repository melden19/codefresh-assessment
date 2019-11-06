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
    container.id = container.id.slice(0, 15);
};

module.exports.getImageAndName = (container) => {
    const output = {};
    output.name = _.get(container, 'Actor.Attributes.name');
    output.image = _.get(container, 'Actor.Attributes.image');
    return output;
};
