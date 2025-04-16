import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useFavorites } from "../context/FavoritesContext";
import { Heart, ExternalLink, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
  user: FavoriteUser;
  removeFavorite: (id: number) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
  user,
  removeFavorite,
}) => {
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
        "group relative bg-white dark:bg-gray-800 rounded-lg p-3",
        "border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md",
        "bg-green-100 border-2 border-black",
        isDragging && "opacity-50 scale-95 shadow-lg"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Drag Handle */}
        <button
          className="cursor-grab touch-none p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
        </button>

        {/* User Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
            className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
          />
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate text-gray-900 dark:text-white">
            {user.name || user.login}
          </h3>
          <p className="text-sm truncate text-gray-500 dark:text-gray-400">
            @{user.login}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* GitHub Link */}
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="View on GitHub"
          >
            <ExternalLink className="h-5 w-5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400" />
          </a>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            onClick={() => removeFavorite(user.id)}
            aria-label="Remove from favorites"
          >
            <Heart className="h-5 w-5 fill-red-500 text-red-500 hover:fill-white dark:hover:fill-gray-800 transition-colors" />
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
    <Card className="shadow-sm hover:shadow-md transition-all duration-300 h-auto bg-yellow-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Favorite Users
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto max-h-[calc(100vh-10rem)]">
        {favorites.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Heart className="h-12 w-12 mx-auto mb-3 stroke-1" />
            <p>No favorites yet</p>
            <p className="text-sm mt-1">
              Search for GitHub users and add them to your favorites
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={favorites.map((user) => user.id)}
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
