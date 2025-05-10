/**
 * Middleware de validation avec Joi
 */

const Joi = require('joi');
const logger = require('../services/logger');

/**
 * Crée un middleware de validation pour une requête HTTP
 * @param {Object} schema - Schéma Joi pour la validation
 * @param {String} property - Propriété de la requête à valider (body, params, query)
 * @returns {Function} Middleware Express
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const data = req[property];
    const { error, value } = schema.validate(data, { 
      abortEarly: false,
      stripUnknown: true,
    });
    
    if (error) {
      const errorMessages = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      
      logger.debug(`Validation échec: ${JSON.stringify(errorMessages)}`);
      
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errorMessages,
      });
    }
    
    // Remplacer les données validées/sanitisées
    req[property] = value;
    next();
  };
};

/**
 * Schémas de validation communs
 */
const schemas = {
  // Validation du formulaire d'inscription
  userRegister: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required()
      .messages({
        'string.base': 'Le nom d\'utilisateur doit être une chaîne de caractères',
        'string.alphanum': 'Le nom d\'utilisateur ne doit contenir que des caractères alphanumériques',
        'string.min': 'Le nom d\'utilisateur doit comporter au moins {#limit} caractères',
        'string.max': 'Le nom d\'utilisateur ne doit pas dépasser {#limit} caractères',
        'any.required': 'Le nom d\'utilisateur est requis',
      }),
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Veuillez entrer une adresse email valide',
        'any.required': 'L\'email est requis',
      }),
    password: Joi.string().min(6).required()
      .messages({
        'string.min': 'Le mot de passe doit comporter au moins {#limit} caractères',
        'any.required': 'Le mot de passe est requis',
      }),
    name: Joi.string().required()
      .messages({
        'any.required': 'Le nom est requis',
      }),
  }),
  
  // Validation de la connexion
  userLogin: Joi.object({
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Veuillez entrer une adresse email valide',
        'any.required': 'L\'email est requis',
      }),
    password: Joi.string().required()
      .messages({
        'any.required': 'Le mot de passe est requis',
      }),
  }),

  // Validation de l'identifiant MongoDB
  idParam: Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
      .messages({
        'string.pattern.base': 'L\'identifiant fourni n\'est pas valide',
        'any.required': 'L\'identifiant est requis',
      }),
  }),
};

module.exports = {
  validate,
  schemas,
};