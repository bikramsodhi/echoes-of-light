import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import echolightLogo from "@/assets/echolight-logo.png";

interface HeaderProps {
  showFullNav?: boolean;
}

const Header = ({ showFullNav = true }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40 lg:left-[260px] left-0">
      <div className="px-6 h-16 flex items-center justify-between">
        {/* Mobile: Show logo - Desktop: hide since it's in sidebar */}
        <div className="lg:hidden">
          <Link to="/" className="flex items-center">
            <img
              src={echolightLogo}
              alt="EchoLight"
              className="h-8 object-contain object-left"
            />
          </Link>
        </div>
        
        {/* Desktop: empty left spacer when sidebar has logo */}
        <div className="hidden lg:block" />
        
        {/* Right side - Sign In / Get Started */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button variant="premium" size="sm" asChild className="hidden sm:inline-flex">
            <Link to="/auth">Get Started</Link>
          </Button>
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background">
          <div className="px-6 py-4 space-y-3">
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