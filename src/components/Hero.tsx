import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroSunrise from "@/assets/hero-sunrise.jpg";
import { Shield, Lock, Clock } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-16 bg-background">
      {/* Main Hero - Left/Right Split */}
      <div className="container mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[70vh]">
          
          {/* Left Side - Content */}
          <div className="order-2 lg:order-1 max-w-xl">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/60 border border-border/50 mb-8 animate-fade-in">
              <Lock className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
              <span className="text-sm text-muted-foreground font-medium">Private & Secure • End-to-End Encrypted</span>
            </div>
            
            {/* Headline - Strong serif */}
            <h1 className="mb-6 animate-fade-in-up leading-[1.05] tracking-tight">
              <span className="block font-serif text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground">
                Leave Behind Words
              </span>
              <span className="block font-sans text-2xl md:text-3xl lg:text-4xl font-light italic text-muted-foreground mt-4">
                that light the way
              </span>
            </h1>
            
            {/* Supporting Paragraph - Professional, smaller */}
            <p className="text-base md:text-lg text-muted-foreground mb-10 leading-relaxed animate-fade-in-up animation-delay-200 max-w-md">
              Create heartfelt messages for your loved ones — secured, private, 
              and delivered gently when the time is right.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in-up animation-delay-400">
              <Button variant="premium" size="xl" asChild className="min-w-[180px]">
                <Link to="/vault/compose">Begin Your Legacy</Link>
              </Button>
              <Button variant="trust" size="lg" asChild>
                <Link to="/security" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  How We Protect You
                </Link>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 animate-fade-in-up animation-delay-600">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-4 h-4 text-success" strokeWidth={1.5} />
                <span className="text-sm font-medium">Bank-Level Security</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Lock className="w-4 h-4 text-primary" strokeWidth={1.5} />
                <span className="text-sm font-medium">You Control Access</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4 text-accent-foreground" strokeWidth={1.5} />
                <span className="text-sm font-medium">Your Timeline</span>
              </div>
            </div>
          </div>
          
          {/* Right Side - Hero Image */}
          <div className="order-1 lg:order-2 relative animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] lg:aspect-[3/4]">
              {/* Main Image - Full contrast */}
              <img 
                src={heroSunrise} 
                alt="Sunrise breaking through clouds" 
                className="w-full h-full object-cover"
              />
              
              {/* Subtle left-edge gradient for blending */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent"
                style={{ opacity: 0.4 }}
              />
              
              {/* Subtle vignette for depth */}
              <div 
                className="absolute inset-0"
                style={{ 
                  background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.15) 100%)'
                }}
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
      
      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-navy pointer-events-none" />
    </section>
  );
};

export default Hero;
