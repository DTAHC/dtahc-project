# Guide de migration vers Next.js

Ce document explique comment migrer les composants React (CRA) vers Next.js en suivant la stack technologique recommandée pour le projet DTAHC.

## Contexte

Notre projet DTAHC a été initialement développé avec deux implémentations frontend différentes:
1. **React avec Create React App (CRA)** - Utilisé dans l'environnement Docker
2. **Next.js** - Développé comme la solution future recommandée

Pour éliminer cette dualité et standardiser sur la stack technologique recommandée, nous migrons complètement vers Next.js avec TailwindCSS.

## Différences principales entre React (CRA) et Next.js

| Aspect | React (CRA) | Next.js |
|--------|-------------|---------|
| Routing | React Router | App Router (basé sur le système de fichiers) |
| Styling | Chakra UI | TailwindCSS |
| Structure des fichiers | Arbitraire | Basée sur les routes `/app/route/page.tsx` |
| Rendu | Client-side uniquement | Server-side + Client-side |
| Variables d'environnement | `REACT_APP_*` | `NEXT_PUBLIC_*` |

## Guide étape par étape pour migrer un composant

### 1. Conversion de la structure de fichiers

React (CRA):
```
/src/pages/ComptablePage.jsx
```

Next.js:
```
/packages/frontend/app/comptable/page.tsx
```

### 2. Conversion du composant React en composant Next.js

#### React (CRA) avec Chakra UI:
```jsx
import React from 'react';
import { Box, Heading } from '@chakra-ui/react';

const ComptablePage = () => {
  return (
    <Box p={6}>
      <Heading>Gestion Comptable</Heading>
      {/* Contenu */}
    </Box>
  );
};

export default ComptablePage;
```

#### Next.js avec TailwindCSS:
```tsx
import React from 'react';

export default function ComptablePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Gestion Comptable</h1>
      {/* Contenu */}
    </div>
  );
}
```

### 3. Conversion des styles Chakra UI vers TailwindCSS

| Chakra UI | TailwindCSS |
|-----------|-------------|
| `<Box p={6}>` | `<div className="p-6">` |
| `<Heading size="xl">` | `<h1 className="text-2xl font-bold">` |
| `<Text mt={4}>` | `<p className="mt-4">` |
| `<Flex align="center">` | `<div className="flex items-center">` |
| `<Button colorScheme="blue">` | `<button className="bg-blue-600 text-white px-4 py-2 rounded">` |

### 4. Conversion du routage

#### React Router (CRA):
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/comptable" element={<ComptablePage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

#### Next.js App Router:
La structure de fichiers définit le routage:
- `/app/comptable/page.tsx` → accessible à `/comptable`

Pour les liens:
```tsx
import Link from 'next/link';

<Link href="/comptable">Gestion Comptable</Link>
```

### 5. Conversion des hooks et de la gestion d'état

#### Gestion des états:
- React Query fonctionne de la même manière dans les deux environnements
- Remplacer les hooks spécifiques à Chakra UI par leurs équivalents

#### Navigation:
```tsx
// React Router (CRA)
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/comptable');

// Next.js
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/comptable');
```

## Exemples de migration complets

Des exemples complets de composants migrés se trouvent dans:
- `/packages/frontend/app/comptable/page.tsx` - Page comptable
- `/packages/frontend/components/layout/Sidebar.tsx` - Barre latérale

## Utilisation du script de migration

Un script a été créé pour faciliter la migration des fichiers Docker:

```bash
# Rendre le script exécutable
chmod +x /Users/d972/dtahc-project/scripts/migrate-to-nextjs.sh

# Exécuter le script
/Users/d972/dtahc-project/scripts/migrate-to-nextjs.sh
```

Ce script:
1. Sauvegarde les fichiers existants
2. Met à jour les fichiers Docker pour utiliser Next.js
3. Fournit des instructions pour terminer la migration

## Tester la migration

Après avoir exécuté le script de migration:

1. Arrêtez les conteneurs Docker existants:
   ```bash
   docker-compose -f /Users/d972/dtahc-project/docker/docker-compose.yml down
   ```

2. Démarrez les nouveaux conteneurs Docker:
   ```bash
   docker-compose -f /Users/d972/dtahc-project/docker/docker-compose.yml up -d
   ```

3. Vérifiez que l'application fonctionne correctement à http://localhost:3000

## Ressources utiles

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation TailwindCSS](https://tailwindcss.com/docs)
- [Convertisseur Chakra UI vers TailwindCSS](https://transform.tools/chakra-to-tailwind)
- [Next.js App Router](https://nextjs.org/docs/app)