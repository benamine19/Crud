const mongoose = require('mongoose');
const Joi = require('joi');

// Schéma Mongoose pour les tâches
const tacheSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    creationDate: {
        type: Date,
        default: Date.now
      },
    deadline: {
        type: String,
        required: true
    },
    iscompleted: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

// Fonction de validation de création de tâche
function schematachecreate(obj) {
    const schemaTache = Joi.object({
        title: Joi.string().required().min(3).max(200).trim(),
        description: Joi.string().required().trim(),
        deadline: Joi.string().required(),
        iscompleted: Joi.boolean(),
        user: Joi.string().required()
    });
    return schemaTache.validate(obj);
}


// Fonction de validation de mise à jour de tâche
function schematacheupdate(obj) {
    const schemaTache = Joi.object({
        title: Joi.string().max(200).trim(),
        description: Joi.string().trim(),
        deadline: Joi.string(),
        iscompleted: Joi.boolean(),
        user: Joi.string()
    });
    return schemaTache.validate(obj);
}

module.exports = {
    Tache: mongoose.model('Tache', tacheSchema),
    validateCreate: schematachecreate,
    validateUpdate: schematacheupdate
};
