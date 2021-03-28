'use strict';

const subscriptionSchema = (joi) => ({
    first_name: joi.string().regex(/^[a-zA-Z '-]+$/i),
    email: joi.string().email().required(),
    gender: joi.string().min(2).max(50),
    date_of_birth: joi.date().required(),
    is_active: joi.boolean().required(),
    newsletter_id: joi.string().alphanum().required(),
});
  
module.exports = subscriptionSchema;
