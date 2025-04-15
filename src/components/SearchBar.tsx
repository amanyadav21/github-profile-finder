
import React, { useState, useCallback, useRef } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import debounce from 'lodash/debounce';
import SearchSuggestions from './SearchSuggestions';
import { useIsMobile } from '@/hooks/use-mobile';

interface SearchBarProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [username, setUsername] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
      setSuggestions(data.items.map((item: any) => item.login));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsSuggestionsLoading(false);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 300),
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
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className={`flex gap-2 w-full ${isMobile ? 'flex-col' : ''}`}>
        <div className="relative flex-grow">
          <Input
            type="text"
            value={username}
            onChange={handleInputChange}
            placeholder="Enter GitHub username"
            className="pr-8"
            disabled={isLoading}
          />
          {isSuggestionsLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || !username.trim()}
          className={isMobile ? 'w-full' : 'min-w-[100px]'}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Searching</span>
            </div>
          ) : (
            <>
              <Search className="h-4 w-4 mr-1" />
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
