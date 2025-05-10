// Script d'initialisation MongoDB
db = db.getSiblingDB('dtahc');

// Cr�ation de l'utilisateur application avec des permissions limit�es
db.createUser({
  user: 'appuser',
  pwd: 'apppassword',
  roles: [
    {
      role: 'readWrite',
      db: 'dtahc'
    }
  ]
});

// Cr�ation des collections initiales
db.createCollection('users');
db.createCollection('clients');
db.createCollection('dossiers');
db.createCollection('documents');
db.createCollection('invoices');

// Ajout d'un utilisateur admin par d�faut
db.users.insertOne({
  username: 'admin',
  email: 'admin@dtahc.fr',
  password: '$2b$10$XOPbrlUPQdwdJUpSrIF.X.UbCgDcGa0puQwlqaDUJuGMZqGcnO5.2', // 'admin123' hash� avec bcrypt
  role: 'admin',
  name: 'Admin',
  createdAt: new Date(),
  updatedAt: new Date()
});