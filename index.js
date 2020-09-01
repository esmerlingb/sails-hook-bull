var path = require('path');
var fs = require('fs');
var _ = require('lodash')

var Queue = require('bull');

module.exports = (sails) => {
  return {
    initialize: async function() {
      let queueDir = path.join(sails.config.appPath, 'api/queues')
      if(!fs.existsSync(queueDir)) {
        return;  
      }
      
      let queueFiles = fs.readdirSync(queueDir).filter(fn => /\.js$/.test(fn))

      for(let file of queueFiles) {
        let filePath = path.join(queueDir, file)
        
        let queue = buildQueue.bind(this)(sails, filePath)

        let queueFile = path.basename(filePath, '.js')

        //Make queue accesible
        this[queueFile] = queue
      }
    }
  }
};


const buildQueue = function(sails, filePath) {
  let queueData = getDataFromPath.bind(this)(sails, filePath)
  
  let queue = createQueue(queueData)
  
  //Create process if available
  if('process' in queueData) {
    createProcess(queue, queueData)
  }

  return queue
}

const getDataFromPath = function(sails, filePath) {
  let queueData = require(filePath)
  
  let isObject = queueData !== null && typeof queueData === 'object'
  if(!isObject) {
    throw new Error(`${filePath} should export an object`)
  }
  
  //Merge queue options with config/bull.js
  Object.assign(queueData, {opts: _.assign(sails.config[this.configKey], queueData.opts)})

  return queueData;
}


/**
 * Create queue from file definition
 */
const createQueue = function(queueData) {
  //Pick args in order
  let args = _.pick(queueData, ['queueName', 'url', 'opts'])
      args = Object.values(args)

  return Queue(...args)
}


/**
 * Create process for a queue
 */
const createProcess = (queue, queueData) => {
  if(typeof queueData.process==="function") {
    queue.process(queueData.process)
  }else {
    let args = _.pick(queueData.process, ['name', 'concurrency', 'processor'])
        args = Object.values(args)

    queue.process(...args)
  }
}