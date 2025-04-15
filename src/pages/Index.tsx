
import { useState } from 'react';
import { GitHubUser } from '../types/GitHubUser';
import SearchBar from '../components/SearchBar';
import UserCard from '../components/UserCard';
import FavoritesList from '../components/FavoritesList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Github } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto flex items-center gap-3">
          <Github className="h-6 w-6" />
          <h1 className="text-2xl font-bold text-white">GitHub User Finder</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Search for GitHub Users</CardTitle>
              </CardHeader>
              <CardContent>
                <SearchBar onSearch={searchUser} isLoading={isLoading} />
              </CardContent>
            </Card>
            
            {isLoading && (
              <div className="flex justify-center items-center h-60">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-accent"></div>
              </div>
            )}
            
            {error && !isLoading && (
              <Card className="bg-destructive/10 border-destructive/30">
                <CardContent className="pt-6 text-center">
                  <p className="text-destructive">{error}</p>
                </CardContent>
              </Card>
            )}
            
            {user && !isLoading && !error && (
              <UserCard user={user} />
            )}
          </div>
          
          <div className="lg:col-span-1">
            <FavoritesList />
          </div>
        </div>
      </main>
      
      {/* <footer className="bg-background border-t mt-auto py-4">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          <p>GitHub User Finder &copy; {new Date().getFullYear()}</p>
          <p className="text-xs mt-1">
            Uses the <a href="https://docs.github.com/en/rest" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">GitHub API</a>
          </p>
        </div>
      </footer> */}
    </div>
  );
};

export default Index;
