'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.schedule = undefined;

var _elasticsearch = require('elasticsearch');

var _elasticsearch2 = _interopRequireDefault(_elasticsearch);

var _nodeCron = require('node-cron');

var _nodeCron2 = _interopRequireDefault(_nodeCron);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Watcher = function Watcher(params) {
    var _this = this;

    _classCallCheck(this, Watcher);

    this.start = function (_ref) {
        var schedule = _ref.schedule,
            query = _ref.query,
            predicate = _ref.predicate,
            action = _ref.action,
            errorHandler = _ref.errorHandler;

        if (!_this.scheduler) {
            var task = function task() {
                _this.client.search(query).then(function (data) {
                    if (predicate(data)) {
                        var hits = data.hits.hits;
                        action({ hits: hits, response: data });
                    }
                }, function (error) {
                    if (errorHandler) {
                        errorHandler(error);
                    } else {
                        console.trace(error.message);
                    }
                });
            };

            _this.scheduler = _nodeCron2.default.schedule(schedule, task, true);
        }

        return _this;
    };

    this.stop = function () {
        if (_this.scheduler !== 'undefined') {
            _this.scheduler.stop();
            _this.scheduler = null;
        }
    };

    this.client = new _elasticsearch2.default.Client(params);
};

/**
 * This function starts Elasticsearch watcher.
 *
 * Schedule is telling watcher when it needs to call Elasticsearch Values are provided in cron notation.
 * Query is Elasticsearch's query object. Use it like in Elasticsearch Watcher.
 * Predicate is same as Elasticsearch Condition. It checks if action should be executed.
 * Action is task which will be executed when predicate returns true. Action is executed within Schedule.
 * Error handler (optional) can be used to handle errors from Elasticsearch.
 *
 * @param connection - This parameter defines Elasticsearch connection.
 * @param config - Watcher config containing information about schedule, query, predicate, action and  error handler.
 * @returns {Watcher}
 */


var schedule = exports.schedule = function schedule(connection, config) {
    var watcher = new Watcher(connection);
    watcher.start(config);
    return watcher;
};