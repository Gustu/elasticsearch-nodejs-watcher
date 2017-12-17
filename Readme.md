# Elasticsearch NodeJS Watcher

This is alternative to [Elasticsearch X-Pack Watcher****](https://www.elastic.co/guide/en/x-pack/current/watcher-getting-started.html).

Example usage - asking Elasticsearch each 30s if any new document that matches query appeared. 

It's important that schedule and timestamp filter refer to same interval, e.g. schedule each 30s and filter timestamp now-30s. This blocks appearing already matched documents in new call.

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
    action: data => console.log('Action!!!'),
    errorHandler: err => console.log('Oh no!!!')
};

elasticWatcher.schedule(connection, watcher);
```

### Watcher configuration

 * Schedule is telling watcher when it needs to call Elasticsearch Values are provided in cron notation.
 * Query is Elasticsearch's query object. Use it like in Elasticsearch Watcher. [Query DSL documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)
 * Predicate is same as Elasticsearch Condition. It checks if action should be executed.
 * Action is task which will be executed when predicate returns true. Action is executed within Schedule. Data contains extracted hits and whole response.
 * Error handler (optional) can be used to handle errors from Elasticsearch.

### Elasticsearch connection configuration

Check out [Elasticsearch.js](https://github.com/elastic/elasticsearch-js) documentation

## License

MIT.