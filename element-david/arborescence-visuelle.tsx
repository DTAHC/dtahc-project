import React from 'react';
import { ChevronRight, User, FileText, Home, Database, Settings, Mail, DollarSign, Users, Calendar, File, BarChart2, CheckSquare, Clock } from 'lucide-react';

const ArborescenceVisuelle = () => {
  return (
    <div style={{
      fontFamily: 'Inter, system-ui, sans-serif',
      backgroundColor: '#f8fafc',
      padding: '40px',
      maxWidth: '1200px',
      margin: '0 auto',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0'
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: '600',
        color: '#0f172a',
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        Arborescence Visuelle - Application DTAHC
      </h1>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '140px',
            height: '60px',
            backgroundColor: '#3b82f6',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
            fontWeight: '600',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            gap: '8px'
          }}>
            <Home size={20} />
            <span>Page d'accueil</span>
          </div>
          <div style={{
            height: '15px',
            width: '2px',
            backgroundColor: '#cbd5e1'
          }}></div>
          <div style={{
            width: '140px',
            height: '60px',
            backgroundColor: '#0369a1',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '14px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            gap: '6px'
          }}>
            <User size={18} />
            <span>Connexion</span>
          </div>
        </div>
      </div>
      
      {/* Modules principaux */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '15px',
        marginBottom: '30px'
      }}>
        {[
          { icon: <Home size={20} />, title: 'Tableau de Bord', color: '#4f46e5', id: 'dashboard' },
          { icon: <Users size={20} />, title: 'Gestion Clients', color: '#10b981', id: 'clients' },
          { icon: <DollarSign size={20} />, title: 'Gestion Comptable', color: '#f59e0b', id: 'accounting' },
          { icon: <Settings size={20} />, title: 'Administration', color: '#6366f1', id: 'admin' },
          { icon: <Mail size={20} />, title: 'Modèles Communication', color: '#ec4899', id: 'templates' }
        ].map((module) => (
          <div key={module.id} style={{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '140px',
              height: '60px',
              backgroundColor: module.color,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              fontWeight: '600',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              gap: '8px',
              fontSize: '14px',
              textAlign: 'center',
              padding: '5px'
            }}>
              {module.icon}
              <span>{module.title}</span>
            </div>
            <div style={{
              height: '20px',
              width: '2px',
              backgroundColor: '#cbd5e1'
            }}></div>
          </div>
        ))}
      </div>
      
      {/* Sous-modules du Tableau de Bord */}
      <div style={{
        marginBottom: '40px'
      }}>
        <div style={{
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          backgroundColor: '#f1f5f9'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#4f46e5',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Home size={18} />
            Tableau de Bord
          </h2>
          
          <div style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              flex: '1 1 300px',
              backgroundColor: '#ffffff',
              borderRadius: '6px',
              padding: '12px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#111827',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <BarChart2 size={16} />
                Liste des dossiers
              </h3>
              
              <ul style={{
                marginLeft: '20px',
                fontSize: '14px',
                color: '#4b5563'
              }}>
                <li style={{marginBottom: '6px'}}>Vue d'ensemble</li>
                <li style={{marginBottom: '6px'}}>Filtres et recherche</li>
                <li style={{marginBottom: '6px'}}>Métriques d'avancement</li>
              </ul>
            </div>
            
            <div style={{
              flex: '1 1 300px',
              backgroundColor: '#ffffff',
              borderRadius: '6px',
              padding: '12px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#111827',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <FileText size={16} />
                Détail d'un dossier
              </h3>
              
              <ul style={{
                marginLeft: '20px',
                fontSize: '14px',
                color: '#4b5563'
              }}>
                <li style={{marginBottom: '6px'}}>Informations générales</li>
                <li style={{marginBottom: '6px'}}>Timeline de progression</li>
                <li style={{marginBottom: '6px'}}>Gestion des tâches</li>
                <li style={{marginBottom: '6px'}}>Documents associés</li>
              </ul>
            </div>
            
            <div style={{
              flex: '1 1 300px',
              backgroundColor: '#ffffff',
              borderRadius: '6px',
              padding: '12px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#111827',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <CheckSquare size={16} />
                Suivi et notifications
              </h3>
              
              <ul style={{
                marginLeft: '20px',
                fontSize: '14px',
                color: '#4b5563'
              }}>
                <li style={{marginBottom: '6px'}}>Centre de notifications</li>
                <li style={{marginBottom: '6px'}}>Alertes d'échéances</li>
                <li style={{marginBottom: '6px'}}>Tâches en attente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sous-modules de Gestion Clients */}
      <div style={{
        marginBottom: '40px'
      }}>
        <div style={{
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          backgroundColor: '#f1f5f9'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#10b981',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Users size={18} />
            Gestion Clients
          </h2>
          
          <div style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              flex: '1 1 250px',
              backgroundColor: '#ffffff',
              borderRadius: '6px',
              padding: '12px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#111827',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Users size={16} />
                Liste des clients
              </h3>
              
              <ul style={{
                marginLeft: '20px',
                fontSize: '14px',
                color: '#4b5563'
              }}>
                <li style={{marginBottom: '6px'}}>Tableau clients</li>
                <li style={{marginBottom: '6px'}}>Filtres et recherche</li>
                <li style={{marginBottom: '6px'}}>Exportation</li>
              </ul>
            </div>
            
            <div style={{
              flex: '1 1 250px',
              backgroundColor: '#ffffff',
              borderRadius: '6px',
              padding: '12px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#111827',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <User size={16} />
                Création client
              </h3>
              
              <ul style={{
                marginLeft: '20px',
                fontSize: '14px',
                color: '#4b5563'
              }}>
                <li style={{marginBottom: '6px'}}>Formulaire initial</li>
                <li style={{marginBottom: '6px'}}>Lien auto-remplissage</li>
                <li style={{marginBottom: '6px'}}>Type de client (Pro/Part.)</li>
              </ul>
            </div>
            
            <div style={{
              flex: '1 1 250px',
              backgroundColor: '#ffffff',
              borderRadius: '6px',
              padding: '12px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#111827',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <File size={16} />
                Fiche client
              </h3>
              
              <ul style={{
                marginLeft: '20px',
                fontSize: '14px',
                color: '#4b5563'
              }}>
                <li style={{marginBottom: '6px'}}>Informations client</li>
                <li style={{marginBottom: '6px'}}>Documents client</li>
                <li style={{marginBottom: '6px'}}>Projets associés</li>
              </ul>
            </div>
            
            <div style={{
              flex: '1 1 250px',
              backgroundColor: '#ffffff',
              borderRadius: '6px',
              padding: '12px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#111827',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <FileText size={16} />
                Formulaires
              </h3>
              
              <ul style={{
                marginLeft: '20px',
                fontSize: '14px',
                color: '#4b5563'
              }}>
                <li style={{marginBottom: '6px'}}>CERFA pré-rempli</li>
                <li style={{marginBottom: '6px'}}>Documents cadastraux</li>
                <li style={{marginBottom: '6px'}}>Documents PLU</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sous-modules de Gestion Comptable */}
      <div style={{
        marginBottom: '40px'
      }}>
        <div style={{
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          backgroundColor: '#f1f5f9'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#f59e0b',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <DollarSign size={18} />
            Gestion Comptable
          </h2>
          
          <div style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              flex: '1 1 300px',
              backgroundColor: '#ffffff',
              borderRadius: '6px',
              padding: '12px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#111827',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <BarChart2 size={16} />
                Tableau comptabilité
              </h3>
              
              <ul style={{
                marginLeft: '20px',
                fontSize: '14px',
                color: '#4b5563'
              }}>
                <li style={{marginBottom: '6px'}}>Vue globale</li>
                <li style={{marginBottom: '6px'}}>Facturation Pro</li>
                <li style={{marginBottom: '6px'}}>Paiements</li>
                <li style={{marginBottom: '6px'}}>Statistiques</li>
              </ul>
            </div>
            
            <div style={{
              flex: '1 1 300px',
              backgroundColor: '#ffffff',
              borderRadius: '6px',
              padding: '12px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#111827',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <FileText size={16} />
                Documents financiers
              </h3>
              
              <ul style={{
                marginLeft: '20px',
                fontSize: '14px',
                color: '#4b5563'
              }}>
                <li style={{marginBottom: '6px'}}>Générateur de devis</li>
                <li style={{marginBottom: '6px'}}>Générateur de facture</li>
                <li style={{marginBottom: '6px'}}>Suivi des paiements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Légende */}
      <div style={{
        marginTop: '40px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#0f172a',
          marginBottom: '12px'
        }}>Légende des profils d'accès</h3>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f1f5f9',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#10b981',
              borderRadius: '50%'
            }}></div>
            <span>Admin (Tous accès)</span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f1f5f9',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#f59e0b',
              borderRadius: '50%'
            }}></div>
            <span>Comptable</span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f1f5f9',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#3b82f6',
              borderRadius: '50%'
            }}></div>
            <span>Gestion</span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f1f5f9',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#6366f1',
              borderRadius: '50%'
            }}></div>
            <span>Production</span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f1f5f9',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#ec4899',
              borderRadius: '50%'
            }}></div>
            <span>Client Pro (Vue limitée)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArborescenceVisuelle;