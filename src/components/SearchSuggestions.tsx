
import React from 'react';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Card } from '@/components/ui/card';
import { User, Search } from 'lucide-react';

interface SearchSuggestionsProps {
  suggestions: string[];
  isLoading: boolean;
  onSelect: (username: string) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  isLoading,
  onSelect,
}) => {
  if (suggestions.length === 0 && !isLoading) return null;

  return (
    <Card className="absolute top-full left-0 right-0 z-50 mt-1">
      <Command className="rounded-lg border shadow-md">
        <CommandList>
          <CommandEmpty className="p-4 text-sm text-muted-foreground">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                <span>Searching...</span>
              </div>
            ) : (
              "No results found."
            )}
          </CommandEmpty>
          {suggestions.map((suggestion) => (
            <CommandItem
              key={suggestion}
              value={suggestion}
              onSelect={() => onSelect(suggestion)}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-accent"
            >
              <User className="h-4 w-4" />
              <span>{suggestion}</span>
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    </Card>
  );
};

export default SearchSuggestions;
