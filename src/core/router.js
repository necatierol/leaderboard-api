import express from 'express';
// import Joi from 'joi';

import Services from '../services';

import endpointify from '../libs/service/endpointify';


const app = express();
Services.forEach((Service) => {
  const routes = [];
  Object.entries(Service.settings).forEach(([key, value]) => {
    routes.push({
      ...value,
      handler: Service.handlers[key]
    });
  });

  routes.forEach(({
    path, method, handler
  }) => {
    app[method](path, endpointify(handler));
  });
});

app.get('/health-check', (req, res) => {
  res.send('');
});

app.all('*', (req, res) => {
  res
    .status(404)
    .send({ message: 'Page not found!' });
});


export default app;
