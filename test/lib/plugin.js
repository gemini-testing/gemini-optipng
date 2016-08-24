'use strict';

const EventEmitter = require('events').EventEmitter;

const defaults = require('../../lib/defaults')();
const Optimizer = require('../../lib/optimizer');
const plugin = require('../../lib/plugin');

describe('gemini-optipng', () => {
    const sandbox = sinon.sandbox.create();

    let gemini;
    let runner;

    beforeEach(() => {
        sandbox.stub(Optimizer.prototype, 'exec');
        sandbox.spy(Optimizer, 'create');

        gemini = new EventEmitter();
        runner = new EventEmitter();
    });

    afterEach(() => sandbox.restore());

    describe('validateOpts', () => {
        it('should do nothing if opts is not an object', () => {
            const opts = 'I`m not an object!';
            sandbox.spy(gemini, 'on');

            plugin(gemini, opts);

            assert.notCalled(gemini.on);
        });

        it('should throw error if opts.level less than 0', () => {
            const opts = {level: -1};

            assert.throws(() => plugin(gemini, opts), 'Level option must be a positive integer number from 0 to 7');
        });

        it('should throw error if opts.level is not a number', () => {
            const opts = {level: '2'};

            assert.throws(() => plugin(gemini, opts), 'Level option must be a positive integer number from 0 to 7');
        });

        it('should throw error if opts.level is a float number', () => {
            const opts = {level: 2.5};

            assert.throws(() => plugin(gemini, opts), 'Level option must be a positive integer number from 0 to 7');
        });
    });

    it('should set default optimization level if opts.level is not set', () => {
        plugin(gemini, {});
        gemini.emit('startRunner', runner);
        runner.emit('updateResult', {updated: true});

        assert.calledWith(Optimizer.create, {level: defaults.level});
    });

    it('should set optimization level from opts.level', () => {
        const opts = {level: 3};

        plugin(gemini, opts);
        gemini.emit('startRunner', runner);
        runner.emit('updateResult', {updated: true});

        assert.calledWith(Optimizer.create, opts);
    });

    it('should not optimize image when field "updated" is false', () => {
        const data = {updated: false};

        plugin(gemini, {});
        gemini.emit('startRunner', runner);
        runner.emit('updateResult', data);

        assert.notCalled(Optimizer.create);
        assert.notCalled(Optimizer.prototype.exec);
    });

    it('should optimize image when field "updated" is true', () => {
        const data = {updated: true};
        const opts = {};

        plugin(gemini, opts);
        gemini.emit('startRunner', runner);
        runner.emit('updateResult', data);

        assert.calledWithExactly(Optimizer.create, opts, data);
    });
});
