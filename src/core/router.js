import express from 'express';
import Joi from 'joi';

import Services from '../services';

import joiOptions from '../config/joi';
import endpointify from '../libs/service/endpointify';


const app = express();

const getValidationMiddleware = (validation) => ((req, res, next) => {
  if (validation) {
    const joiScheme = Joi.object().keys({ ...validation });
    const { error, value } = Joi.validate(req.body, joiScheme, joiOptions);

    if (error) {
      res.status(400).send({
        error: {
          name: error.name,
          details: error.details.map(d => d.message)
        }
      });
      return;
    }

    req.body = value;
  }

  next();
});

Services.forEach((Service) => {
  const routes = [];
  Object.entries(Service.settings).forEach(([key, value]) => {
    routes.push({
      ...value,
      handler: Service.handlers[key]
    });
  });

  routes.forEach(({
    path, method, handler, validation
  }) => {
    app[method](path, getValidationMiddleware(validation), endpointify(handler));
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
