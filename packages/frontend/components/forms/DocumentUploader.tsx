'use client';

import { useState, memo, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const Camera = dynamic(() => import('lucide-react').then(mod => mod.Camera));
const Upload = dynamic(() => import('lucide-react').then(mod => mod.Upload));
const CheckCircle = dynamic(() => import('lucide-react').then(mod => mod.CheckCircle));

interface DocumentUploaderProps {
  id: string;
  label: string;
  description: string;
  acceptTypes: string;
  isRequired: boolean;
  file: File | null;
  onFileChange: (file: File | null) => void;
  buttonLabel?: string;
  icon: React.ReactNode;
}

const DocumentUploader = memo(({ 
  id,
  label,
  description,
  acceptTypes,
  isRequired,
  file,
  onFileChange,
  buttonLabel = "Sélectionner un fichier",
  icon
}: DocumentUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
  // Créer une prévisualisation pour les images
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
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
    }
  }, [onFileChange]);

  const handleClick = useCallback(() => {
    // Sélectionner l'élément input file et déclencher un clic de manière plus fiable
    const inputElement = document.getElementById(id) as HTMLInputElement;
    if (inputElement) {
      inputElement.click();
    } else {
      console.error(`Input element with id ${id} not found`);
    }
  }, [id]);

  const handleRemove = useCallback(() => {
    onFileChange(null);
    setPreview(null);
  }, [onFileChange]);

  // Fonctions pour le glisser-déposer
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Vérifier si le curseur est sorti de la zone de dépôt
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
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
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0];
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
    }
  }, [onFileChange]);

  return (
    <div className="border rounded p-4 bg-gray-50">
      <label className="block font-medium text-gray-700 mb-2">
        {label}
        {isRequired && <span className="text-red-600 ml-1">*</span>}
      </label>
      <div 
        ref={dropZoneRef}
        className={`flex items-center justify-center bg-white border-2 border-dashed ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} rounded-md h-40 relative overflow-hidden transition-all duration-200 cursor-pointer hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm group`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {file ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {preview ? (
              <div className="relative w-full h-full">
                <Image 
                  src={preview} 
                  alt="Aperçu" 
                  fill 
                  className="object-contain p-2" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="text-green-400">
                    <CheckCircle size={40} />
                  </div>
                  <p className="mt-2 text-sm text-white">{file.name}</p>
                  <button 
                    type="button" 
                    onClick={handleRemove}
                    className="mt-2 text-xs text-red-400 underline"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-green-600">
                  <CheckCircle size={40} />
                </div>
                <p className="mt-2 text-sm text-gray-700">{file.name}</p>
                <button 
                  type="button" 
                  onClick={handleRemove}
                  className="mt-2 text-xs text-red-600 underline"
                >
                  Supprimer
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            <input
              type="file"
              accept={acceptTypes}
              className="hidden"
              id={id}
              onChange={handleFileChange}
            />
            <div className="text-center">
              <div 
                onClick={handleClick}
                className="cursor-pointer"
              >
                <div className="mx-auto text-gray-400 group-hover:text-blue-500 transition-colors">
                  {icon}
                </div>
                <p className="mt-2 text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                  {isDragging ? "Déposer ici" : "Déposer ou Cliquer pour ajouter"}
                </p>
                <p className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors">{description}</p>
              </div>
              
              <button
                type="button"
                onClick={handleClick}
                className="mt-3 px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {buttonLabel}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

DocumentUploader.displayName = 'DocumentUploader';

export default DocumentUploader;