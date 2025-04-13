    const Joi = require("joi");
    module.exports.listingSchema = Joi.object({
        listing: Joi.object({
            title: Joi.string().required(),
            country: Joi.string().required(),
            discription: Joi.string().required(),  // Keep spelling consistent
            price: Joi.number().required().min(0),
            image: Joi.string().allow("", null),
            location: Joi.string().required(),
        }).required()
    });



    module.exports.reviewSchema = Joi.object({
        review: Joi.object({
            rating: Joi.number().min(1).max(5).required(),
            comment: Joi.string().required()
        }).required()
    });
  