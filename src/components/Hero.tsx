import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Lock, Clock } from "lucide-react";
import { ParticleTextEffect } from "@/components/ui/particle-text-effect";
import heroEnvelopes from "@/assets/hero-envelopes.png";

const Hero = () => {
  return (
    <section className="relative bg-background">
      {/* Main Hero - Centered Stacked Layout */}
      <div className="container mx-auto px-6 pt-20 pb-12">
        <div className="flex flex-col items-center text-center">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/60 border border-border/50 mb-6 animate-fade-in">
            <Lock className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
            <span className="text-sm text-muted-foreground font-medium">Private & Secure • End-to-End Encrypted</span>
          </div>
          
          {/* Headline - Particle Text Effect - Centered */}
          <div className="relative mb-4 animate-fade-in-up h-[140px] md:h-[160px] lg:h-[180px] w-full max-w-3xl">
            {/* Subtle radial glow background */}
            <div 
              className="absolute inset-0 -inset-x-8 -inset-y-4 pointer-events-none"
              style={{
                background: `
                  radial-gradient(
                    ellipse 80% 60% at 50% 50%,
                    hsl(var(--accent) / 0.15) 0%,
                    hsl(var(--accent) / 0.075) 30%,
                    hsl(280 30% 70% / 0.05) 50%,
                    transparent 70%
                  )
                `,
                filter: 'blur(8px)',
              }}
            />
            <div className="relative z-10 h-full">
              <ParticleTextEffect 
                words={["Leave Behind Words", "That light the way"]}
                fontSize={63}
                fontFamily="Georgia, serif"
                centered={true}
              />
            </div>
          </div>
          
          {/* Supporting Paragraph - Smaller, centered */}
          <p className="text-sm md:text-base text-muted-foreground mb-8 leading-relaxed animate-fade-in-up animation-delay-200 max-w-md">
            Create heartfelt messages for your loved ones — secured, private, 
            and delivered gently when the time is right.
          </p>
          
          {/* CTA Buttons - Centered */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in-up animation-delay-400">
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
          
          {/* Trust Indicators - Centered */}
          <div className="flex flex-wrap justify-center gap-5 mb-10 animate-fade-in-up animation-delay-600">
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
          
          {/* Hero Image - Centered, 50% width */}
          <div className="relative animate-fade-in w-full flex justify-center">
            <div className="relative w-[80%] sm:w-[60%] lg:w-[50%] max-w-[500px] rounded-xl overflow-hidden shadow-lg shadow-foreground/10">
              <img 
                src={heroEnvelopes} 
                alt="Elegant sealed envelopes representing your legacy messages" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
