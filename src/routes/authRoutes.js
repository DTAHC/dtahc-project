/**
 * Routes pour l'authentification
 * @module routes/authRoutes
 */

const express = require('express');
const router = express.Router();
const { generateToken } = require('../config/jwt');
// Utilisation de la validation Joi via notre middleware personnalisé
const { validate, schemas } = require('../middleware/validationMiddleware');
const { authenticate } = require('../middleware/authMiddleware');
const User = require('../models/User');
const logger = require('../services/logger');

/**
 * @swagger
 * tags:
 *   name: Authentification
 *   description: Gestion de l'authentification des utilisateurs
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - name
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nom d'utilisateur unique
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse email unique
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mot de passe (min 6 caractères)
 *               name:
 *                 type: string
 *                 description: Nom complet
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Utilisateur créé avec succès"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                 token:
 *                   type: string
 *                   description: JWT pour l'authentification
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: Conflit - Nom d'utilisateur ou email déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Cet email est déjà utilisé"
 */
router.post('/register', validate(schemas.userRegister), async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }],
    });

    if (userExists) {
      return res.status(409).json({
        success: false,
        message: userExists.email === email 
          ? 'Cet email est déjà utilisé'
          : 'Ce nom d\'utilisateur est déjà utilisé',
      });
    }

    // Créer un nouvel utilisateur
    const user = new User({
      username,
      email,
      password, // Le hachage est géré par le middleware pre-save
      name,
      role: 'user', // Par défaut, tous les nouveaux utilisateurs sont des "user"
    });

    // Sauvegarder l'utilisateur
    await user.save();

    // Générer un token JWT
    const token = generateToken(user);

    // Envoyer la réponse
    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    logger.error(`Erreur lors de l'inscription: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'utilisateur',
    });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse email
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mot de passe
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Connexion réussie"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *                 token:
 *                   type: string
 *                   description: JWT pour l'authentification
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Identifiants invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Email ou mot de passe incorrect"
 */
router.post('/login', validate(schemas.userLogin), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Rechercher l'utilisateur par email
    const user = await User.findOne({ email });

    // Vérifier si l'utilisateur existe
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect',
      });
    }

    // Vérifier si le compte est actif
    if (!user.active) {
      return res.status(401).json({
        success: false,
        message: 'Ce compte a été désactivé. Veuillez contacter l\'administrateur.',
      });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect',
      });
    }

    // Mettre à jour la date de dernière connexion
    user.lastLogin = new Date();
    await user.save();

    // Générer un token JWT
    const token = generateToken(user);

    // Envoyer la réponse
    res.json({
      success: true,
      message: 'Connexion réussie',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    logger.error(`Erreur lors de la connexion: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
    });
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Récupérer les informations de l'utilisateur connecté
 *     tags: [Authentification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations utilisateur récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    // Récupérer l'utilisateur complet depuis la base de données
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        active: user.active,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    logger.error(`Erreur lors de la récupération des infos utilisateur: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des informations utilisateur',
    });
  }
});

module.exports = router;