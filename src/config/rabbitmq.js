export default {
  development: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672'
  },
  production: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672'
  }
};
