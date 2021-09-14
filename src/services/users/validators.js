import Joi from 'joi';


export default {
  online: {
    userId: Joi.number().required(),
    username: Joi.string(),
    score: Joi.number().default(0),
    age: Joi.number()
  }
};
