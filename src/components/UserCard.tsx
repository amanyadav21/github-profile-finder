
import React from 'react';
import { GitHubUser, FavoriteUser } from '../types/GitHubUser';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Heart, ExternalLink, MapPin, Building, Calendar, Users, GitFork, Star } from 'lucide-react';
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
    <Card className="w-full overflow-hidden bg-card border border-border shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="relative p-6 pb-4">
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "transition-all duration-300 hover:scale-110",
              favorited 
                ? "text-red-500 hover:text-red-400 hover:bg-red-950/30" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            onClick={handleFavoriteToggle}
            aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={cn("h-5 w-5 transition-all", favorited && "fill-current")} />
          </Button>
        </div>
        
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20 border-4 border-border shadow-lg">
            <AvatarImage
              src={user.avatar_url}
              alt={`${user.login}'s avatar`}
              className="object-cover"
            />
            <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
              {user.login.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-card-foreground">
                {user.name || user.login}
              </h2>
              <Button
                variant="link"
                className="p-0 h-auto text-muted-foreground hover:text-foreground"
                asChild
              >
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  @{user.login}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
            
            {user.bio && (
              <p className="text-muted-foreground leading-relaxed">{user.bio}</p>
            )}
            
            <div className="flex flex-wrap gap-2">
              {user.location && (
                <Badge variant="secondary" className="gap-1">
                  <MapPin className="h-3 w-3" />
                  {user.location}
                </Badge>
              )}
              {user.company && (
                <Badge variant="outline" className="gap-1">
                  <Building className="h-3 w-3" />
                  {user.company}
                </Badge>
              )}
              {user.created_at && (
                <Badge variant="outline" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  Joined {new Date(user.created_at).getFullYear()}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="p-4 rounded-lg bg-muted border border-border">
                <div className="text-2xl font-bold text-foreground">
                  {user.public_repos}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Repositories
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="p-4 rounded-lg bg-muted border border-border">
                <div className="text-2xl font-bold text-foreground">
                  {user.followers}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Followers
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="text-2xl font-bold text-black">
                  {user.following}
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  Following
                </div>
              </div>
            </div>
          </div>
          
          <Button
            className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
            asChild
          >
            <a href={user.html_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              View GitHub Profile
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
