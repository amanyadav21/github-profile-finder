
import { useState } from 'react';
import { GitHubUser } from '../types/GitHubUser';
import SearchBar from '../components/SearchBar';
import UserCard from '../components/UserCard';
import FavoritesList from '../components/FavoritesList';
import { Header } from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Search, AlertCircle } from 'lucide-react';

const Index = () => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const searchUser = async (username: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found');
        } else {
          throw new Error('Failed to fetch user data');
        }
      }
      
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPage = () => {
    setUser(null);
    setError(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onRefresh={refreshPage} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Search Section */}
            <Card className="bg-card border border-border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl flex items-center gap-3 text-card-foreground">
                  <div className="p-2 rounded-lg bg-muted border border-border">
                    <Search className="h-6 w-6 text-foreground" />
                  </div>
                  Discover GitHub Developers
                </CardTitle>
                <p className="text-muted-foreground">
                  Search for GitHub users and explore their profiles
                </p>
              </CardHeader>
              <CardContent>
                <SearchBar onSearch={searchUser} isLoading={isLoading} />
              </CardContent>
            </Card>
            
            {/* Loading State */}
            {isLoading && (
              <Card className="bg-card border border-border shadow-sm">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-20 w-20 rounded-full bg-muted" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-6 w-48 bg-muted" />
                        <Skeleton className="h-4 w-32 bg-muted" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <Skeleton className="h-16 rounded-lg bg-muted" />
                      <Skeleton className="h-16 rounded-lg bg-muted" />
                      <Skeleton className="h-16 rounded-lg bg-muted" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Error State */}
            {error && !isLoading && (
              <Card className="bg-card border border-destructive shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 text-center justify-center py-8">
                    <div className="p-2 rounded-full bg-destructive/10">
                      <AlertCircle className="h-6 w-6 text-destructive" />
                    </div>
                    <div>
                      <h3 className="font-medium text-destructive">Search Error</h3>
                      <p className="text-destructive/80 text-sm">{error}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* User Result */}
            {user && !isLoading && !error && (
              <UserCard user={user} />
            )}
          </div>
          
          {/* Favorites Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <FavoritesList />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
