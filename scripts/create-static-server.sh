#!/bin/bash
# Script pour créer un serveur web statique avec les pages de base

# Créer un dossier pour le serveur statique
mkdir -p /Users/d972/dtahc-project/static-pages/clients
mkdir -p /Users/d972/dtahc-project/static-pages/admin
mkdir -p /Users/d972/dtahc-project/static-pages/communication
mkdir -p /Users/d972/dtahc-project/static-pages/dashboard
mkdir -p /Users/d972/dtahc-project/static-pages/comptable

# Créer des pages HTML simples
cat > /Users/d972/dtahc-project/static-pages/index.html << 'EOL'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DTAHC - Accueil</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <div class="container mx-auto p-6">
        <h1 class="text-3xl font-bold text-center mb-8">DTAHC - Gestion des autorisations de travaux</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a href="/dashboard" class="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
                <h2 class="text-xl font-semibold text-blue-600">Tableau de bord</h2>
                <p class="mt-2 text-gray-600">Accéder au tableau de bord principal</p>
            </a>
            
            <a href="/clients" class="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
                <h2 class="text-xl font-semibold text-blue-600">Gestion des clients</h2>
                <p class="mt-2 text-gray-600">Gérer les clients et leurs informations</p>
            </a>
            
            <a href="/admin" class="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
                <h2 class="text-xl font-semibold text-blue-600">Administration</h2>
                <p class="mt-2 text-gray-600">Configurer les paramètres du système</p>
            </a>
            
            <a href="/comptable" class="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
                <h2 class="text-xl font-semibold text-blue-600">Gestion comptable</h2>
                <p class="mt-2 text-gray-600">Gérer les factures et paiements</p>
            </a>
            
            <a href="/communication" class="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
                <h2 class="text-xl font-semibold text-blue-600">Modèles de communication</h2>
                <p class="mt-2 text-gray-600">Gérer les modèles de communication</p>
            </a>
        </div>
    </div>
</body>
</html>
EOL

cat > /Users/d972/dtahc-project/static-pages/clients/index.html << 'EOL'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DTAHC - Gestion des Clients</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <header class="bg-white shadow">
        <div class="container mx-auto px-6 py-4 flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-800">DTAHC</h1>
            <nav>
                <ul class="flex space-x-6">
                    <li><a href="/" class="text-gray-600 hover:text-blue-600">Accueil</a></li>
                    <li><a href="/dashboard" class="text-gray-600 hover:text-blue-600">Tableau de bord</a></li>
                    <li><a href="/clients" class="text-blue-600 font-medium">Clients</a></li>
                    <li><a href="/comptable" class="text-gray-600 hover:text-blue-600">Comptabilité</a></li>
                    <li><a href="/admin" class="text-gray-600 hover:text-blue-600">Administration</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="container mx-auto p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Gestion des Clients</h2>
        
        <div class="bg-white rounded-lg shadow p-6">
            <p class="text-gray-600 mb-6">Cette section vous permet de gérer les clients de l'application.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition cursor-pointer">
                    <h3 class="font-semibold text-blue-600">Nouveaux clients</h3>
                    <p class="text-sm text-gray-600 mt-1">Ajouter un nouveau client dans le système</p>
                </div>
                
                <div class="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition cursor-pointer">
                    <h3 class="font-semibold text-blue-600">Recherche clients</h3>
                    <p class="text-sm text-gray-600 mt-1">Rechercher et filtrer la liste des clients</p>
                </div>
                
                <div class="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition cursor-pointer">
                    <h3 class="font-semibold text-blue-600">Rapports clients</h3>
                    <p class="text-sm text-gray-600 mt-1">Générer des rapports sur l'activité client</p>
                </div>
            </div>
        </div>
    </main>
</body>
</html>
EOL

cat > /Users/d972/dtahc-project/static-pages/admin/index.html << 'EOL'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DTAHC - Administration</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <header class="bg-white shadow">
        <div class="container mx-auto px-6 py-4 flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-800">DTAHC</h1>
            <nav>
                <ul class="flex space-x-6">
                    <li><a href="/" class="text-gray-600 hover:text-blue-600">Accueil</a></li>
                    <li><a href="/dashboard" class="text-gray-600 hover:text-blue-600">Tableau de bord</a></li>
                    <li><a href="/clients" class="text-gray-600 hover:text-blue-600">Clients</a></li>
                    <li><a href="/comptable" class="text-gray-600 hover:text-blue-600">Comptabilité</a></li>
                    <li><a href="/admin" class="text-blue-600 font-medium">Administration</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="container mx-auto p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Administration</h2>
        
        <div class="bg-white rounded-lg shadow p-6">
            <p class="text-gray-600 mb-6">Cette section vous permet de gérer les paramètres administratifs de l'application.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition cursor-pointer">
                    <h3 class="font-semibold text-blue-600">Gestion des utilisateurs</h3>
                    <p class="text-sm text-gray-600 mt-1">Ajouter, modifier ou supprimer des utilisateurs</p>
                </div>
                
                <div class="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition cursor-pointer">
                    <h3 class="font-semibold text-blue-600">Rôles et permissions</h3>
                    <p class="text-sm text-gray-600 mt-1">Configurer les accès et les droits des utilisateurs</p>
                </div>
                
                <div class="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition cursor-pointer">
                    <h3 class="font-semibold text-blue-600">Paramètres système</h3>
                    <p class="text-sm text-gray-600 mt-1">Configurer les paramètres globaux de l'application</p>
                </div>
            </div>
        </div>
    </main>
