import React, { useState } from 'react';
import { 
  CheckCircle, Clock, AlertCircle, FileText, Check, X, Calendar,
  ChevronRight, ChevronDown, Edit, Eye, MessageSquare, Search, PlusCircle,
  CheckSquare, User, Upload, Download, Paperclip, Filter, ArrowRight
} from 'lucide-react';

const WorkflowTachesUnified = () => {
  // États
  const [activeStep, setActiveStep] = useState(1);
  const [activeTab, setActiveTab] = useState('workflow'); // 'workflow' ou 'tasks'
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [activeDocument, setActiveDocument] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Données de démonstration pour les étapes du workflow
  const workflowSteps = [
    {
      id: 1,
      name: "Fiche client + documents",
      status: "complete", // complete, incomplete, in-progress, delivered, pending
      date: "10/01/2025",
      description: "Le client a rempli la fiche client et fourni tous les documents nécessaires.",
      documents: [
        { id: "doc1", name: "Fiche client", type: "PDF", uploadDate: "08/01/2025", status: "uploaded" },
        { id: "doc2", name: "Photos façade", type: "JPG", uploadDate: "09/01/2025", status: "uploaded" },
        { id: "doc3", name: "Plan cadastral", type: "PDF", uploadDate: "10/01/2025", status: "uploaded" }
      ]
    },
    {
      id: 2,
      name: "Analyse technique du dossier",
      status: "complete",
      date: "15/01/2025",
      description: "Analyse des contraintes PLU et faisabilité technique effectuée.",
      documents: [
        { id: "doc4", name: "Rapport d'analyse PLU", type: "PDF", uploadDate: "14/01/2025", status: "uploaded" },
        { id: "doc5", name: "Notes techniques", type: "PDF", uploadDate: "15/01/2025", status: "uploaded" }
      ]
    },
    {
      id: 3,
      name: "Conception du dossier avant-projet (APS)",
      status: "delivered",
      date: "22/01/2025",
      description: "Plans des façades fournis au client pour validation.",
      documents: [
        { id: "doc6", name: "Plans façades", type: "PDF", uploadDate: "20/01/2025", status: "uploaded" },
        { id: "doc7", name: "Vues 3D", type: "PDF", uploadDate: "21/01/2025", status: "uploaded" }
      ]
    },
    {
      id: 4,
      name: "Demande de modification client",
      status: "delivered",
      date: "28/01/2025",
      modifications: 2,
      description: "Le client a demandé des modifications sur les plans présentés.",
      documents: [
        { id: "doc8", name: "Demande de modification écrite", type: "PDF", uploadDate: "26/01/2025", status: "uploaded" },
        { id: "doc9", name: "Croquis explicatifs", type: "JPG", uploadDate: "27/01/2025", status: "uploaded" }
      ]
    },
    {
      id: 5,
      name: "Conception du dossier final",
      status: "complete",
      date: "10/02/2025",
      description: "Dossier finalisé avec intégration des demandes client.",
      documents: [
        { id: "doc10", name: "Plans finaux", type: "PDF", uploadDate: "08/02/2025", status: "uploaded" },
        { id: "doc11", name: "Notice descriptive", type: "PDF", uploadDate: "09/02/2025", status: "uploaded" }
      ]
    },
    {
      id: 6,
      name: "Dossier à déposer en mairie",
      status: "delivered",
      date: "20/02/2025",
      description: "Dossier déposé en mairie sous le numéro DP 91377 25 00042.",
      documents: [
        { id: "doc12", name: "Récépissé dépôt", type: "PDF", uploadDate: "20/02/2025", status: "uploaded" },
        { id: "doc13", name: "Dossier complet DP", type: "PDF", uploadDate: "18/02/2025", status: "uploaded" }
      ]
    },
    {
      id: 7,
      name: "Demande de modification mairie",
      status: "in-progress",
      date: "28/04/2025",
      modifications: 3,
      description: "La mairie a demandé des compléments sur le dossier.",
      documents: [
        { id: "doc14", name: "Courrier mairie", type: "PDF", uploadDate: "28/04/2025", status: "uploaded" },
        { id: "doc15", name: "Formulaire complémentaire", type: "PDF", uploadDate: null, status: "required" }
      ]
    },
    {
      id: 8,
      name: "Dossier à déposer en mairie (modificatif)",
      status: "pending",
      plannedDate: "28/05/2025",
      description: "Nouveau dépôt à prévoir suite aux demandes de la mairie.",
      documents: [
        { id: "doc16", name: "Dossier modificatif", type: "PDF", uploadDate: null, status: "pending" }
      ]
    },
    {
      id: 9,
      name: "Décision finale mairie sur l'autorisation",
      status: "pending",
      plannedDate: "28/07/2025",
      description: "En attente de la décision finale sur l'autorisation.",
      documents: []
    }
  ];
  
  // Données de démonstration pour les tâches
  const tasks = [
    {
      id: 1,
      title: "Compléter notice paysagère",
      description: "Suite à la demande de la mairie, créer une notice paysagère détaillée",
      status: "in-progress",
      assignedTo: "David",
      dueDate: "15/05/2025",
      relatedStep: 7,
      priority: "high"
    },
    {
      id: 2,
      title: "Ajuster les RAL des couleurs",
      description: "Modifier les références RAL pour les menuiseries selon demande mairie",
      status: "in-progress",
      assignedTo: "Sophie",
      dueDate: "12/05/2025",
      relatedStep: 7,
      priority: "medium"
    },
    {
      id: 3,
      title: "Obtenir validation client sur modificatifs",
      description: "Envoyer le dossier modificatif au client pour validation finale",
      status: "waiting",
      assignedTo: "David",
      dueDate: "20/05/2025",
      relatedStep: 8,
      priority: "medium"
    },
    {
      id: 4,
      title: "Préparer dossier complet pour nouveau dépôt",
      description: "Assembler toutes les pièces pour le dépôt modificatif en mairie",
      status: "pending",
      assignedTo: "Sophie",
      dueDate: "25/05/2025",
      relatedStep: 8,
      priority: "high"
    },
    {
      id: 5,
      title: "Vérifier conformité PLU des modifications",
      description: "S'assurer que les modifications respectent le PLU de la commune",
      status: "completed",
      assignedTo: "David",
      dueDate: "05/05/2025",
      relatedStep: 7,
      priority: "high"
    }
  ];
  
  // Obtenir les tâches filtrées
  const getFilteredTasks = () => {
    if (filterStatus === 'all') return tasks;
    return tasks.filter(task => task.status === filterStatus);
  };
  
  // Compter les tâches par statut
  const taskCounts = {
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    'waiting': tasks.filter(t => t.status === 'waiting').length,
    'completed': tasks.filter(t => t.status === 'completed').length,
    'assignedToMe': tasks.filter(t => t.assignedTo === 'David').length
  };
  
  // Fonction pour obtenir le style en fonction du statut
  const getStatusStyle = (status) => {
    switch(status) {
      case "complete":
        return { color: "#10b981", bgColor: "#ecfdf5", icon: <CheckCircle size={20} /> };
      case "incomplete":
        return { color: "#f59e0b", bgColor: "#fffbeb", icon: <AlertCircle size={20} /> };
      case "in-progress":
        return { color: "#3b82f6", bgColor: "#eff6ff", icon: <Clock size={20} /> };
      case "delivered":
        return { color: "#6366f1", bgColor: "#eef2ff", icon: <Check size={20} /> };
      case "pending":
        return { color: "#64748b", bgColor: "#f8fafc", icon: <Clock size={20} /> };
      case "waiting":
        return { color: "#f97316", bgColor: "#fff7ed", icon: <Clock size={20} /> };
      case "completed":
        return { color: "#10b981", bgColor: "#ecfdf5", icon: <CheckCircle size={20} /> };
      case "urgent":
        return { color: "#ef4444", bgColor: "#fee2e2", icon: <AlertCircle size={20} /> };
      default:
        return { color: "#64748b", bgColor: "#f8fafc", icon: <Clock size={20} /> };
    }
  };
  
  // Fonction pour obtenir le style du document en fonction du statut
  const getDocumentStatusStyle = (status) => {
    switch(status) {
      case "uploaded":
        return { color: "#10b981", bgColor: "#ecfdf5", text: "Déposé" };
      case "required":
        return { color: "#ef4444", bgColor: "#fee2e2", text: "Requis" };
      case "pending":
        return { color: "#f97316", bgColor: "#fff7ed", text: "À déposer" };
      default:
        return { color: "#64748b", bgColor: "#f8fafc", text: "Inconnu" };
    }
  };

  // Composant pour le modal de document
  const DocumentModal = ({ show, onClose, document }) => {
    if (!show || !document) return null;
    
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              margin: 0
            }}>
              {document.name}
            </h3>
            <button 
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              <X size={20} />
            </button>
          </div>
          
          <div style={{
            marginBottom: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <FileText size={16} color="#64748b" />
              <span style={{ fontSize: '14px' }}>Type: {document.type}</span>
            </div>
            
            {document.uploadDate && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <Calendar size={16} color="#64748b" />
                <span style={{ fontSize: '14px' }}>Date d'ajout: {document.uploadDate}</span>
              </div>
            )}
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                backgroundColor: getDocumentStatusStyle(document.status).bgColor,
                color: getDocumentStatusStyle(document.status).color
              }}>
                {getDocumentStatusStyle(document.status).text}
              </div>
            </div>
          </div>
          
          {document.status === 'uploaded' ? (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <button style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                backgroundColor: '#f1f5f9',
                border: 'none',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}>
                <Eye size={16} />
                <span>Visualiser</span>
              </button>
              
              <button style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                backgroundColor: '#3b82f6',
                border: 'none',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}>
                <Download size={16} />
                <span>Télécharger</span>
              </button>
            </div>
          ) : (
            <button style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              backgroundColor: '#3b82f6',
              border: 'none',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}>
              <Upload size={16} />
              <span>Déposer ce document</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      fontFamily: 'Inter, system-ui, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      {/* Entête */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#0f172a',
          margin: 0
        }}>
          Suivi du Dossier - Projet Dupont Jean
        </h1>
        
        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0 16px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            width: '240px',
            border: '1px solid #e2e8f0',
            height: '40px'
          }}>
            <Search size={16} color="#64748b" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '14px'
              }}
            />
          </div>
          
          <button style={{
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0 16px',
            height: '40px',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}>
            <PlusCircle size={16} />
            <span>Nouveau dossier</span>
          </button>
        </div>
      </div>
      
      {/* Informations dossier */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#0f172a',
              margin: '0 0 4px 0'
            }}>
              Dupont Jean - DP FENETRE
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              margin: 0
            }}>
              Référence: DP-2025-042 | 123 Rue Principale, 91300 Massy
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#0f172a'
            }}>
              Progression:
            </span>
            <div style={{
              width: '150px',
              height: '8px',
              backgroundColor: '#e2e8f0',
              borderRadius: '4px'
            }}>
              <div style={{
                width: '50%',
                height: '100%',
                backgroundColor: '#3b82f6',
                borderRadius: '4px'
              }}></div>
            </div>
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#3b82f6'
            }}>
              50%
            </span>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Calendar size={16} color="#64748b" />
            <span style={{
              fontSize: '14px',
              color: '#0f172a'
            }}>
              Créé le: 05/01/2025
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FileText size={16} color="#64748b" />
            <span style={{
              fontSize: '14px',
              color: '#0f172a'
            }}>
              Type: DP FENETRE
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              display: 'inline-block',
              padding: '2px 10px',
              backgroundColor: '#eff6ff',
              color: '#3b82f6',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              En cours
            </div>
          </div>
        </div>
      </div>
      
      {/* Onglets */}
      <div style={{
        display: 'flex',
        backgroundColor: '#fff',
        padding: '4px',
        borderRadius: '8px',
        marginBottom: '24px',
        border: '1px solid #e2e8f0',
        maxWidth: '400px'
      }}>
        <button
          style={{
            flex: 1,
            padding: '8px 16px',
            backgroundColor: activeTab === 'workflow' ? '#3b82f6' : 'transparent',
            color: activeTab === 'workflow' ? '#fff' : '#64748b',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onClick={() => setActiveTab('workflow')}
        >
          <FileText size={16} />
          <span>Workflow & Documents</span>
        </button>
        <button
          style={{
            flex: 1,
            padding: '8px 16px',
            backgroundColor: activeTab === 'tasks' ? '#3b82f6' : 'transparent',
            color: activeTab === 'tasks' ? '#fff' : '#64748b',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onClick={() => setActiveTab('tasks')}
        >
          <CheckSquare size={16} />
          <span>Tâches</span>
        </button>
      </div>
      
      {/* Contenu principal basé sur l'onglet actif */}
      {activeTab === 'workflow' ? (
        /* Timeline du workflow */
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#0f172a',
            margin: '0 0 24px 0'
          }}>
            Timeline de progression
          </h2>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            paddingLeft: '32px'
          }}>
            {/* Ligne verticale */}
            <div style={{
              position: 'absolute',
              left: '15px',
              top: '12px',
              bottom: '12px',
              width: '2px',
              backgroundColor: '#e2e8f0',
              zIndex: 1
            }}></div>
            
            {/* Étapes du workflow - Premier élément de démonstration */}
            <div style={{
              marginBottom: '20px',
              position: 'relative'
            }}>
              {/* Point de la timeline */}
              <div style={{
                position: 'absolute',
                left: '-32px',
                top: '4px',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#fff',
                border: '2px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981',
                zIndex: 2
              }}>
                <CheckCircle size={16} />
              </div>
              
              {/* Contenu de l'étape */}
              <div style={{
                backgroundColor: '#ecfdf5',
                borderRadius: '8px',
                padding: '16px',
                border: '1px solid #ecfdf5',
                cursor: 'pointer'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#0f172a',
                      margin: '0 0 4px 0'
                    }}>
                      Fiche client + documents
                    </h3>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <CheckCircle size={14} />
                        <span>Complet</span>
                      </div>
                      
                      <div style={{
                        fontSize: '13px',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Calendar size={14} />
                        10/01/2025
                      </div>
                      
                      <div style={{
                        fontSize: '13px',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Paperclip size={14} />
                        3 documents
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <ChevronRight size={20} color="#64748b" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Étape active avec détails ouverts */}
            <div style={{
              marginBottom: '20px',
              position: 'relative'
            }}>
              {/* Point de la timeline */}
              <div style={{
                position: 'absolute',
                left: '-32px',
                top: '4px',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#fff',
                border: '2px solid #3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6',
                zIndex: 2
              }}>
                <Clock size={16} />
              </div>
              
              {/* Contenu de l'étape */}
              <div style={{
                backgroundColor: '#eff6ff',
                borderRadius: '8px',
                padding: '16px',
                border: '1px solid #eff6ff',
                cursor: 'pointer'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#0f172a',
                      margin: '0 0 4px 0'
                    }}>
                      Demande de modification mairie
                    </h3>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Clock size={14} />
                        <span>En cours</span>
                      </div>
                      
                      <div style={{
                        fontSize: '13px',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Calendar size={14} />
                        28/04/2025
                      </div>
                      
                      <div style={{
                        fontSize: '13px',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <MessageSquare size={14} />
                        3 modifications
                      </div>
                      
                      <div style={{
                        fontSize: '13px',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Paperclip size={14} />
                        2 documents
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <button style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      backgroundColor: '#ecfdf5',
                      color: '#10b981',
                      border: '1px solid #d1fae5',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>
                      <CheckCircle size={14} />
                      <span>Terminer</span>
                    </button>
                    <ChevronDown size={20} color="#64748b" />
                  </div>
                </div>
                
                {/* Détails de l'étape (visible car active) */}
                <div style={{
                  marginTop: '16px',
                  padding: '16px',
                  backgroundColor: '#fff',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}>
                    <p style={{
                      fontSize: '14px',
                      color: '#4b5563',
                      margin: '0'
                    }}>
                      La mairie a demandé des compléments sur le dossier. Il est nécessaire de fournir des précisions sur le traitement des menuiseries, une notice paysagère complémentaire et d'ajuster les références RAL des couleurs.
                    </p>
                    
                    {/* Documents associés à l'étape */}
                    <div style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px',
                      padding: '12px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <h4 style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#0f172a',
                        margin: '0 0 8px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <Paperclip size={14} color="#3b82f6" />
                        Documents associés
                      </h4>
                      
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                        gap: '8px'
                      }}>
                        <div 
                          style={{
                            backgroundColor: '#fff',
                            padding: '8px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            setActiveDocument(workflowSteps[6].documents[0]);
                            setShowDocumentModal(true);
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '4px'
                          }}>
                            <FileText size={14} color="#3b82f6" />
                            <span style={{
                              fontSize: '13px',
                              fontWeight: '500',
                              color: '#1e293b',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              Courrier mairie
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span style={{
                              fontSize: '12px',
                              color: '#64748b'
                            }}>
                              PDF
                            </span>
                            <span style={{
                              fontSize: '11px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: '#ecfdf5',
                              color: '#10b981'
                            }}>
                              Déposé
                            </span>
                          </div>
                        </div>
                        
                        <div 
                          style={{
                            backgroundColor: '#fff',
                            padding: '8px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            setActiveDocument(workflowSteps[6].documents[1]);
                            setShowDocumentModal(true);
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '4px'
                          }}>
                            <FileText size={14} color="#3b82f6" />
                            <span style={{
                              fontSize: '13px',
                              fontWeight: '500',
                              color: '#1e293b',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              Formulaire complémentaire
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span style={{
                              fontSize: '12px',
                              color: '#64748b'
                            }}>
                              PDF
                            </span>
                            <span style={{
                              fontSize: '11px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: '#fee2e2',
                              color: '#ef4444'
                            }}>
                              Requis
                            </span>
                          </div>
                        </div>
                        
                        {/* Bouton pour ajouter un document */}
                        <div style={{
                          backgroundColor: '#f1f5f9',
                          padding: '8px',
                          borderRadius: '6px',
                          border: '1px dashed #cbd5e1',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          minHeight: '62px'
                        }}>
                          <PlusCircle size={16} color="#64748b" />
                          <span style={{
                            fontSize: '13px',
                            color: '#64748b'
                          }}>
                            Ajouter un document
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px',
                      padding: '12px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <h4 style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#0f172a',
                        margin: '0 0 8px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <MessageSquare size={14} color="#8b5cf6" />
                        Demandes de modifications (3)
                      </h4>
                      
                      <ul style={{
                        margin: '0',
                        paddingLeft: '20px'
                      }}>
                        <li style={{
                          fontSize: '13px',
                          color: '#4b5563',
                          marginBottom: '4px'
                        }}>
                          Modification 1: Préciser traitement des menuiseries
                        </li>
                        <li style={{
                          fontSize: '13px',
                          color: '#4b5563',
                          marginBottom: '4px'
                        }}>
                          Modification 2: Fournir notice paysagère complémentaire
                        </li>
                        <li style={{
                          fontSize: '13px',
                          color: '#4b5563',
                          marginBottom: '4px'
                        }}>
                          Modification 3: Ajuster les RAL des couleurs
                        </li>
                      </ul>
                    </div>
                    
                    {/* Tâches associées à cette étape */}
                    <div style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px',
                      padding: '12px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <h4 style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#0f172a',
                        margin: '0 0 8px 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <CheckSquare size={14} color="#3b82f6" />
                          Tâches associées
                        </div>
                        <button 
                          onClick={() => setActiveTab('tasks')}
                          style={{
                            fontSize: '12px',
                            color: '#3b82f6',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span>Voir toutes les tâches</span>
                          <ArrowRight size={12} />
                        </button>
                      </h4>
                      
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        <div style={{
                          backgroundColor: '#fff',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <input
                              type="checkbox"
                              style={{
                                width: '16px',
                                height: '16px',
                                accentColor: '#3b82f6'
                              }}
                            />
                            <span style={{
                              fontSize: '13px',
                              color: '#1e293b'
                            }}>
                              Compléter notice paysagère
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span style={{
                              fontSize: '12px',
                              color: '#64748b'
                            }}>
                              15/05/2025
                            </span>
                            <span style={{
                              fontSize: '11px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: '#eff6ff',
                              color: '#3b82f6'
                            }}>
                              En cours
                            </span>
                          </div>
                        </div>
                        
                        <div style={{
                          backgroundColor: '#fff',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <input
                              type="checkbox"
                              style={{
                                width: '16px',
                                height: '16px',
                                accentColor: '#3b82f6'
                              }}
                            />
                            <span style={{
                              fontSize: '13px',
                              color: '#1e293b'
                            }}>
                              Ajuster les RAL des couleurs
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span style={{
                              fontSize: '12px',
                              color: '#64748b'
                            }}>
                              12/05/2025
                            </span>
                            <span style={{
                              fontSize: '11px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: '#eff6ff',
                              color: '#3b82f6'
                            }}>
                              En cours
                            </span>
                          </div>
                        </div>
                        
                        <div style={{
                          backgroundColor: '#fff',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <input
                              type="checkbox"
                              checked={true}
                              readOnly
                              style={{
                                width: '16px',
                                height: '16px',
                                accentColor: '#3b82f6'
                              }}
                            />
                            <span style={{
                              fontSize: '13px',
                              color: '#1e293b',
                              textDecoration: 'line-through'
                            }}>
                              Vérifier conformité PLU des modifications
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span style={{
                              fontSize: '12px',
                              color: '#64748b'
                            }}>
                              05/05/2025
                            </span>
                            <span style={{
                              fontSize: '11px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: '#ecfdf5',
                              color: '#10b981'
                            }}>
                              Terminée
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '4px'
                    }}>
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        backgroundColor: '#f1f5f9',
                        color: '#64748b',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}>
                        <PlusCircle size={14} />
                        <span>Ajouter un document</span>
                      </button>
                      
                      <div style={{
                        display: 'flex',
                        gap: '8px'
                      }}>
                        <button style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          backgroundColor: '#eff6ff',
                          color: '#3b82f6',
                          border: '1px solid #bfdbfe',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}>
                          <MessageSquare size={14} />
                          <span>Ajouter un commentaire</span>
                        </button>
                        
                        <button style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          backgroundColor: '#eff6ff',
                          color: '#3b82f6',
                          border: '1px solid #bfdbfe',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}>
                          <CheckSquare size={14} />
                          <span>Créer une tâche</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Étape en attente */}
            <div style={{
              marginBottom: '20px',
              position: 'relative'
            }}>
              {/* Point de la timeline */}
              <div style={{
                position: 'absolute',
                left: '-32px',
                top: '4px',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#fff',
                border: '2px solid #64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                zIndex: 2
              }}>
                <Clock size={16} />
              </div>
              
              {/* Contenu de l'étape */}
              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                padding: '16px',
                border: '1px solid #f8fafc',
                cursor: 'pointer'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#0f172a',
                      margin: '0 0 4px 0'
                    }}>
                      Dossier à déposer en mairie (modificatif)
                    </h3>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Clock size={14} />
                        <span>En attente</span>
                      </div>
                      
                      <div style={{
                        fontSize: '13px',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Calendar size={14} />
                        Prévu: 28/05/2025
                      </div>
                      
                      <div style={{
                        fontSize: '13px',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Paperclip size={14} />
                        1 document
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <button style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      backgroundColor: '#fff',
                      color: '#3b82f6',
                      border: '1px solid #bfdbfe',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>
                      <Edit size={14} />
                      <span>Mettre à jour</span>
                    </button>
                    <ChevronRight size={20} color="#64748b" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Vue des tâches */
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#0f172a',
              margin: '0'
            }}>
              Gestion des tâches
            </h2>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: '#f1f5f9',
                borderRadius: '6px',
                width: '240px'
              }}>
                <Search size={16} color="#64748b" />
                <input
                  type="text"
                  placeholder="Rechercher une tâche..."
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    outline: 'none',
                    fontSize: '14px',
                    width: '100%',
                    color: '#1e293b'
                  }}
                />
              </div>
              
              <button style={{
                backgroundColor: '#3b82f6',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                <PlusCircle size={16} />
                <span>Nouvelle tâche</span>
              </button>
            </div>
          </div>
          
          {/* Cartes des métriques de tâche */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              backgroundColor: '#ebf5ff',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Clock size={20} />
              </div>
              <div>
                <div style={{
                  fontSize: '14px',
                  color: '#3b82f6',
                  fontWeight: '500'
                }}>
                  En cours
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1e40af'
                }}>
                  {taskCounts['in-progress']}
                </div>
              </div>
            </div>
            
            <div style={{
              backgroundColor: '#fff7ed',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#f97316',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Calendar size={20} />
              </div>
              <div>
                <div style={{
                  fontSize: '14px',
                  color: '#f97316',
                  fontWeight: '500'
                }}>
                  En attente
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#9a3412'
                }}>
                  {taskCounts['waiting']}
                </div>
              </div>
            </div>
            
            <div style={{
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <CheckSquare size={20} />
              </div>
              <div>
                <div style={{
                  fontSize: '14px',
                  color: '#22c55e',
                  fontWeight: '500'
                }}>
                  Terminées
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#166534'
                }}>
                  {taskCounts['completed']}
                </div>
              </div>
            </div>
            
            <div style={{
              backgroundColor: '#eff6ff',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <User size={20} />
              </div>
              <div>
                <div style={{
                  fontSize: '14px',
                  color: '#3b82f6',
                  fontWeight: '500'
                }}>
                  Assignées à moi
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1e40af'
                }}>
                  {taskCounts['assignedToMe']}
                </div>
              </div>
            </div>
          </div>
          
          {/* Filtres pour les tâches */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#4b5563',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Filter size={16} />
              <span>Filtrer:</span>
            </div>
            
            <button
              onClick={() => setFilterStatus('all')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: filterStatus === 'all' ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                backgroundColor: filterStatus === 'all' ? '#eff6ff' : '#fff',
                color: filterStatus === 'all' ? '#3b82f6' : '#64748b',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Toutes
            </button>
            
            <button
              onClick={() => setFilterStatus('in-progress')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: filterStatus === 'in-progress' ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                backgroundColor: filterStatus === 'in-progress' ? '#eff6ff' : '#fff',
                color: filterStatus === 'in-progress' ? '#3b82f6' : '#64748b',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              En cours
            </button>
            
            <button
              onClick={() => setFilterStatus('waiting')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: filterStatus === 'waiting' ? '1px solid #f97316' : '1px solid #e2e8f0',
                backgroundColor: filterStatus === 'waiting' ? '#fff7ed' : '#fff',
                color: filterStatus === 'waiting' ? '#f97316' : '#64748b',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              En attente
            </button>
            
            <button
              onClick={() => setFilterStatus('completed')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: filterStatus === 'completed' ? '1px solid #22c55e' : '1px solid #e2e8f0',
                backgroundColor: filterStatus === 'completed' ? '#f0fdf4' : '#fff',
                color: filterStatus === 'completed' ? '#22c55e' : '#64748b',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Terminées
            </button>
          </div>
          
          {/* Liste des tâches */}
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '40px 1fr 120px 120px 100px',
              padding: '12px 16px',
              borderBottom: '1px solid #e2e8f0',
              backgroundColor: '#f1f5f9'
            }}>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#475569'
              }}></div>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#475569'
              }}>Tâche</div>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#475569'
              }}>Assignée à</div>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#475569'
              }}>Échéance</div>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#475569'
              }}>Statut</div>
            </div>
            
            {/* Éléments de la liste de tâches */}
            {getFilteredTasks().map(task => {
              const taskStatusStyle = getStatusStyle(task.status);
              
              return (
                <div 
                  key={task.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr 120px 120px 100px',
                    padding: '12px 16px',
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: '#fff',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      readOnly
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: '#3b82f6'
                      }}
                    />
                  </div>
                  <div>
                    <div style={{
                      fontSize: '14px',
                      color: '#0f172a',
                      fontWeight: '500',
                      marginBottom: '2px',
                      textDecoration: task.status === 'completed' ? 'line-through' : 'none'
                    }}>
                      {task.title}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#64748b'
                    }}>
                      {task.description}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#475569'
                  }}>
                    {task.assignedTo}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#475569'
                  }}>
                    {task.dueDate}
                  </div>
                  <div>
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: taskStatusStyle.bgColor,
                      color: taskStatusStyle.color
                    }}>
                      {task.status === 'in-progress' ? 'En cours' : 
                       task.status === 'waiting' ? 'En attente' : 
                       task.status === 'completed' ? 'Terminée' : 
                       task.status === 'urgent' ? 'Urgent' : 
                       'À faire'}
                    </span>
                  </div>
                </div>
              );
            })}
            
            {getFilteredTasks().length === 0 && (
              <div style={{
                padding: '24px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '14px',
                  color: '#64748b'
                }}>
                  Aucune tâche ne correspond à ce filtre
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Modal pour les documents */}
      <DocumentModal
        show={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        document={activeDocument}
      />
    </div>
  );
};

export default WorkflowTachesUnified;