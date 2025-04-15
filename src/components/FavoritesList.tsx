
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useFavorites } from '../context/FavoritesContext';
import { Heart, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const FavoritesList: React.FC = () => {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Favorite Users
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto max-h-[calc(100vh-10rem)]">
        {favorites.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Heart className="h-12 w-12 mx-auto mb-3 stroke-1" />
            <p>No favorites yet</p>
            <p className="text-sm mt-1">Search for GitHub users and add them to your favorites</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {favorites.map((user) => (
              <li key={user.id} className={cn("bg-secondary/30 rounded-lg p-3 favorite-animation")}>
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar_url}
                    alt={`${user.login}'s avatar`}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{user.name || user.login}</h3>
                    <p className="text-sm text-gray-500 truncate">@{user.login}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a 
                      href={user.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-accent"
                      aria-label="View on GitHub"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-red-500"
                      onClick={() => removeFavorite(user.id)}
                      aria-label="Remove from favorites"
                    >
                      <Heart className="h-5 w-5 fill-red-500" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoritesList;
