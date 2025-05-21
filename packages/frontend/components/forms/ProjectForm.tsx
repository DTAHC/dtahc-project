'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';

// Import dynamique des icônes pour optimiser le chargement initial
const Icons = {
  Info: dynamic(() => import('lucide-react').then(mod => mod.Info), { ssr: false, loading: () => <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" /> }),
  MapPin: dynamic(() => import('lucide-react').then(mod => mod.MapPin), { ssr: false, loading: () => <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" /> }),
  Building: dynamic(() => import('lucide-react').then(mod => mod.Building), { ssr: false, loading: () => <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" /> }),
  AlertTriangle: dynamic(() => import('lucide-react').then(mod => mod.AlertTriangle), { ssr: false, loading: () => <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" /> }),
  Upload: dynamic(() => import('lucide-react').then(mod => mod.Upload), { ssr: false, loading: () => <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" /> }),
  Camera: dynamic(() => import('lucide-react').then(mod => mod.Camera), { ssr: false, loading: () => <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" /> }),
  CheckCircle: dynamic(() => import('lucide-react').then(mod => mod.CheckCircle), { ssr: false, loading: () => <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" /> })
};
// Utilisation des nouvelles API dédiées aux formulaires de projet
import { validateProjectToken, submitProjectForm } from '@/lib/api/project-form';

// Importer nos composants optimisés
import StepIndicator from './StepIndicator';
import ImprovedDocumentUploader from './ImprovedDocumentUploader';

const ProjectForm = memo(function ProjectForm({ token }: { token: string }) {
  const router = useRouter();
  
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    // Informations personnelles
    name: '',
    email: '',
    phone: '',
    
    // Adresse
    address: {
      street: '',
      complementary: '',
      zipCode: '',
      city: '',
      country: 'France',
    },
    
    // Informations fiscales
    fiscalNumber: '',
    companyNumber: '',
    
    // Projet
    projectType: 'DP',
    projectTitle: '',
    projectDescription: '',
    
    // Adresse du projet (si différente)
    sameAddress: true,
    projectAddress: {
      street: '',
      complementary: '',
      zipCode: '',
      city: '',
      department: '',
      cadastralReferences: '',
    },
    
    surfaceArea: '',
    budget: '',
    
    // Documents
    documents: {
      photoPres: null,
      photoLoin: null,
      croquis: null,
      documents: null
    },
    
    // Notes internes
    internalNotes: '',
    
    // RGPD et autorisations
    rgpdConsent: false,
    adminAuthorization: false
  });
  
  useEffect(() => {
    async function verifyToken() {
      try {
        setLoading(true);
        setError(null);
        
        if (typeof token !== 'string') {
          throw new Error('Token non valide');
        }
        
        // Valider le token via notre API
        const response = await validateProjectToken(token as string);
        
        // Pré-remplir le formulaire avec les données existantes
        setClientData(response.data);
        setFormData(prev => ({
          ...prev,
          name: response.data.clientInfo?.name || '',
          email: response.data.clientInfo?.email || '',
          phone: response.data.clientInfo?.phone || '',
          // Autres champs si disponibles...
        }));
        
      } catch (err: any) {
        console.error('Erreur validation token:', err);
        setError(err.response?.data?.message || err.message || 'Ce lien n\'est pas valide ou a expiré');
      } finally {
        setLoading(false);
      }
    }
    
    verifyToken();
  }, [token]);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    
    if (name.includes('.')) {
      // Champ imbriqué (address.street, etc.)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        }
      }));
    } else if (type === 'checkbox') {
      if (name === 'sameAddress') {
        // Case à cocher pour utiliser la même adresse
        setFormData(prev => ({
          ...prev,
          sameAddress: checked,
          // Si coché, copier l'adresse du client
          projectAddress: checked 
            ? { ...prev.address, department: prev.projectAddress.department, cadastralReferences: prev.projectAddress.cadastralReferences }
            : prev.projectAddress,
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked,
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  }, []);
  
  const goToNextStep = useCallback(() => {
    window.scrollTo(0, 0);
    setCurrentStep(prev => prev + 1);
  }, []);
  
  const goToPreviousStep = useCallback(() => {
    window.scrollTo(0, 0);
    setCurrentStep(prev => prev - 1);
  }, []);
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier que les consentements obligatoires sont donnés
    if (!formData.rgpdConsent || !formData.adminAuthorization) {
      toast.error("Veuillez accepter les conditions nécessaires à la validation de votre dossier");
      return;
    }
    
    // Vérifier que les documents obligatoires sont présents
    if (!formData.documents.photoPres || !formData.documents.photoLoin) {
      toast.error("Veuillez ajouter les photos obligatoires (près et loin) pour pouvoir soumettre votre dossier");
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Préparer les données avant envoi
      const dataToSubmit = {
        ...formData,
        // Si même adresse, utiliser l'adresse client pour le projet
        projectAddress: formData.sameAddress 
          ? { 
              ...formData.address, 
              department: formData.projectAddress.department,
              cadastralReferences: formData.projectAddress.cadastralReferences,
            }
          : formData.projectAddress,
        // Ajouter les caractéristiques et nature des travaux pour le modèle Dossier
        characteristics: {
          changementDestination: false,
          erp: false,
          demolition: false,
          travauxRealises: false
        },
        workNature: {
          constructionNeuve: formData.projectType === 'PC_RT',
          extension: formData.projectType.includes('DP_'),
          modificationFacade: formData.projectType === 'DP_FENETRE'
        },
        // Documents - transformer les objets File en informations pour simulation API
        documents: {
          photoPres: formData.documents.photoPres ? {
            name: formData.documents.photoPres.name,
            size: formData.documents.photoPres.size,
            type: formData.documents.photoPres.type,
            lastModified: formData.documents.photoPres.lastModified,
          } : null,
          photoLoin: formData.documents.photoLoin ? {
            name: formData.documents.photoLoin.name,
            size: formData.documents.photoLoin.size,
            type: formData.documents.photoLoin.type,
            lastModified: formData.documents.photoLoin.lastModified,
          } : null,
          croquis: formData.documents.croquis ? {
            name: formData.documents.croquis.name,
            size: formData.documents.croquis.size,
            type: formData.documents.croquis.type,
            lastModified: formData.documents.croquis.lastModified,
          } : null,
          documents: formData.documents.documents ? {
            name: formData.documents.documents.name,
            size: formData.documents.documents.size,
            type: formData.documents.documents.type,
            lastModified: formData.documents.documents.lastModified,
          } : null,
        }
      };
      
      delete dataToSubmit.sameAddress;
      
      // Dans une API réelle, les documents seraient téléchargés avec FormData
      // Ici, nous simulons juste l'envoi des informations de document
      
      // Soumettre le formulaire via l'API
      const response = await submitProjectForm(token as string, dataToSubmit);
      console.log('Formulaire soumis avec succès:', response);
      
      // Notifier de la création du dossier
      if (typeof window !== 'undefined') {
        // Déclencher les événements pour mettre à jour les autres composants
        window.dispatchEvent(new CustomEvent('clientStorageUpdated'));
        window.dispatchEvent(new CustomEvent('dossierStorageUpdated'));
        
        if (response.clientId && response.dossierId) {
          // Enregistrer l'ID du dossier créé pour référence ultérieure
          localStorage.setItem('lastCreatedDossierId', response.dossierId);
          localStorage.setItem('lastCreatedClientId', response.clientId);
          
          // Sauvegarder les informations sur les documents
          try {
            const documentsInfo = {
              photoPres: formData.documents.photoPres ? formData.documents.photoPres.name : null,
              photoLoin: formData.documents.photoLoin ? formData.documents.photoLoin.name : null,
              croquis: formData.documents.croquis ? formData.documents.croquis.name : null,
              documents: formData.documents.documents ? formData.documents.documents.name : null,
              uploadedAt: new Date().toISOString()
            };
            localStorage.setItem('lastUploadedDocuments', JSON.stringify(documentsInfo));
          } catch (e) {
            console.error('Erreur lors de la sauvegarde des informations de documents:', e);
          }
          
          // Définir temporairement le type d'utilisateur pour permettre l'affichage des liens
          // administratifs sur la page de confirmation (uniquement pour la démo)
          localStorage.setItem('userType', 'admin');
        }
      }
      
      toast.success('Formulaire soumis avec succès!');
      
      // Rediriger vers la page de confirmation
      router.push(`/fiche-projet/confirmation`);
      
    } catch (err: any) {
      toast.error('Erreur lors de la soumission du formulaire');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }, [formData, router, token]);
  
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 bg-blue-600 animate-pulse opacity-70">
            <div className="h-8 bg-white bg-opacity-30 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-white bg-opacity-30 rounded w-1/2"></div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="flex justify-end mt-4">
              <div className="h-10 bg-blue-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-xl">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 bg-red-50 border-l-4 border-red-600">
            <h1 className="text-2xl font-bold mb-4 text-red-600 flex items-center gap-2">
              <Icons.AlertTriangle size={20} />
              Lien invalide
            </h1>
            <p className="mb-4 text-gray-700">{error}</p>
            <p className="text-sm text-gray-600">Si vous pensez qu'il s'agit d'une erreur, veuillez contacter notre service client.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 bg-blue-600 text-white">
          <h1 className="text-2xl font-bold">Fiche projet</h1>
          <p>Veuillez compléter toutes les informations nécessaires à votre projet.</p>
        </div>
        
        {/* Logo et présentation */}
        <div className="px-6 py-4 bg-white border-b border-gray-200 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Document confidentiel</p>
          </div>
          <div>
            <img src="/logo.png" alt="DTAHC" className="h-10" loading="lazy" onError={(e) => (e.currentTarget.style.display = 'none')} />
          </div>
        </div>
        
        {/* Bannière d'information */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mx-6 my-4 flex items-start gap-3">
          <div className="text-blue-500 mt-0.5 flex-shrink-0">
            <Icons.Info size={18} />
          </div>
          <div>
            <p className="text-blue-800 text-sm font-medium mb-1">
              Complétez cette fiche avec les informations de votre projet
            </p>
            <p className="text-blue-700 text-sm">
              Les champs marqués d'un astérisque (*) sont obligatoires. Ce formulaire nous permettra de traiter votre demande de manière optimale.
            </p>
          </div>
        </div>
        
        {/* Indicateur d'étape optimisé */}
        <StepIndicator 
          currentStep={currentStep} 
          totalSteps={4} 
          steps={[
            "Informations personnelles", 
            "Adresse", 
            "Détails du projet", 
            "Documents et RGPD"
          ]} 
        />
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Étape 1: Informations personnelles */}
          {currentStep === 1 && (
            <div className="step-content">
              <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="name">
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="phone">
                  Numéro de téléphone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="fiscalNumber">
                  Numéro fiscal (particulier)
                </label>
                <input
                  type="text"
                  id="fiscalNumber"
                  name="fiscalNumber"
                  value={formData.fiscalNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="companyNumber">
                  SIRET (professionnel)
                </label>
                <input
                  type="text"
                  id="companyNumber"
                  name="companyNumber"
                  value={formData.companyNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
          
          {/* Étape 2: Adresse */}
          {currentStep === 2 && (
            <div className="step-content">
              <h2 className="text-xl font-semibold mb-4">Adresse</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="address.street">
                  Rue *
                </label>
                <input
                  type="text"
                  id="address.street"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="address.complementary">
                  Complément d'adresse
                </label>
                <input
                  type="text"
                  id="address.complementary"
                  name="address.complementary"
                  value={formData.address.complementary}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-1">
                  <label className="block text-gray-700 mb-2" htmlFor="address.zipCode">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    id="address.zipCode"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-md"
                    required
                    pattern="[0-9]{5}"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2" htmlFor="address.city">
                    Ville *
                  </label>
                  <input
                    type="text"
                    id="address.city"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Précédent
                </button>
                
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
          
          {/* Étape 3: Détails du projet */}
          {currentStep === 3 && (
            <div className="step-content">
              <h2 className="text-xl font-semibold mb-4">Détails du projet</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="projectType">
                  Type de projet *
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                  required
                >
                  <option value="DP">Déclaration Préalable (DP)</option>
                  <option value="PC">Permis de Construire (PC)</option>
                  <option value="PA">Permis d'Aménager (PA)</option>
                  <option value="AT">Autorisation de Travaux ERP (AT)</option>
                  <option value="CU">Certificat d'Urbanisme (CU)</option>
                  <option value="AUTRE">Autre</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="projectTitle">
                  Titre du projet *
                </label>
                <input
                  type="text"
                  id="projectTitle"
                  name="projectTitle"
                  value={formData.projectTitle}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="projectDescription">
                  Description du projet *
                </label>
                <textarea
                  id="projectDescription"
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                  rows={4}
                  required
                ></textarea>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sameAddress"
                    name="sameAddress"
                    checked={formData.sameAddress}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label className="text-gray-700" htmlFor="sameAddress">
                    L'adresse du projet est identique à mon adresse
                  </label>
                </div>
              </div>
              
              {!formData.sameAddress && (
                <div className="border p-4 rounded-md bg-gray-50 mb-4">
                  <h3 className="font-medium mb-3">Adresse du projet</h3>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="projectAddress.street">
                      Rue *
                    </label>
                    <input
                      type="text"
                      id="projectAddress.street"
                      name="projectAddress.street"
                      value={formData.projectAddress.street}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded-md"
                      required={!formData.sameAddress}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="projectAddress.complementary">
                      Complément d'adresse
                    </label>
                    <input
                      type="text"
                      id="projectAddress.complementary"
                      name="projectAddress.complementary"
                      value={formData.projectAddress.complementary}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded-md"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="md:col-span-1">
                      <label className="block text-gray-700 mb-2" htmlFor="projectAddress.zipCode">
                        Code postal *
                      </label>
                      <input
                        type="text"
                        id="projectAddress.zipCode"
                        name="projectAddress.zipCode"
                        value={formData.projectAddress.zipCode}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                        required={!formData.sameAddress}
                        pattern="[0-9]{5}"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 mb-2" htmlFor="projectAddress.city">
                        Ville *
                      </label>
                      <input
                        type="text"
                        id="projectAddress.city"
                        name="projectAddress.city"
                        value={formData.projectAddress.city}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-md"
                        required={!formData.sameAddress}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="projectAddress.department">
                  Département du projet
                </label>
                <input
                  type="text"
                  id="projectAddress.department"
                  name="projectAddress.department"
                  value={formData.projectAddress.department}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="projectAddress.cadastralReferences">
                  Références cadastrales (si connues)
                </label>
                <input
                  type="text"
                  id="projectAddress.cadastralReferences"
                  name="projectAddress.cadastralReferences"
                  value={formData.projectAddress.cadastralReferences}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                  placeholder="Ex: Section AB, Parcelle 123"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="surfaceArea">
                    Surface du projet (m²)
                  </label>
                  <input
                    type="number"
                    id="surfaceArea"
                    name="surfaceArea"
                    value={formData.surfaceArea}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-md"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="budget">
                    Budget estimé (€)
                  </label>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-md"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Précédent
                </button>
                
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
          
          {/* Étape 4: Documents, notes et RGPD */}
          {currentStep === 4 && (
            <div className="step-content">
              <h2 className="text-xl font-semibold mb-4">Documents et consentements</h2>
              
              {/* Section Documents */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <Icons.Upload size={18} className="text-blue-600" />
                  Documents du projet
                </h3>
                
                <div className="bg-blue-50 p-3 rounded-md mb-4 text-sm text-blue-700">
                  <p><strong>Comment ajouter des documents ?</strong></p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-xs">
                    <li>Sur <strong>ordinateur</strong> : Cliquez sur une zone ci-dessous pour sélectionner un fichier depuis votre disque dur</li>
                    <li>Sur <strong>smartphone/tablette</strong> : Tapez sur une zone pour ouvrir l'appareil photo ou choisir dans votre galerie</li>
                    <li>Vous pouvez prendre des photos directement ou choisir des images existantes</li>
                  </ul>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Photo de près - Composant amélioré */}
                  <ImprovedDocumentUploader
                    id="photo-pres-input"
                    label="Photo de près"
                    description="Photo montrant le projet de près"
                    acceptTypes="image/*"
                    isRequired={true}
                    file={formData.documents.photoPres}
                    onFileChange={(file) => setFormData({
                      ...formData,
                      documents: {
                        ...formData.documents,
                        photoPres: file
                      }
                    })}
                    buttonLabel="Prendre photo / Choisir"
                  />
                  
                  {/* Photo de loin - Composant amélioré */}
                  <ImprovedDocumentUploader
                    id="photo-loin-input"
                    label="Photo de loin"
                    description="Photo montrant le projet avec son environnement"
                    acceptTypes="image/*"
                    isRequired={true}
                    file={formData.documents.photoLoin}
                    onFileChange={(file) => setFormData({
                      ...formData,
                      documents: {
                        ...formData.documents,
                        photoLoin: file
                      }
                    })}
                    buttonLabel="Prendre photo / Choisir"
                  />
                  
                  {/* Croquis ou plan - Composant amélioré */}
                  <ImprovedDocumentUploader
                    id="croquis-input"
                    label="Croquis ou plan (facultatif)"
                    description="Croquis, plan ou dessin du projet"
                    acceptTypes="image/*,.pdf"
                    isRequired={false}
                    file={formData.documents.croquis}
                    onFileChange={(file) => setFormData({
                      ...formData,
                      documents: {
                        ...formData.documents,
                        croquis: file
                      }
                    })}
                    buttonLabel="Sélectionner un fichier"
                  />
                  
                  {/* Autres documents - Composant amélioré */}
                  <ImprovedDocumentUploader
                    id="documents-input"
                    label="Autres documents (facultatif)"
                    description="Tout autre document utile au projet"
                    acceptTypes=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    isRequired={false}
                    file={formData.documents.documents}
                    onFileChange={(file) => setFormData({
                      ...formData,
                      documents: {
                        ...formData.documents,
                        documents: file
                      }
                    })}
                    buttonLabel="Sélectionner un fichier"
                  />
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  * Les photos de près et de loin sont obligatoires pour pouvoir traiter votre dossier
                </p>
              </div>
              
              {/* Notes supplémentaires */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Notes supplémentaires</h3>
                <textarea
                  id="internalNotes"
                  name="internalNotes"
                  value={formData.internalNotes}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                  rows={3}
                  placeholder="Informations complémentaires sur votre projet..."
                ></textarea>
              </div>
              
              {/* RGPD et Autorisations */}
              <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800 mb-3">Consentements et autorisations</h3>
                
                <div className="mb-4">
                  <label className="flex items-start mb-2">
                    <input
                      type="checkbox"
                      name="rgpdConsent"
                      checked={formData.rgpdConsent}
                      onChange={handleChange}
                      className="mt-1 mr-2"
                    />
                    <span className="text-sm text-blue-700">
                      J'accepte que mes données personnelles soient collectées et traitées dans le cadre de ma demande d'autorisation de travaux, conformément au RGPD. Je comprends que ces informations sont nécessaires au traitement de mon dossier et qu'elles ne seront pas utilisées à d'autres fins.*
                    </span>
                  </label>
                </div>
                
                <div className="mb-4">
                  <label className="flex items-start mb-2">
                    <input
                      type="checkbox"
                      name="adminAuthorization"
                      checked={formData.adminAuthorization}
                      onChange={handleChange}
                      className="mt-1 mr-2"
                    />
                    <span className="text-sm text-blue-700">
                      J'autorise DTAHC à effectuer en mon nom et pour mon compte toutes les démarches administratives nécessaires à l'obtention des autorisations de travaux auprès des services compétents (mairie, urbanisme, etc.).*
                    </span>
                  </label>
                </div>
                
                <p className="text-xs text-blue-600 mt-2">
                  * Ces consentements sont nécessaires pour pouvoir traiter votre dossier.
                </p>
              </div>
              
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Précédent
                </button>
                
                <button
                  type="submit"
                  disabled={submitting || !formData.rgpdConsent || !formData.adminAuthorization || !formData.documents.photoPres || !formData.documents.photoLoin}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Soumission en cours...</span>
                    </>
                  ) : (
                    <>
                      <Icons.CheckCircle size={16} />
                      <span>Valider ma fiche projet</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
      
      <style jsx>{`
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          position: relative;
        }
        
        .step-number {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          font-weight: bold;
        }
        
        .step-label {
          font-size: 14px;
          text-align: center;
        }
        
        .step:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 15px;
          right: -50%;
          width: 100%;
          height: 2px;
          background-color: #e5e7eb;
          z-index: 0;
        }
        
        .step.active:not(:last-child)::after {
          background-color: #2563eb;
        }
      `}</style>
    </div>
  );
});

export default ProjectForm;