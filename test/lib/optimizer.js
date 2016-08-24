'use strict';

const childProcess = require('child_process');

const optipng = require('optipng-bin');
const proxyquire = require('proxyquire');
const fs = require('q-io/fs');
const q = require('q');

describe('optimizer', () => {
    const sandbox = sinon.sandbox.create();

    let Optimizer;
    let log;

    beforeEach(() => {
        sandbox.stub(fs, 'stat').returns(q({size: 100500}));
        sandbox.stub(childProcess, 'execFile').yields(null);

        log = sandbox.stub();

        Optimizer = proxyquire('../../lib/optimizer', {
            debug: () => log
        });
    });

    afterEach(() => sandbox.restore());

    it('should execute optipng optimizer with correct params', () => {
        const opts = {level: 100500};
        const imagePath = 'path/to/ref/image.png';

        return Optimizer.create(opts, {imagePath}).exec()
            .then(() => assert.calledWith(childProcess.execFile, optipng, ['-o', opts.level, imagePath]));
    });

    it('should log rate on which the ref image has been compressed (in percents)', () => {
        const data = {imagePath: 'path/to/ref/image.png'};
        const sizeBeforeOptim = 2000;
        const sizeAfterOptim = 1000;
        const compressionRate = 50;

        fs.stat
            .onFirstCall().returns(q({size: sizeBeforeOptim}))
            .onSecondCall().returns(q({size: sizeAfterOptim}));

        return Optimizer.create({}, data).exec()
            .then(() => assert.calledWith(log, `${data.imagePath} compressed by ${compressionRate}%`));
    });

    it('should log rounded compression rate (in percents)', () => {
        const sizeBeforeOptim = 300;
        const sizeAfterOptim = 100;
        const compressionRate = 67;

        fs.stat
            .onFirstCall().returns(q({size: sizeBeforeOptim}))
            .onSecondCall().returns(q({size: sizeAfterOptim}));

        return Optimizer.create({}, {}).exec()
            .then(() => assert.calledWithMatch(log, `compressed by ${compressionRate}%`));
    });
});
