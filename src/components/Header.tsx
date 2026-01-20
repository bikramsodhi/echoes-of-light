import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import echolightLogo from "@/assets/echolight-logo.png";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border/40">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src={echolightLogo}
            alt="EchoLight"
            className="h-10 object-contain object-left"
          />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/how-it-works"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
          >
            How It Works
          </Link>
          <Link
            to="/features"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
          >
            Features
          </Link>
          <Link
            to="/security"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
          >
            Security
          </Link>
          <Link
            to="/about"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
          >
            Why EchoLight
          </Link>
        </nav>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button variant="premium" size="sm" asChild className="hidden md:inline-flex">
            <Link to="/auth">Get Started</Link>
          </Button>
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background">
          <div className="container mx-auto px-6 py-4 space-y-3">

            <Link
              to="/how-it-works"
              className="block text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              to="/features"
              className="block text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/security"
              className="block text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Security
            </Link>
            <Link
              to="/about"
              className="block text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Why EchoLight
            </Link>
            <div className="pt-3 border-t border-border/40 flex gap-3">
              <Button variant="ghost" size="sm" asChild className="flex-1">
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              </Button>
              <Button variant="premium" size="sm" asChild className="flex-1">
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;