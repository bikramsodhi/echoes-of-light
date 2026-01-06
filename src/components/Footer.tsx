import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-serif">E</span>
              </div>
              <span className="font-serif text-xl text-foreground">EchoLight</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Because even after you're gone, your voice echoes in the light.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/how-it-works"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Why EchoLight</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Blog</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Terms of Service</Link></li>
              <li><Link to="/security" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Security</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 EchoLight. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-primary fill-primary" /> for those we love
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
