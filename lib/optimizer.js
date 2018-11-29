'use strict';

const childProcess = require('child_process');

const _ = require('lodash');
const log = require('debug')('gemini:optipng');
const optipng = require('optipng-bin');
const fs = require('fs-extra');
const Promise = require('bluebird');
const execFile = Promise.promisify(childProcess.execFile);

module.exports = class Optimizer {
    static create(opts, data) {
        return new Optimizer(opts.level, _.get(data, 'refImg.path'));
    }

    constructor(level, imagePath) {
        this._level = level;
        this._imagePath = imagePath;
    }

    exec() {
        return this._getImageSize()
            .then((sizeBefore) => {
                return this._compressImage()
                    .then(() => this._getImageSize())
                    .then((sizeAfter) => this._logCompressionRate(sizeBefore, sizeAfter));
            });
    }

    _getImageSize() {
        return fs.stat(this._imagePath).then((stat) => stat.size);
    }

    _compressImage() {
        return execFile(optipng, ['-o', this._level, this._imagePath]);
    }

    _logCompressionRate(sizeBefore, sizeAfter) {
        log(`${this._imagePath} compressed by ${Optimizer._calcCompressionRate(sizeBefore, sizeAfter)}%`);
    }

    static _calcCompressionRate(sizeBefore, sizeAfter) {
        return 100 - Math.round(sizeAfter * 100 / sizeBefore);
    }
};
