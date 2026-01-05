import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-light.png";
import { Heart, Shield, Clock, FileText, Calendar } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
      {/* Background Image with Reduced Overlay - less glow, more grounded */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Peaceful light rays symbolizing legacy and memory" 
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Badge - softer treatment */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 border border-border/40 mb-8 animate-fade-in backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-success/80" />
            <span className="text-sm text-muted-foreground">Your words will echo with warmth</span>
          </div>
          
          {/* Headline - Split visual weights */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 animate-fade-in-up leading-tight">
            <span className="text-foreground font-bold">Leave Behind Words</span>
            <br />
            <span className="text-primary/80 font-normal text-3xl md:text-4xl lg:text-5xl">that light the way</span>
          </h1>
          
          {/* Subheadline - Improved contrast */}
          <p className="text-lg md:text-xl text-foreground/70 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Create heartfelt messages, memories, and media for your loved ones — 
            to be delivered gently, when the time is right.
          </p>
          
          {/* CTA Buttons - Clear hierarchy */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20 animate-fade-in-up animation-delay-400">
            <Button variant="warm" size="xl" asChild className="shadow-lg hover:shadow-xl font-medium">
              <Link to="/vault/compose">Begin Your Legacy</Link>
            </Button>
            <Button variant="ghost" size="lg" asChild className="text-muted-foreground hover:text-foreground">
              <Link to="/how-it-works">Learn How It Works</Link>
            </Button>
          </div>
          
          {/* Trust Indicators - Softer icons */}
          <div className="flex flex-wrap justify-center gap-8 animate-fade-in-up animation-delay-600">
            <div className="flex items-center gap-2 text-muted-foreground/80">
              <Shield className="w-4 h-4 text-primary/60" strokeWidth={1.5} />
              <span className="text-sm">Protected & Private</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground/80">
              <Heart className="w-4 h-4 text-primary/60" strokeWidth={1.5} />
              <span className="text-sm">Delivered with Care</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground/80">
              <Clock className="w-4 h-4 text-primary/60" strokeWidth={1.5} />
              <span className="text-sm">Your Timeline</span>
            </div>
          </div>
        </div>
        
        {/* Deeper Purpose Section - Mid-scroll framing */}
        <div className="mt-16 max-w-2xl mx-auto text-center animate-fade-in-up animation-delay-600">
          <p className="text-lg md:text-xl text-foreground/60 italic mb-4">
            What if you could say what mattered—when you're not around to say it?
          </p>
          <p className="text-base text-muted-foreground mb-2">That's what EchoLight is for.</p>
          <p className="text-base md:text-lg text-foreground/70 font-medium">
            Messages that wait. Words that stay. Love that arrives, even when you can't.
          </p>
        </div>
      </div>
      
      {/* Grounding Element - Message Preview Card */}
      <div className="relative z-10 w-full max-w-md mx-auto mt-16 px-6 animate-fade-in-up animation-delay-600">
        <div className="bg-card/90 backdrop-blur-sm border border-border/30 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary/70" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-foreground/90">For Emma</span>
                <span className="text-xs text-muted-foreground/60">•</span>
                <span className="text-xs text-muted-foreground/60">Draft</span>
              </div>
              <p className="text-sm text-muted-foreground/70 leading-relaxed line-clamp-2">
                "I wanted you to know how proud I am of the person you've become..."
              </p>
              <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground/50">
                <Calendar className="w-3 h-3" strokeWidth={1.5} />
                <span>To be delivered on her 30th birthday</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
