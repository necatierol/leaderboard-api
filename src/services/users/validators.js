import Joi from 'joi';


export default {
  online: {
    userId: Joi.number().required(),
    username: Joi.string(),
    money: Joi.number().default(0),
    age: Joi.number()
  }
};
