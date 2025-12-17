import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-light.png";
import { Heart, Shield, Clock } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Peaceful light rays symbolizing legacy and memory" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse-soft" />
            <span className="text-sm text-muted-foreground">Your words will echo with warmth</span>
          </div>
          
          {/* Headline */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 animate-fade-in-up leading-tight">
            Leave Behind Words That 
            <span className="text-gradient-primary"> Light the Way</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Create heartfelt messages, memories, and media for your loved ones — 
            to be delivered gently, when the time is right.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up animation-delay-400">
            <Button variant="warm" size="xl" asChild>
              <Link to="/get-started">Begin Your Legacy</Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/how-it-works">Learn How It Works</Link>
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 animate-fade-in-up animation-delay-600">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm">Protected & Private</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Heart className="w-5 h-5 text-primary" />
              <span className="text-sm">Delivered with Care</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm">Your Timeline</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
