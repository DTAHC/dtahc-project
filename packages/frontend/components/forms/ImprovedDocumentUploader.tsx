'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Camera, Upload, CheckCircle, FileText, Image as ImageIcon, X } from 'lucide-react';

interface ImprovedDocumentUploaderProps {
  id: string;
  label: string;
  description: string;
  acceptTypes: string;
  isRequired: boolean;
  file: File | null;
  onFileChange: (file: File | null) => void;
  buttonLabel?: string;
}

export default function ImprovedDocumentUploader({
  id,
  label,
  description,
  acceptTypes,
  isRequired,
  file,
  onFileChange,
  buttonLabel = "Sélectionner un fichier"
}: ImprovedDocumentUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const dragCounterRef = useRef(0);

  // Détermine l'icône à utiliser en fonction du type d'acceptation
  const getIconForAcceptType = useCallback(() => {
    if (acceptTypes.includes('image/')) {
      return <Camera size={40} />;
    } else if (acceptTypes.includes('.pdf')) {
      return <FileText size={40} />;
    } else {
      return <Upload size={40} />;
    }
  }, [acceptTypes]);

  // Créer une prévisualisation pour les images
  const processFile = useCallback((selectedFile: File) => {
    // Vérifier si le fichier est acceptable
    if (!isFileTypeAccepted(selectedFile)) {
      setErrorMessage(`Type de fichier non accepté. Formats autorisés: ${acceptTypes}`);
      return;
    }

    // Effacer toute erreur précédente
    setErrorMessage(null);
    
    // Mise à jour du fichier dans le state parent
    onFileChange(selectedFile);
    
    // Créer un aperçu d'image si c'est une image
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }, [acceptTypes, onFileChange]);

  // Vérifier si le type de fichier est accepté
  const isFileTypeAccepted = useCallback((file: File) => {
    // Si acceptTypes est "*" ou vide, accepter tous les types
    if (!acceptTypes || acceptTypes === "*") return true;
    
    const types = acceptTypes.split(',').map(type => type.trim());
    
    // Vérifier les extensions de fichier
    const fileExtension = `.${file.name.split('.').pop()}`.toLowerCase();
    if (types.some(type => type.startsWith('.') && type.toLowerCase() === fileExtension)) {
      return true;
    }
    
    // Vérifier les types MIME
    if (types.some(type => {
      // Gérer les wildcards comme "image/*"
      if (type.endsWith('/*')) {
        const category = type.substring(0, type.length - 2);
        return file.type.startsWith(category);
      }
      return type === file.type;
    })) {
      return true;
    }
    
    return false;
  }, [acceptTypes]);

  // Gestionnaire pour le changement de fichier via input
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  // Gestionnaire pour le clic sur la zone ou le bouton
  const handleClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // Gestionnaire pour supprimer le fichier
  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher le déclenchement de onClick sur le parent
    onFileChange(null);
    setPreview(null);
    setErrorMessage(null);
    
    // Réinitialiser l'input file pour permettre de sélectionner à nouveau le même fichier
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileChange]);

  // Fonctions pour le glisser-déposer
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    dragCounterRef.current++;
    
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    dragCounterRef.current--;
    
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Assurer que l'utilisateur peut déposer
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  // Pour faciliter le test en dev - afficher clairement l'ID de l'input dans la console
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`ImprovedDocumentUploader mounted with ID: ${id}`);
    }
    
    // Nettoyer la prévisualisation lors du démontage
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [id, preview]);

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <label className="block font-medium text-gray-700 mb-2">
        {label}
        {isRequired && <span className="text-red-600 ml-1">*</span>}
      </label>
      
      <div 
        ref={dropZoneRef}
        className={`
          flex flex-col items-center justify-center
          bg-white border-2 border-dashed 
          ${isDragging ? 'border-blue-500 bg-blue-50' : errorMessage ? 'border-red-300' : 'border-gray-300'}
          ${file ? 'bg-gray-50' : 'bg-white'} 
          rounded-md h-44 relative overflow-hidden 
          transition-all duration-200 cursor-pointer
          hover:border-blue-400 hover:bg-blue-50 hover:shadow-md
        `}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptTypes}
          className="hidden"
          id={id}
          onChange={handleFileChange}
        />
        
        {file ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
            {preview ? (
              <div className="relative w-full h-full group">
                <Image 
                  src={preview} 
                  alt="Aperçu" 
                  fill 
                  className="object-contain rounded-md" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="text-green-400 mb-1">
                    <CheckCircle size={36} />
                  </div>
                  <p className="text-sm text-white text-center mb-2">{file.name}</p>
                  <button 
                    type="button" 
                    onClick={handleRemove}
                    className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white text-xs rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={12} />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full text-center px-2">
                <div className="text-green-600 mb-2">
                  {file.type.startsWith('image/') ? (
                    <ImageIcon size={36} />
                  ) : (
                    <FileText size={36} />
                  )}
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">{file.name}</p>
                <p className="text-xs text-gray-500 mb-3">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || 'Type inconnu'}
                </p>
                <button 
                  type="button" 
                  onClick={handleRemove}
                  className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white text-xs rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={12} />
                  <span>Supprimer</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className={`mb-2 ${isDragging ? 'text-blue-500' : errorMessage ? 'text-red-500' : 'text-gray-400'} transition-colors`}>
              {getIconForAcceptType()}
            </div>
            
            {errorMessage ? (
              <div className="mb-2">
                <p className="text-sm font-medium text-red-600">{errorMessage}</p>
              </div>
            ) : (
              <>
                <p className="mb-1 text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                  {isDragging ? "Déposer ici" : "Déposer ou Cliquer pour ajouter"}
                </p>
                <p className="text-xs text-gray-500 mb-3">{description}</p>
              </>
            )}
            
            <button
              type="button"
              className="mt-1 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {buttonLabel}
            </button>
          </div>
        )}
      </div>
      
      {isRequired && !file && (
        <p className="mt-1 text-xs text-gray-500">
          * Ce document est obligatoire pour valider votre dossier
        </p>
      )}
    </div>
  );
}