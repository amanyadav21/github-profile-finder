
import React, { createContext, useContext, useState, useEffect } from 'react';
import { FavoriteUser } from '../types/GitHubUser';
import { toast } from '@/components/ui/use-toast';

interface FavoritesContextType {
  favorites: FavoriteUser[];
  addFavorite: (user: FavoriteUser) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  reorderFavorites: (newOrder: FavoriteUser[]) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteUser[]>([]);

  useEffect(() => {
    // Load favorites from localStorage on initial load
    const storedFavorites = localStorage.getItem('github-favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Error parsing favorites from localStorage', error);
        localStorage.removeItem('github-favorites');
      }
    }
  }, []);

  const addFavorite = (user: FavoriteUser) => {
    setFavorites((prev) => {
      const newFavorites = [...prev, user];
      // Save to localStorage
      localStorage.setItem('github-favorites', JSON.stringify(newFavorites));
      toast({
        title: 'Added to favorites',
        description: `${user.name || user.login} has been added to your favorites.`,
      });
      return newFavorites;
    });
  };

  const removeFavorite = (id: number) => {
    setFavorites((prev) => {
      const userToRemove = prev.find(user => user.id === id);
      const newFavorites = prev.filter((user) => user.id !== id);
      // Save to localStorage
      localStorage.setItem('github-favorites', JSON.stringify(newFavorites));
      if (userToRemove) {
        toast({
          title: 'Removed from favorites',
          description: `${userToRemove.name || userToRemove.login} has been removed from your favorites.`,
        });
      }
      return newFavorites;
    });
  };

  const isFavorite = (id: number) => {
    return favorites.some((user) => user.id === id);
  };

  const reorderFavorites = (newOrder: FavoriteUser[]) => {
    setFavorites(newOrder);
    localStorage.setItem('github-favorites', JSON.stringify(newOrder));
  };

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    reorderFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
