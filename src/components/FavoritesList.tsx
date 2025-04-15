
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useFavorites } from '../context/FavoritesContext';
import { Heart, ExternalLink, GripVertical, MapPin, Calendar, LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FavoriteUser } from '../types/GitHubUser';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  user: FavoriteUser;
  removeFavorite: (id: number) => void;
  isMobile: boolean;
}

const SortableItem: React.FC<SortableItemProps> = ({ user, removeFavorite, isMobile }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: user.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-green-100 /3 border border-black rounded-lg p-3 favorite-animation",
        isDragging && "opacity-50",
        "bg-card shadow-sm border rounded-lg favorite-animation",
        isDragging ? "opacity-50 z-50 shadow-lg" : "hover:shadow-md",
        "transition-all duration-200"
      )}
    >
      <div className="flex items-center gap-2 p-3">
        <button
          className="cursor-grab touch-none hover:text-accent transition-colors"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
        <img
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          className="h-8 w-8 rounded-full ring-1 ring-background object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate text-sm">{user.name || user.login}</h3>
          <p className="text-xs text-muted-foreground truncate">@{user.login}</p>
        </div>
        <div className="flex items-center space-x-2">
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 hover:text-accent"
            aria-label="View on GitHub"
          >
            <ExternalLink className="h-5 w-5" />
          </a>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-accent"
            asChild
          >
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-red-500"
            onClick={() => removeFavorite(user.id)}
            aria-label="Remove from favorites"
          >
            <Heart className="h-3 w-3 fill-current" />
          </Button>
        </div>
      </div>
    </li>
  );
};

const FavoritesList: React.FC = () => {
  const { favorites, removeFavorite, reorderFavorites } = useFavorites();
  const isMobile = useIsMobile();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = favorites.findIndex((user) => user.id === active.id);
      const newIndex = favorites.findIndex((user) => user.id === over.id);
      
      reorderFavorites(arrayMove(favorites, oldIndex, newIndex));
    }
  };

  return (
    <Card className="h-full border-black rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">

    <Card className="shadow-sm hover:shadow-md transition-all duration-300 h-auto">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Favorites
        </CardTitle>
      </CardHeader>
      <CardContent className={`overflow-auto ${isMobile ? 'max-h-[50vh]' : 'max-h-[calc(100vh-12rem)]'}`}>
        {favorites.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Heart className="h-10 w-10 mx-auto mb-2 stroke-1" />
            <p className="text-sm">No favorites yet</p>
            <p className="text-xs mt-1">Search for GitHub users to add them</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={favorites.map(user => user.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-2">
                {favorites.map((user) => (
                  <SortableItem
                    key={user.id}
                    user={user}
                    removeFavorite={removeFavorite}
                    isMobile={isMobile}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoritesList;
