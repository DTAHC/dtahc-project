import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <div className="max-w-5xl w-full text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          DTAHC - Gestion des autorisations de travaux
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Plateforme centralisée pour la gestion complète des dossiers d'autorisations de travaux
        </p>
        
        <div className="flex flex-col items-center justify-center gap-4">
          <Link 
            href="/auth/login" 
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors w-full max-w-xs"
          >
            Connexion
          </Link>
          <p className="text-gray-500 text-sm mt-4">
            Accédez à votre tableau de bord pour gérer vos dossiers, clients et autorisations
          </p>
        </div>
        
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-center mb-3">Gestion des clients</h2>
            <p className="text-gray-600 text-center">
              Gestion centralisée des clients avec formulaires auto-remplissables et suivi en temps réel
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-center mb-3">Dossiers complets</h2>
            <p className="text-gray-600 text-center">
              Suivi de A à Z des dossiers d'autorisation avec workflow configurable et états intermédiaires
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-center mb-3">Documents cadastraux</h2>
            <p className="text-gray-600 text-center">
              Récupération automatique des cadastres, PLU et génération des CERFA pré-remplis
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}