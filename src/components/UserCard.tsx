
import React from 'react';
import { GitHubUser, FavoriteUser } from '../types/GitHubUser';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { cn } from '@/lib/utils';

interface UserCardProps {
  user: GitHubUser;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(user.id);

  const handleFavoriteToggle = () => {
    if (favorited) {
      removeFavorite(user.id);
    } else {
      const favoriteUser: FavoriteUser = {
        id: user.id,
        login: user.login,
        avatar_url: user.avatar_url,
        html_url: user.html_url,
        name: user.name,
      };
      addFavorite(favoriteUser);
    }
  };

  return (
    <Card className="w-full overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="relative p-4 pb-0">
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "favorite-transition",
              favorited ? "text-red-500 hover:text-red-400" : "text-gray-400 hover:text-gray-500"
            )}
            onClick={handleFavoriteToggle}
            aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={cn(favorited ? "fill-red-500" : "")} />
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <img
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
            className="rounded-full h-16 w-16 object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">{user.name || user.login}</h2>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              @{user.login}
            </a>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {user.bio && (
            <p className="text-gray-600 text-sm">{user.bio}</p>
          )}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-secondary/50 rounded p-2">
              <div className="text-lg font-semibold">{user.public_repos}</div>
              <div className="text-xs text-gray-500">Repositories</div>
            </div>
            <div className="bg-secondary/50 rounded p-2">
              <div className="text-lg font-semibold">{user.followers}</div>
              <div className="text-xs text-gray-500">Followers</div>
            </div>
            <div className="bg-secondary/50 rounded p-2">
              <div className="text-lg font-semibold">{user.following}</div>
              <div className="text-xs text-gray-500">Following</div>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            asChild
          >
            <a href={user.html_url} target="_blank" rel="noopener noreferrer">
              View GitHub Profile
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
