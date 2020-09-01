/**
 * Demo Queue
 * 
 * This queue will be available globally as ExampleQueue
 * 
 * For more information check out:
 * Not yet implemented
 */

module.exports = {

  queueName: 'queue',

  // if redis already defined as an object, url will be ignored
  url: 'redis://127.0.0.1:6379',



  /**
   * Override config options for this queue
   * For mor information on configuring options, check out:
   * https://github.com/OptimalBits/bull/blob/master/REFERENCE.md#queue
   */
  // opts: {
  //   limiter?: RateLimiter;
  //   redis?: RedisOpts;
  //   prefix?: string = 'bull'; // prefix for all queue keys.
  //   defaultJobOptions?: JobOpts;
  //   settings?: AdvancedSettings;
  // },



  /**
   * Defines a processing function for the jobs of queue.
   * For more information check out:
   * https://github.com/OptimalBits/bull/blob/master/REFERENCE.md#queueprocess
   */
  process: (job, done) => {
    console.log('queue', job)
    done();
  }

}