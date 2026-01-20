import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-20 bg-navy border-t border-primary/20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-primary-foreground flex items-center justify-center">
                <span className="text-navy text-sm font-serif font-semibold">E</span>
              </div>
              <span className="font-serif text-xl text-primary-foreground tracking-tight">EchoLight</span>
            </Link>
            <p className="text-primary-foreground/60 text-sm leading-relaxed mb-4">
              A quiet place to leave words, memories, and light for the people you love.
            </p>
            <div className="flex items-center gap-2 text-sm text-primary-foreground/60">
              <Shield className="w-4 h-4 text-success" />
              <span>Privacy-first. Always.</span>
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-medium text-primary-foreground mb-5 text-sm tracking-wide uppercase">Product</h4>
            <ul className="space-y-3.5">
              <li>
                <Link
                  to="/how-it-works"
                  className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/features"
                  className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/security"
                  className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm"
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-primary-foreground mb-5 text-sm tracking-wide uppercase">Company</h4>
            <ul className="space-y-3.5">
              <li><Link to="/about" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">Why EchoLight</Link></li>
              <li><Link to="/contact" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-primary-foreground mb-5 text-sm tracking-wide uppercase">Legal</h4>
            <ul className="space-y-3.5">
              <li><Link to="/privacy" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">Terms of Service</Link></li>
              <li><Link to="/security" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">Security Practices</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="pt-8 border-t border-primary/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} EchoLight. All rights reserved.
          </p>
          <p className="text-primary-foreground/50 text-sm">
            Built with care for those who want to leave meaning behind.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
