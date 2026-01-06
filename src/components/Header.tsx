import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-serif">E</span>
          </div>
          <span className="font-serif text-xl text-foreground">EchoLight</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/how-it-works"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            How It Works
          </Link>
          <Link
            to="/about"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            Why EchoLight
          </Link>
        </nav>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
