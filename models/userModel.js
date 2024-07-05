const mongoose = require('mongoose');
const Joi = require('joi');

// Schéma Mongoose pour les utilisateurs
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Fonction de validation de création d'utilisateur
function validateUserCreate(user) {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6)
    });
    return schema.validate(user);
}
function validateUserLogin(user) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6)
    });
    return schema.validate(user);
}

// Fonction de validation de mise à jour d'utilisateur (si nécessaire)
function validateUserUpdate(user) {
    const schema = Joi.object({
        name: Joi.string(),
        email: Joi.string().email(),
        password: Joi.string().min(6)
    });
    return schema.validate(user);
}

module.exports = {
    User: mongoose.model('User', userSchema),
    validateCreate: validateUserCreate,
    validateUpdate: validateUserUpdate,
    validateLogin:validateUserLogin
};
