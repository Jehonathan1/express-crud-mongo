import userSchema from './schemas.mjs';

// Middleware function for incoming payload validation
export default function validateUser(req, res, next) {
  // Validate the payload against the schema
  const { error } = userSchema.validate(req.body);
  if (error) {
    // If the payload is invalid, return a 400 Bad Request response
    res.status(400).send(error.details[0].message);
    return;
  }

  // If the payload is valid, call the next middleware function
  next();
}