import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useFavorites } from "../context/FavoritesContext";
import { FavoriteUser } from "../types/GitHubUser";
import { Heart, ExternalLink, GripVertical, Users } from "lucide-react";
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
        "group relative rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-200",
        "hover:border-border hover:bg-card/80 hover:shadow-md",
        isDragging && "opacity-60 scale-95 shadow-lg border-primary/50"
      )}
    >
      <div className="flex items-center gap-3 p-4">
        {/* Drag Handle */}
        <button
          className="cursor-grab touch-none p-1 rounded-md hover:bg-muted/60 transition-colors opacity-60 group-hover:opacity-100"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* User Avatar */}
        <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
          <AvatarImage
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
          />
          <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-primary/20 to-primary/10">
            {user.login.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* User Info */}
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="font-medium truncate text-foreground">
            {user.name || user.login}
          </h3>
          <p className="text-sm truncate text-muted-foreground">
            @{user.login}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
          {/* GitHub Link */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/60"
          >
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            onClick={() => removeFavorite(user.id)}
            aria-label="Remove from favorites"
          >
            <Heart className="h-4 w-4 fill-current" />
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
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20">
            <Heart className="h-5 w-5 text-red-500" />
          </div>
          Favorite Developers
          {favorites.length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {favorites.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto max-h-[calc(100vh-12rem)]">
        {favorites.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">No favorites yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Search for GitHub users and click the heart icon to add them to your favorites
              </p>
            </div>
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
