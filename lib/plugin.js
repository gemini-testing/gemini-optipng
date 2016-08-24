'use strict';

const chalk = require('chalk');
const _ = require('lodash');

const defaults = require('./defaults');
const Optimizer = require('./optimizer');

const validateOpts = (opts) => {
    if (opts.level < 0 || !Number.isInteger(opts.level)) {
        throw new Error(
            `${chalk.red('gemini-optipng')}: Level option must be a positive integer number from 0 to 7`
        );
    }
};

module.exports = (gemini, opts) => {
    if (!_.isObject(opts)) {
        return;
    }

    opts = defaults(opts);

    validateOpts(opts);

    gemini.on('startRunner', (runner) => {
        runner.on('updateResult', (data) => data.updated && Optimizer.create(opts, data).exec());
    });
};
