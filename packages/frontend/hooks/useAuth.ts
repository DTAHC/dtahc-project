import { useState, useEffect, useCallback } from 'react';
import { login, logout, isAuthenticated, getCurrentUser, User, hasPermission as checkPermission, refreshToken } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import { localStorageService } from '@/lib/utils/localStorage';

export interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Optimisation avec useCallback pour éviter les recréations de fonction
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      // Vérifier si l'authentification est encore valide
      if (isAuthenticated()) {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        
        // Vérifier si le token est en cache
        const cachedUser = localStorageService.get('current_user');
        if (!cachedUser) {
          // Si pas en cache, stocker pour 1 heure
          localStorageService.set('current_user', currentUser, 60 * 60 * 1000);
        }
      } else {
        // Essayer de récupérer depuis le cache
        const cachedUser = localStorageService.get('current_user');
        if (cachedUser) {
          // Tenter un refresh token si disponible
          try {
            const refreshed = await refreshToken();
            if (refreshed) {
              const freshUser = getCurrentUser();
              setUser(freshUser);
              localStorageService.set('current_user', freshUser, 60 * 60 * 1000);
            } else {
              // Si impossible à rafraîchir, nettoyer le cache
              localStorageService.remove('current_user');
              setUser(null);
            }
          } catch (error) {
            console.error('Erreur lors du rafraîchissement du token:', error);
            localStorageService.remove('current_user');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification d\'authentification:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    
    // Rafraîchir périodiquement la session si connecté
    const intervalId = setInterval(() => {
      if (isAuthenticated()) {
        checkAuth();
      }
    }, 15 * 60 * 1000); // Vérifier toutes les 15 minutes
    
    return () => clearInterval(intervalId);
  }, [checkAuth]);

  const handleLogin = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await login(email, password);
      setUser(response.user);
      
      // Stocker en cache pour optimiser les rechargements
      localStorageService.set('current_user', response.user, 60 * 60 * 1000); // 1 heure
      
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
      
      // Nettoyer le cache utilisateur
      localStorageService.remove('current_user');
      
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    return checkPermission(permission);
  }, [user]);

  return {
    user,
    isLoading: loading,
    isAuthenticated: !!user,
    login: handleLogin,
    logout: handleLogout,
    hasPermission,
  };
}

export default useAuth;