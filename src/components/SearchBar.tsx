
import React, { useState, useCallback, useRef } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import debounce from 'lodash/debounce';
import SearchSuggestions from './SearchSuggestions';

interface SearchBarProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [username, setUsername] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const { toast } = useToast();

  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsSuggestionsLoading(true);
    try {
      const response = await fetch(`https://api.github.com/search/users?q=${query}+in:login&per_page=5`);
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      
      const data = await response.json();
      setSuggestions(data.items.map((item: { login: string }) => item.login));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsSuggestionsLoading(false);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce((query: string) => fetchSuggestions(query), 300),
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
      setSuggestions([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    debouncedFetchSuggestions(value);
  };

  const handleSuggestionSelect = (selected: string) => {
    setUsername(selected);
    onSearch(selected);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full space-y-2">
      <form onSubmit={handleSubmit} className="flex gap-3 w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={username}
            onChange={handleInputChange}
            placeholder="Enter GitHub username (e.g., octocat)"
            className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all"
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || !username.trim()}
          className="h-11 px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Search
            </>
          )}
        </Button>
      </form>
      <SearchSuggestions
        suggestions={suggestions}
        isLoading={isSuggestionsLoading}
        onSelect={handleSuggestionSelect}
      />
    </div>
  );
};

export default SearchBar;
