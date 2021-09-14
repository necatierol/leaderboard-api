import EventEmitter from 'events';

import amqp from 'amqplib';


class AMQP extends EventEmitter {
  RABBITMQ_HOST = process.env.RABBITMQ_HOST || 'amqp://localhost';

  QUEUE = 'LEADERBOARD_API';

  channel = null;

  async build() {
    this.channel = await this.createChannel();
    await this.receive();
  }

  async createChannel() {
    const connection = await amqp.connect(this.RABBITMQ_HOST);
    const channel = await connection.createChannel();

    return channel;
  }

  async send(event, key, ...args) {
    this.channel.assertQueue(this.QUEUE, { durable: true });
    this.channel.sendToQueue(
      this.QUEUE,
      Buffer.from(JSON.stringify({ event, key, args })),
      { persistent: true }
    );
  }

  async receive() {
    this.channel.prefetch(1);
    this.channel.assertQueue(this.QUEUE, { durable: true });

    // eslint-disable-next-line
    console.log(` [*] Waiting for messages in ${this.QUEUE}. To exit press CTRL+C`);

    this.channel.consume(
      this.QUEUE,
      (buffer) => {
        const params = JSON.parse(buffer.content.toString());

        // eslint-disable-next-line
        console.log(` [*] Processing ${params.event}`);

        this
          .emit(
            params.event,
            params.key,
            ...params.args,
            () => {
              // eslint-disable-next-line
              console.log(` [x] finished ${params.event}`);
              this.channel.ack(buffer);
            },
            (err) => {
              // eslint-disable-next-line
              console.log('err', err);
              this.channel.ack(buffer);
            }
          );
      },
      { noAck: false }
    );
  }
}


export default new AMQP();
