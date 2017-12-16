# Elasticsearch NodeJS Watcher

This is alternative to Elasticsearch X-Pack Watcher. 

Example usage - asking Elasticsearch each 30s if any new document that matches query appeared. 
It's import that schedule is each 30s and timestamp is now-30s. This blocks appearing already matched documents in new call.

```javascript
const elasticWatcher = require("elastic-watcher");

const connection = {
    host: 'http://localhost:9200',
    log: 'trace'
};

const watcher = {
    schedule: "*/30 * * * * *",
    query: {
        index: 'logstash-*',
        body: {
            query: {
                bool: {
                    must: {match: {loglevel: "ERROR"}},
                    filter: {
                        range: {"@timestamp": {gte: "now-30s"}}
                    }
                }
            }
        }
    },
    predicate: ({hits: {total}}) => total > 0,
    action: () => console.log('Action!!!'),
    errorHandler: err => console.log('Oh no!!!')
};

elasticWatcher.schedule(connection, watcher);
```

### Watcher configuration

 * Schedule is telling watcher when it needs to call Elasticsearch Values are provided in cron notation.
 * Query is Elasticsearch's query object. Use it like in Elasticsearch Watcher.
 * Predicate is same as Elasticsearch Condition. It checks if action should be executed.
 * Action is task which will be executed when predicate returns true. Action is executed within Schedule.
 * Error handler (optional) can be used to handle errors from Elasticsearch.

### Elasticsearch connection configuration

Check out [Elasticsearch.js](https://github.com/elastic/elasticsearch-js) documentation

## License

MIT.