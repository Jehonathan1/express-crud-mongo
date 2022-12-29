import Joi from 'joi';

// Validation schema for users
const userSchema = Joi.object({
  first_name: Joi.string().min(3).max(50).required(),
  last_name: Joi.string().min(3).max(50).required(),
  email: Joi.string().min(2).max(255).required().email(),
  phone: Joi.string().min(8).max(15).required().regex(/^[+0-9-]+$/)
});

export default userSchema;