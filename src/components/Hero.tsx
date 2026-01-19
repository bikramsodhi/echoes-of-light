import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroSunrise from "@/assets/hero-sunrise.jpg";
import { Shield, Lock, Clock, FileText, Calendar, CheckCircle } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative flex flex-col items-center overflow-hidden pt-20">
      {/* Hero Section with Background Image */}
      <div className="relative w-full min-h-[85vh] flex flex-col items-center justify-center">
        {/* Cinematic Background - Full contrast image with strategic overlays */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Sunrise image at FULL contrast - no opacity reduction */}
          <img 
            src={heroSunrise} 
            alt="Sunrise breaking through clouds over mountains" 
            className="w-full h-full object-cover"
          />
          
          {/* Subtle vignette for cinematic depth */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ 
              background: 'radial-gradient(ellipse at center, transparent 40%, rgba(42, 50, 64, 0.15) 100%)'
            }}
          />
          
          {/* Bottom gradient fade to blend with next section */}
          <div 
            className="absolute inset-x-0 bottom-0 h-1/3"
            style={{ 
              background: 'linear-gradient(to top, #FAF9F6 0%, rgba(250, 249, 246, 0.8) 40%, transparent 100%)'
            }}
          />
          
          {/* Radial fade behind text for legibility */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ 
              background: 'radial-gradient(ellipse 80% 50% at 50% 45%, rgba(250, 249, 246, 0.5) 0%, transparent 70%)'
            }}
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 border border-border/50 mb-10 animate-fade-in backdrop-blur-sm shadow-sm">
              <Lock className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
              <span className="text-sm text-foreground/80 font-medium">Private & Secure • End-to-End Encrypted</span>
            </div>
            
            {/* Headline with text container for guaranteed legibility */}
            <div 
              className="rounded-2xl px-8 py-6 mb-6 animate-fade-in-up"
              style={{ 
                backgroundColor: 'rgba(250, 249, 246, 0.85)',
                boxShadow: '0 4px 30px rgba(42, 50, 64, 0.08)'
              }}
            >
              <h1 className="font-serif leading-[1.1] tracking-tight">
                <span 
                  className="block text-5xl md:text-6xl lg:text-7xl font-semibold"
                  style={{ 
                    color: '#2A3240',
                    textShadow: '0 2px 4px rgba(139, 143, 163, 0.12)'
                  }}
                >
                  Leave Behind Words
                </span>
                <span 
                  className="block text-3xl md:text-4xl lg:text-5xl font-normal italic mt-3"
                  style={{ 
                    color: '#6B7280',
                    textShadow: '0 1px 3px rgba(139, 143, 163, 0.1)'
                  }}
                >
                  that light the way
                </span>
              </h1>
            </div>
            
            {/* Subheadline - Professional sans-serif with subtle shadow */}
            <p 
              className="text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200 font-sans"
              style={{ 
                color: '#4B5563',
                textShadow: '0 1px 2px rgba(250, 249, 246, 0.8)'
              }}
            >
              Create heartfelt messages for your loved ones — secured, private, 
              and delivered gently when the time is right.
            </p>
            
            {/* CTA Buttons - Clean floating appearance */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up animation-delay-400">
              <Button variant="premium" size="xl" asChild className="min-w-[200px] shadow-lg">
                <Link to="/vault/compose">Begin Your Legacy</Link>
              </Button>
              <Button variant="trust" size="lg" asChild className="shadow-md bg-background/90 backdrop-blur-sm">
                <Link to="/security" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  See How We Protect Your Words
                </Link>
              </Button>
            </div>
            
            {/* Trust Indicators Row */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-10 animate-fade-in-up animation-delay-600">
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm shadow-sm">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-success" strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium text-foreground/80">Bank-Level Security</span>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm shadow-sm">
                <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-primary" strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium text-foreground/80">You Control Access</span>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm shadow-sm">
                <div className="w-8 h-8 rounded-full bg-accent/25 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-accent-foreground" strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium text-foreground/80">Delivered On Your Terms</span>
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
