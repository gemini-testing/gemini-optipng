'use strict';

const childProcess = require('child_process');

const log = require('debug')('gemini:optipng');
const optipng = require('optipng-bin');
const fs = require('q-io/fs');
const q = require('q');

module.exports = class Optimizer {
    static create(opts, data) {
        return new Optimizer(opts.level, data.imagePath);
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
        return fs.stat(this._imagePath).get('size');
    }

    _compressImage() {
        return q.nfcall(childProcess.execFile, optipng, ['-o', this._level, this._imagePath]);
    }

    _logCompressionRate(sizeBefore, sizeAfter) {
        log(`${this._imagePath} compressed by ${Optimizer._calcCompressionRate(sizeBefore, sizeAfter)}%`);
    }

    static _calcCompressionRate(sizeBefore, sizeAfter) {
        return 100 - Math.round(sizeAfter * 100 / sizeBefore);
    }
};
