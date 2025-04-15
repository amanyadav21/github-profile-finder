
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
      <form onSubmit={handleSubmit} className="flex gap-2 w-full">
        <Input
          type="text"
          value={username}
          onChange={handleInputChange}
          placeholder="Enter GitHub username"
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !username.trim()}>
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
          ) : (
            <>
              <Search className="h-5 w-5 mr-1" />
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