</body>
</html>
EOL

cat > /Users/d972/dtahc-project/static-pages/communication/index.html << 'EOL'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DTAHC - Modèles de Communication</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <header class="bg-white shadow">
        <div class="container mx-auto px-6 py-4 flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-800">DTAHC</h1>
            <nav>
                <ul class="flex space-x-6">
                    <li><a href="/" class="text-gray-600 hover:text-blue-600">Accueil</a></li>
                    <li><a href="/dashboard" class="text-gray-600 hover:text-blue-600">Tableau de bord</a></li>
                    <li><a href="/clients" class="text-gray-600 hover:text-blue-600">Clients</a></li>
                    <li><a href="/comptable" class="text-gray-600 hover:text-blue-600">Comptabilité</a></li>
                    <li><a href="/admin" class="text-gray-600 hover:text-blue-600">Administration</a></li>
                    <li><a href="/communication" class="text-blue-600 font-medium">Communication</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="container mx-auto p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Modèles de Communication</h2>
        
        <div class="bg-white rounded-lg shadow p-6">
            <p class="text-gray-600 mb-6">Cette section vous permet de gérer les modèles de communication utilisés dans l'application.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition cursor-pointer">
                    <h3 class="font-semibold text-blue-600">Modèles d'emails</h3>
                    <p class="text-sm text-gray-600 mt-1">Créer et modifier les modèles d'emails</p>
                </div>
                
                <div class="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition cursor-pointer">
                    <h3 class="font-semibold text-blue-600">Modèles de documents</h3>
                    <p class="text-sm text-gray-600 mt-1">Gérer les modèles de documents officiels</p>
                </div>
                
                <div class="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition cursor-pointer">
                    <h3 class="font-semibold text-blue-600">Historique des envois</h3>
                    <p class="text-sm text-gray-600 mt-1">Consulter l'historique des communications</p>
                </div>
            </div>
        </div>
    </main>
</body>
</html>
EOL

cat > /Users/d972/dtahc-project/static-pages/comptable/index.html << 'EOL'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DTAHC - Gestion Comptable</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <header class="bg-white shadow">
        <div class="container mx-auto px-6 py-4 flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-800">DTAHC</h1>
            <nav>
                <ul class="flex space-x-6">
                    <li><a href="/" class="text-gray-600 hover:text-blue-600">Accueil</a></li>
                    <li><a href="/dashboard" class="text-gray-600 hover:text-blue-600">Tableau de bord</a></li>
                    <li><a href="/clients" class="text-gray-600 hover:text-blue-600">Clients</a></li>
                    <li><a href="/comptable" class="text-blue-600 font-medium">Comptabilité</a></li>
                    <li><a href="/admin" class="text-gray-600 hover:text-blue-600">Administration</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="container mx-auto p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Gestion Comptable</h2>
        
        <div class="bg-white rounded-lg shadow p-6">
            <p class="text-gray-600 mb-6">Cette section vous permet de gérer les aspects comptables de l'application.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition cursor-pointer">
                    <h3 class="font-semibold text-blue-600">Facturation</h3>
                    <p class="text-sm text-gray-600 mt-1">Gérer les factures et les devis</p>
                </div>
                
                <div class="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition cursor-pointer">
                    <h3 class="font-semibold text-blue-600">Paiements</h3>
                    <p class="text-sm text-gray-600 mt-1">Suivre les paiements et les échéances</p>
                </div>
                
                <div class="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition cursor-pointer">
                    <h3 class="font-semibold text-blue-600">Rapports</h3>
                    <p class="text-sm text-gray-600 mt-1">Générer des rapports financiers</p>
                </div>
            </div>
        </div>
    </main>
</body>
</html>
EOL

