# sails-hook-bull

Sails.js hook to use [bull] package for handling distributed jobs and messages.

## Installation

Install it via npm:
```shell
npm install sails-hook-bull --save
```
or
```shell
yarn add sails-hook-bull
```
**Requirement:** Redis version greater than or equal to 2.8.18 is required.

## Configuration
You can set some parameters in `config/bull.js` to overrides defaults options for all queues.
```javascript
module.exports.bull = {
    redis: {
        port: 6379,
        host: '127.0.0.1',
        db: 0,
        password: ''
    }
}
```
See [bull.queue] for more information.

## Examples

Bull queue definition in `api/queues/firstQueue.js`
```javascript
module.exports = {
  queueName: 'first-queue',
  // if redis already defined as an object, url will be ignored
  url: 'redis://127.0.0.1:6379',
  opts: {
    limiter: {
        max: 1000,
        duration: 5000
    }
  },
  process: async job => {
    return doSomething(job.data);
  }
};
```
You can define queues with options:
```javascript
module.exports = {
  queueName: 'my-queue',
  process: {
    name: 'my-process',
    concurrency: 1,
    processor: (job, done) => {
      // do something...
      done();
    }
  }
};
```

Adding jobs to a queue:
```javascript
// api/controllers/someController.js
module.exports = {
  someAction: function(req, res) {
    sails.hooks.bull.firstQueue.add({
        foo: 'bar'
    })
  }
};
```

License
----

MIT


[bull]: <https://optimalbits.github.io/bull/>
[bull.queue]: <https://github.com/OptimalBits/bull/blob/master/REFERENCE.md#queue>
