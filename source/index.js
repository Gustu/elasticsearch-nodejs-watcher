import elasticsearch from 'elasticsearch';
import cron from 'node-cron';

class Watcher {
    constructor(params) {
        this.client = new elasticsearch.Client(params);
    }

    start = ({schedule, query, predicate, action, errorHandler}) => {
        if (!this.scheduler) {
            const task = () => {
                this.client.search(query)
                    .then(data => {
                        if (predicate(data)) {
                            let hits = data.hits.hits;
                            action({hits, response: data});
                        }
                    }, error => {
                        if (errorHandler) {
                            errorHandler(error);
                        } else {
                            console.trace(error.message);
                        }
                    });
            };

            this.scheduler = cron.schedule(schedule, task, true);
        }

        return this;
    };

    stop = () => {
        if (this.scheduler !== 'undefined') {
            this.scheduler.stop();
            this.scheduler = null;
        }
    };

}

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
export const schedule = (connection, config) => {
    let watcher = new Watcher(connection);
    watcher.start(config);
    return watcher;
};