cat > /Users/d972/dtahc-project/static-pages/dashboard/index.html << 'EOL'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DTAHC - Tableau de Bord</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <header class="bg-white shadow">
        <div class="container mx-auto px-6 py-4 flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-800">DTAHC</h1>
            <nav>
                <ul class="flex space-x-6">
                    <li><a href="/" class="text-gray-600 hover:text-blue-600">Accueil</a></li>
                    <li><a href="/dashboard" class="text-blue-600 font-medium">Tableau de bord</a></li>
                    <li><a href="/clients" class="text-gray-600 hover:text-blue-600">Clients</a></li>
                    <li><a href="/comptable" class="text-gray-600 hover:text-blue-600">Comptabilité</a></li>
                    <li><a href="/admin" class="text-gray-600 hover:text-blue-600">Administration</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="container mx-auto p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Tableau de Bord</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold text-gray-700">Clients</h3>
                <p class="text-3xl font-bold text-blue-600 mt-2">128</p>
                <p class="text-sm text-gray-500 mt-1">Total des clients</p>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold text-gray-700">Dossiers</h3>
                <p class="text-3xl font-bold text-blue-600 mt-2">45</p>
                <p class="text-sm text-gray-500 mt-1">Dossiers en cours</p>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold text-gray-700">Facturation</h3>
                <p class="text-3xl font-bold text-blue-600 mt-2">15.8K €</p>
                <p class="text-sm text-gray-500 mt-1">Ce mois-ci</p>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold text-gray-700">Tâches</h3>
                <p class="text-3xl font-bold text-blue-600 mt-2">12</p>
                <p class="text-sm text-gray-500 mt-1">À réaliser aujourd'hui</p>
            </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">Activité récente</h3>
                <ul class="space-y-3">
                    <li class="border-b border-gray-100 pb-2">
                        <p class="text-sm text-gray-800">Nouveau client ajouté: Martin Sophie</p>
                        <p class="text-xs text-gray-500">Il y a 2 heures</p>
                    </li>
                    <li class="border-b border-gray-100 pb-2">
                        <p class="text-sm text-gray-800">Dossier mis à jour: Permis de construire #PC-2023-045</p>
                        <p class="text-xs text-gray-500">Il y a 3 heures</p>
                    </li>
                    <li class="border-b border-gray-100 pb-2">
                        <p class="text-sm text-gray-800">Facture payée: FAC-2023-078</p>
                        <p class="text-xs text-gray-500">Il y a 5 heures</p>
                    </li>
                    <li class="border-b border-gray-100 pb-2">
                        <p class="text-sm text-gray-800">Nouveau dossier créé: Déclaration préalable #DP-2023-112</p>
                        <p class="text-xs text-gray-500">Il y a 1 jour</p>
                    </li>
                </ul>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">Dossiers urgents</h3>
                <ul class="space-y-3">
                    <li class="border-b border-gray-100 pb-2 flex justify-between">
                        <div>
                            <p class="text-sm text-gray-800">DP-2023-089: Modification façade</p>
                            <p class="text-xs text-gray-500">Client: Dupont Jean</p>
                        </div>
                        <span class="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">Échéance: Aujourd'hui</span>
                    </li>
                    <li class="border-b border-gray-100 pb-2 flex justify-between">
                        <div>
                            <p class="text-sm text-gray-800">PC-2023-042: Construction neuve</p>
                            <p class="text-xs text-gray-500">Client: Martin Sophie</p>
                        </div>
                        <span class="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">Échéance: Demain</span>
                    </li>
                    <li class="border-b border-gray-100 pb-2 flex justify-between">
                        <div>
                            <p class="text-sm text-gray-800">DP-2023-095: Panneaux solaires</p>
                            <p class="text-xs text-gray-500">Client: Petit Marie</p>
                        </div>
                        <span class="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">Échéance: J+2</span>
                    </li>
                </ul>
            </div>
        </div>
    </main>
</body>
</html>
EOL

# Créer un Dockerfile pour le serveur statique
cat > /Users/d972/dtahc-project/static-pages/Dockerfile << 'EOL'
FROM nginx:alpine

COPY . /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOL

# Construire et lancer le conteneur
cd /Users/d972/dtahc-project/static-pages
docker build -t dtahc-static-pages .
docker stop dtahc-frontend || true
docker rm dtahc-frontend || true
docker run -d --name dtahc-frontend -p 3000:80 dtahc-static-pages

echo "Serveur statique créé et démarré sur http://localhost:3000"
echo "Vous pouvez accéder aux pages:"
echo "- http://localhost:3000 (Accueil)"
echo "- http://localhost:3000/clients/ (Gestion des clients)"
echo "- http://localhost:3000/admin/ (Administration)"
echo "- http://localhost:3000/communication/ (Modèles de communication)"
echo "- http://localhost:3000/comptable/ (Gestion comptable)"
echo "- http://localhost:3000/dashboard/ (Tableau de bord)"