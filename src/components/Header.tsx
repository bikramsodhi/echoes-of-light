import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Info, Shield, Sparkles, HelpCircle } from "lucide-react";
import { useState } from "react";
import echolightLogo from "@/assets/echolight-logo.png";
import { NavBar } from "@/components/ui/tubelight-navbar";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "How It Works", url: "/how-it-works", icon: HelpCircle },
    { name: "Features", url: "/features", icon: Sparkles },
    { name: "Security", url: "/security", icon: Shield },
    { name: "Why EchoLight", url: "/about", icon: Info },
  ];

  const navLinks = [
    { to: "/how-it-works", label: "How It Works" },
    { to: "/features", label: "Features" },
    { to: "/security", label: "Security" },
    { to: "/about", label: "Why EchoLight" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy border-b border-primary/20">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={echolightLogo}
            alt="EchoLight"
            className="h-9 object-contain object-left brightness-0 invert"
          />
        </Link>
        
        {/* Desktop Navigation - Tubelight NavBar */}
        <div className="hidden lg:flex flex-1 justify-center">
          <NavBar items={navItems} />
        </div>
        
        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="hidden md:inline-flex text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            asChild 
            className="hidden md:inline-flex border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-navy"
          >
            <Link to="/auth">Get Started</Link>
          </Button>
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy border-t border-primary/20">
          <div className="container mx-auto px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/5 transition-colors text-sm font-semibold tracking-wide uppercase py-3 px-2 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-primary/20 flex gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                asChild 
                className="flex-1 text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                asChild 
                className="flex-1 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-navy"
              >
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
