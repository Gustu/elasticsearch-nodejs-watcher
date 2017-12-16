const sinon = require('sinon');
const watcher = require('../dist');
const assert = require('assert');

describe('Watcher', function () {
    it('should start and stop', function () {
        let scheduledWatcher = watcher.schedule({}, {schedule: '*/15 * * * * *'});
        scheduledWatcher.stop();
    });

    it('should call error handler', function (done) {
        let errorSpy = sinon.spy();
        let predicateSpy = sinon.spy((data) => {
            console.log(data);
            return false
        });
        let scheduledWatcher = watcher.schedule({host: 'http://example.com'}, {
            schedule: '* * * * * *',
            predicate: predicateSpy,
            errorHandler: errorSpy
        });
        this.timeout(4000);
        setTimeout(() => {
            scheduledWatcher.stop();
            assert.equal(predicateSpy.called, false);
            assert.equal(errorSpy.called, true);
            done();
        }, 2000);
    });
});