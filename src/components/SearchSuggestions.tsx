
import React from 'react';
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Card } from '@/components/ui/card';
import { User, Loader2 } from 'lucide-react';

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
    <Card className="absolute top-full left-0 right-0 z-50 mt-1 shadow-md border border-border/50">
      <Command className="rounded-lg">
        <CommandList className="max-h-[40vh]">
          <CommandEmpty className="py-3 text-sm text-muted-foreground">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Searching users...</span>
              </div>
            ) : (
              "No matching users found"
            )}
          </CommandEmpty>
          {suggestions.map((suggestion) => (
            <CommandItem
              key={suggestion}
              value={suggestion}
              onSelect={() => onSelect(suggestion)}
              className="flex items-center gap-2 py-2 cursor-pointer transition-colors"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{suggestion}</span>
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    </Card>
  );
};

export default SearchSuggestions;
