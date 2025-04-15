
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <Input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter GitHub username"
        className="flex-1"
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading || !username.trim()}>
        {isLoading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
        ) : (
          <Search className="h-5 w-5 mr-1" />
        )}
        {!isLoading && "Search"}
      </Button>
    </form>
  );
};

export default SearchBar;
