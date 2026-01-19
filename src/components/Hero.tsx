import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import heroSunrise from "@/assets/hero-sunrise.jpg";
import { Shield, Lock, Clock, FileText, Calendar, CheckCircle } from "lucide-react";

const navLinks = [
  { to: "/how-it-works", label: "How It Works" },
  { to: "/features", label: "Features" },
  { to: "/security", label: "Security" },
  { to: "/about", label: "Why EchoLight" },
];

const Hero = () => {
  const location = useLocation();
  
  return (
    <section className="relative flex overflow-hidden pt-16">
      {/* Vertical Left Navigation - Desktop Only */}
      <nav className="hidden lg:flex fixed left-0 top-1/2 -translate-y-1/2 z-40 flex-col items-start pl-8 gap-1">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`
                group relative px-4 py-2.5 text-sm font-medium transition-all duration-300
                ${isActive 
                  ? 'text-[#2A3240]' 
                  : 'text-[#2A3240]/60 hover:text-[#2A3240]'
                }
              `}
            >
              {/* Active/Hover gold bar indicator */}
              <span 
                className={`
                  absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 rounded-full transition-all duration-300
                  ${isActive 
                    ? 'h-5 bg-[#C6A97E]' 
                    : 'group-hover:h-3 bg-[#C6A97E]/50'
                  }
                `}
              />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Hero Section with Background Image */}
      <div className="relative w-full min-h-[90vh] flex flex-col items-center justify-center">
        {/* Cinematic Background with warm golden treatment */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Sunrise image at FULL color - scaled and focused */}
          <img 
            src={heroSunrise} 
            alt="Sunrise breaking through clouds over mountains" 
            className="w-full h-full object-cover scale-105"
          />
          
          {/* Warm golden glow overlay */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255, 213, 138, 0.25) 0%, rgba(198, 169, 126, 0.15) 50%, transparent 100%)'
            }}
          />
          
          {/* Cinematic vignette - warmer tones */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ 
              background: 'radial-gradient(ellipse at center, transparent 35%, rgba(42, 50, 64, 0.25) 100%)'
            }}
          />
          
          {/* Bottom gradient fade - warm cream */}
          <div 
            className="absolute inset-x-0 bottom-0 h-2/5"
            style={{ 
              background: 'linear-gradient(to top, #FAF9F6 0%, rgba(253, 244, 227, 0.9) 30%, rgba(255, 213, 138, 0.3) 60%, transparent 100%)'
            }}
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-20 text-center">
          <div className="max-w-3xl mx-auto">
            {/* Trust Badge with gold accent */}
            <div 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-10 animate-fade-in"
              style={{
                background: 'rgba(253, 244, 227, 0.9)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(198, 169, 126, 0.3)',
                boxShadow: '0 4px 20px rgba(198, 169, 126, 0.15)'
              }}
            >
              <Lock className="w-3.5 h-3.5" style={{ color: '#C6A97E' }} strokeWidth={2} />
              <span className="text-sm font-medium" style={{ color: '#2A3240' }}>
                Private & Secure • End-to-End Encrypted
              </span>
            </div>
            
            {/* Headline with frosted glass container */}
            <div 
              className="rounded-3xl px-10 py-8 mb-8 animate-fade-in-up"
              style={{ 
                background: 'rgba(253, 244, 227, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(198, 169, 126, 0.2)',
                boxShadow: '0 8px 40px rgba(42, 50, 64, 0.08), 0 0 80px rgba(255, 213, 138, 0.15)'
              }}
            >
              <h1 className="font-serif leading-[1.1] tracking-tight">
                <span 
                  className="block text-5xl md:text-6xl lg:text-7xl font-semibold"
                  style={{ 
                    color: '#2A3240',
                    textShadow: '0 2px 8px rgba(198, 169, 126, 0.15)'
                  }}
                >
                  Leave Behind Words
                </span>
                <span 
                  className="block text-3xl md:text-4xl lg:text-5xl font-normal italic mt-4"
                  style={{ 
                    color: '#C6A97E',
                    textShadow: '0 1px 4px rgba(198, 169, 126, 0.2)'
                  }}
                >
                  that light the way
                </span>
              </h1>
            </div>
            
            {/* Subheadline with warm styling */}
            <p 
              className="text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200 font-sans"
              style={{ 
                color: '#4B5563',
                textShadow: '0 1px 3px rgba(253, 244, 227, 0.9)'
              }}
            >
              Create heartfelt messages for your loved ones — secured, private, 
              and delivered gently when the time is right.
            </p>
            
            {/* CTA Buttons with gold accent styling */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-14 animate-fade-in-up animation-delay-400">
              <Button 
                size="xl" 
                asChild 
                className="min-w-[220px] text-base font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #C6A97E 0%, #B8956F 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 30px rgba(198, 169, 126, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
                }}
              >
                <Link to="/vault/compose">Begin Your Legacy</Link>
              </Button>
              <Button 
                size="lg" 
                asChild 
                className="font-medium"
                style={{
                  background: 'rgba(253, 244, 227, 0.9)',
                  backdropFilter: 'blur(8px)',
                  color: '#2A3240',
                  border: '1px solid rgba(198, 169, 126, 0.3)',
                  boxShadow: '0 4px 20px rgba(42, 50, 64, 0.08)'
                }}
              >
                <Link to="/security" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" style={{ color: '#C6A97E' }} />
                  See How We Protect Your Words
                </Link>
              </Button>
            </div>
            
            {/* Trust Indicators with warm gold accents */}
            <div className="flex flex-wrap justify-center gap-5 md:gap-8 animate-fade-in-up animation-delay-600">
              <div 
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-full"
                style={{
                  background: 'rgba(253, 244, 227, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(198, 169, 126, 0.2)',
                  boxShadow: '0 2px 12px rgba(198, 169, 126, 0.1)'
                }}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(198, 169, 126, 0.2)' }}
                >
                  <Shield className="w-4 h-4" style={{ color: '#C6A97E' }} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium" style={{ color: '#2A3240' }}>Bank-Level Security</span>
              </div>
              <div 
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-full"
                style={{
                  background: 'rgba(253, 244, 227, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(198, 169, 126, 0.2)',
                  boxShadow: '0 2px 12px rgba(198, 169, 126, 0.1)'
                }}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(198, 169, 126, 0.2)' }}
                >
                  <Lock className="w-4 h-4" style={{ color: '#C6A97E' }} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium" style={{ color: '#2A3240' }}>You Control Access</span>
              </div>
              <div 
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-full"
                style={{
                  background: 'rgba(253, 244, 227, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(198, 169, 126, 0.2)',
                  boxShadow: '0 2px 12px rgba(198, 169, 126, 0.1)'
                }}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(198, 169, 126, 0.2)' }}
                >
                  <Clock className="w-4 h-4" style={{ color: '#C6A97E' }} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium" style={{ color: '#2A3240' }}>Delivered On Your Terms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Below Hero - Clean background section */}
      <div className="relative z-10 w-full bg-background py-16">
        <div className="container mx-auto px-6">
          {/* Deeper Purpose */}
          <div className="max-w-2xl mx-auto text-center animate-fade-in-up animation-delay-800 mb-16">
            <p className="text-lg md:text-xl text-foreground/70 italic font-serif mb-3">
              "What if you could say what mattered—when you're not around to say it?"
            </p>
            <p className="text-base text-muted-foreground font-sans">
              Messages that wait. Words that stay. Love that arrives, even when you can't.
            </p>
          </div>
          
          {/* Grounding Element - Message Preview Card */}
          <div className="w-full max-w-md mx-auto animate-fade-in-up animation-delay-800">
            <div className="card-elegant rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-medium text-foreground">For Emma</span>
                    <span className="text-xs text-muted-foreground/60">•</span>
                    <span className="inline-flex items-center gap-1 text-xs text-success">
                      <CheckCircle className="w-3 h-3" />
                      Secured
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    "I wanted you to know how proud I am of the person you've become..."
                  </p>
                  <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground/60">
                    <Calendar className="w-3 h-3" strokeWidth={1.5} />
                    <span>To be delivered on her 30th birthday</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
