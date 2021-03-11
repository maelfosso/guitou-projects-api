import * as amqp from 'amqplib/callback_api';

// const amqp = require('amqplib/callback_api');
// const debug = require('debug')("Rabbitmq:save");
// const config = require('../../../config/config');

const RABBITMQ_URI = process.env.RABBITMQ_URI;
if (!RABBITMQ_URI) {
  throw new Error(`RABBITMQ URI must be defined`);
}

let ch: amqp.Channel;
amqp.connect(RABBITMQ_URI, function (err, conn) {
   conn.createChannel(function (err, channel) {
      ch = channel;
   });
});

exports.publishToQueue = async (queueName: string, data: any) => {
  ch.sendToQueue(queueName, data, {
    persistent: true
  });
}


process.on('exit', async (code) => {
  await ch.close();
  console.log(`Closing rabbitmq channel`);
});

