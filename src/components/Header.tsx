import { Github, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface HeaderProps {
  onRefresh?: () => void;
}

export function Header({ onRefresh }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <button 
            onClick={onRefresh}
            className="mr-6 flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <Github className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Git-User Finder
            </span>
          </button>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">

          </div>
          
          <nav className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-foreground/60 hover:text-foreground"
            >
              <a
                href="https://github.com/amanyadav21/github-profile-finder"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
