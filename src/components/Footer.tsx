import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-20 bg-gradient-to-b from-background to-secondary/30 border-t border-border/40">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-serif font-semibold">E</span>
              </div>
              <span className="font-serif text-xl text-foreground tracking-tight">EchoLight</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              A quiet place to leave words, memories, and light for the people you love.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-success" />
              <span>Privacy-first. Always.</span>
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-medium text-foreground mb-5 text-sm tracking-wide uppercase">Product</h4>
            <ul className="space-y-3.5">
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
                  to="/features"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/security"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-5 text-sm tracking-wide uppercase">Company</h4>
            <ul className="space-y-3.5">
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Why EchoLight</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-5 text-sm tracking-wide uppercase">Legal</h4>
            <ul className="space-y-3.5">
              <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Terms of Service</Link></li>
              <li><Link to="/security" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Security Practices</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} EchoLight. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Built with care for those who want to leave meaning behind.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;