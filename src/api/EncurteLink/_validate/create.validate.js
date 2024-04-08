import Joi from 'joi';

export default Joi
  .object(
    {
      url: Joi.string().regex(/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\\]))?/, '/g').message(`your url need to match with this regex ${/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\\]))?/}`).required(),
    },
  );
