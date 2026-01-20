import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Lock, Clock } from "lucide-react";
import { ParticleTextEffect } from "@/components/ui/particle-text-effect";
import heroEnvelopes from "@/assets/hero-envelopes.png";

const Hero = () => {
  return (
    <section className="relative bg-background">
      {/* Main Hero - Left/Right Split */}
      <div className="container mx-auto px-6 pt-20 pb-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Left Side - Content */}
          <div className="order-2 lg:order-1 max-w-xl">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/60 border border-border/50 mb-6 animate-fade-in">
              <Lock className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
              <span className="text-sm text-muted-foreground font-medium">Private & Secure • End-to-End Encrypted</span>
            </div>
            
            {/* Headline - Particle Text Effect - Expanded container */}
            <div className="mb-5 animate-fade-in-up h-[100px] md:h-[120px] lg:h-[140px] w-full">
              <ParticleTextEffect 
                words={["Leave Behind Words", "That light the way"]}
                fontSize={42}
                fontFamily="Georgia, serif"
              />
            </div>
            
            {/* Supporting Paragraph - Professional, smaller */}
            <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed animate-fade-in-up animation-delay-200 max-w-md">
              Create heartfelt messages for your loved ones — secured, private, 
              and delivered gently when the time is right.
            </p>
            
            {/* CTA Buttons */}
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
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-5 animate-fade-in-up animation-delay-600">
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
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-square">
              <img 
                src={heroEnvelopes} 
                alt="Elegant sealed envelopes representing your legacy messages" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
