
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useFavorites } from '../context/FavoritesContext';
import { Heart, ExternalLink, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
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
}

const SortableItem: React.FC<SortableItemProps> = ({ user, removeFavorite }) => {
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
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-center gap-3">
        <button
          className="cursor-grab touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5 text-black" />
        </button>
        <img
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          className="h-10 w-10 rounded-full"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{user.name || user.login}</h3>
          <p className="text-sm text-gray-500 truncate">@{user.login}</p>
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
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-red-500"
            onClick={() => removeFavorite(user.id)}
            aria-label="Remove from favorites"
          >
            <Heart className="h-5 w-5 fill-red-500" />
          </Button>
        </div>
      </div>
    </li>
  );
};

const FavoritesList: React.FC = () => {
  const { favorites, removeFavorite, reorderFavorites } = useFavorites();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
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
          <Heart className="h-5 w-5 text-red-500" />
          Favorite Users
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto max-h-[calc(100vh-10rem)]">
        {favorites.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Heart className="h-12 w-12 mx-auto mb-3 stroke-1" />
            <p>No favorites yet</p>
            <p className="text-sm mt-1">Search for GitHub users and add them to your favorites</p>
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
              <ul className="space-y-3">
                {favorites.map((user) => (
                  <SortableItem
                    key={user.id}
                    user={user}
                    removeFavorite={removeFavorite}
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
