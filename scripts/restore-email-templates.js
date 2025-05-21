// Script pour réintégrer les modèles d'emails dans la base de données
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function importEmailTemplates() {
  const templates = [
    {
      name: "Fiche d'information client",
      category: "client",
      subject: "Informations requises pour votre projet - DTAHC",
      content: `Bonjour {NOM_CLIENT},

Je vous remercie de nous faire confiance pour votre projet situé au {ADRESSE_PROJET}.

Afin de préparer au mieux votre dossier d'autorisation de travaux, nous avons besoin des informations et documents suivants :

1. Informations cadastrales complètes de votre bien
2. Photos récentes de l'existant (intérieur et extérieur)
3. Plans actuels si disponibles
4. Descriptif précis des travaux envisagés
5. Contraintes d'urbanisme dont vous auriez connaissance

Vous pouvez nous transmettre ces éléments par email ou via notre plateforme sécurisée accessible depuis notre site construires.fr.

Notre équipe reste à votre disposition pour toute question au 01.30.49.25.18.

Cordialement,

{NOM_CONSEILLER}
DTAHC SARL - Bureau d'études en architecture
13 rue René Laennec, 78310 COIGNIÈRES
Tél. : 01.30.49.25.18
www.construires.fr`,
      fromName: "DTAHC",
      status: "ACTIVE"
    },
    {
      name: "Envoi de devis",
      category: "facturation",
      subject: "Votre devis {REFERENCE} pour votre projet - DTAHC",
      content: `Bonjour {NOM_CLIENT},

Suite à notre entretien concernant votre projet situé au {ADRESSE_PROJET}, j'ai le plaisir de vous adresser votre devis {REFERENCE} en pièce jointe.

Ce devis comprend les prestations suivantes :
• {PRESTATION_1}
• {PRESTATION_2}
• {PRESTATION_3}

Le montant total s'élève à {MONTANT_TTC}€ TTC.

Ce devis est valable jusqu'au {DATE_VALIDITE}. Pour valider votre commande, il vous suffit de nous retourner le devis signé avec la mention "Bon pour accord", accompagné d'un acompte de {MONTANT_ACOMPTE}€.

Nous restons à votre disposition pour toute information complémentaire.

Cordialement,

{NOM_CONSEILLER}
DTAHC SARL - Bureau d'études en architecture
13 rue René Laennec, 78310 COIGNIÈRES
Tél. : 01.30.49.25.18
www.construires.fr`,
      fromName: "DTAHC",
      status: "ACTIVE"
    },
    {
      name: "Confirmation de dépôt en mairie",
      category: "client",
      subject: "Dossier {REFERENCE} - Confirmation de dépôt en mairie",
      content: `Bonjour {NOM_CLIENT},

J'ai le plaisir de vous informer que votre dossier {REFERENCE} concernant le projet situé au {ADRESSE_PROJET} a été déposé aujourd'hui auprès du service urbanisme de la mairie de {VILLE_MAIRIE}.

Informations importantes :
• Numéro d'enregistrement : {NUMERO_ENREGISTREMENT}
• Date de dépôt : {DATE_DEPOT}
• Délai d'instruction prévu : {DELAI_INSTRUCTION}
• Date prévisionnelle de réponse : {DATE_REPONSE}

Pendant cette période d'instruction, le service urbanisme peut être amené à nous demander des pièces complémentaires. Dans ce cas, nous vous en informerons immédiatement.

Vous pouvez suivre l'avancement de votre dossier directement sur notre plateforme client : {LIEN_PLATEFORME}

Nous restons bien entendu à votre disposition pour tout renseignement complémentaire.

Cordialement,

{NOM_CONSEILLER}
DTAHC SARL - Bureau d'études en architecture
13 rue René Laennec, 78310 COIGNIÈRES
Tél. : 01.30.49.25.18
www.construires.fr`,
      fromName: "DTAHC",
      status: "ACTIVE"
    }
  ];

  console.log(`Début de la réintégration de ${templates.length} modèles d'emails...`);
  let count = 0;

  try {
    // Création des templates en utilisant Prisma
    for (const template of templates) {
      await prisma.emailTemplate.create({
        data: {
          ...template,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      count++;
    }
    console.log(`Importation terminée avec succès : ${count} modèles d'emails intégrés dans la base de données.`);
  } catch (error) {
    console.error('Erreur lors de l\'importation des modèles d\'emails:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter la fonction
importEmailTemplates();