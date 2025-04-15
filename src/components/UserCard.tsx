
import React from 'react';
import { GitHubUser, FavoriteUser } from '../types/GitHubUser';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Heart, MapPin, Calendar, LinkIcon, Users, Book, Building } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

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
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="relative p-6 pb-4">
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
            <Heart className={cn("h-5 w-5", favorited ? "fill-current" : "")} />
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4">
          <img
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
            className="rounded-full h-24 w-24 ring-2 ring-background shadow-md object-cover"
          />
          <div>
            <h2 className="text-xl font-bold mt-2 sm:mt-0">{user.name || user.login}</h2>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline inline-flex items-center gap-1 text-sm"
            >
              @{user.login}
            </a>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        {user.bio && (
          <p className="text-muted-foreground text-sm border-b pb-4">{user.bio}</p>
        )}
        
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-accent/5 rounded-lg p-3">
            <div className="text-xl font-bold text-accent">{user.public_repos}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Book className="h-3 w-3" /> Repos
            </div>
          </div>
          <div className="bg-accent/5 rounded-lg p-3">
            <div className="text-xl font-bold text-accent">{user.followers}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Users className="h-3 w-3" /> Followers
            </div>
          </div>
          <div className="bg-accent/5 rounded-lg p-3">
            <div className="text-xl font-bold text-accent">{user.following}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Users className="h-3 w-3" /> Following
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {user.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{user.location}</span>
            </div>
          )}
          {user.company && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building className="h-4 w-4 shrink-0" />
              <span className="truncate">{user.company}</span>
            </div>
          )}
          {user.blog && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <LinkIcon className="h-4 w-4 shrink-0" />
              <a
                href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent truncate"
              >
                {user.blog}
              </a>
            </div>
          )}
          {user.created_at && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>Joined {format(new Date(user.created_at), 'MMM yyyy')}</span>
            </div>
          )}
        </div>

        <Button
          variant="default"
          className="w-full mt-2"
          asChild
        >
          <a href={user.html_url} target="_blank" rel="noopener noreferrer">
            View GitHub Profile
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserCard;
