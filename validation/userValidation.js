const Joi = require('joi');
const user = require('./message.js');

const userValidation = {
  signUpValidation: async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object().keys({
      email: Joi.string()
        .max(20)
        .regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w)*(\.\w{2,3})+$/)
        .required()
        .messages(user.email),
      name: Joi.string()
        .max(20)
        .regex(/^[가-힣a-zA-Z]+$/)
        .required()
        .messages(user.name),
      password: Joi.string().min(4).max(20).required().messages(user.password),
      confirmPassword: Joi.valid(Joi.ref('password')).messages(user.confirmPassword),
      address: Joi.string().required().messages(user.address),
      isSeller: Joi.boolean().required().messages(user.isSeller),
      businessRegistrationNumber: Joi.string().max(12).messages(user.businessRegistrationNumber),
    });

    try {
      await schema.validateAsync(body);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  },
  loginValidation: async (req, _, next) => {
    const body = req.body;
    const schema = Joi.object().keys({
      email: Joi.string()
        .max(20)
        .regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w)*(\.\w{2,3})+$/)
        .required()
        .messages(user.email),
      password: Joi.string().min(4).max(20).required().messages(user.password),
    });
    try {
      await schema.validateAsync(body);
    } catch (err) {
      throw err;
    }
    next();
  },
};

module.exports = userValidation;
