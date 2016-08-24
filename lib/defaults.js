'use strict';

const _ = require('lodash');

module.exports = (opts) => {
    return _.defaults(opts || {}, {
        level: 2
    });
};
