import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Lock, Clock } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-background">
      {/* Main Hero - Left/Right Split */}
      <div className="container mx-auto px-6 pt-12 pb-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Left Side - Content */}
          <div className="order-2 lg:order-1 max-w-xl">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/60 border border-border/50 mb-6 animate-fade-in">
              <Lock className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
              <span className="text-sm text-muted-foreground font-medium">Private & Secure • End-to-End Encrypted</span>
            </div>
            
            {/* Headline - Strong serif */}
            <h1 className="mb-5 animate-fade-in-up leading-[1.1] tracking-tight">
              <span className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground">
                Leave Behind Words
              </span>
              <span className="block font-sans text-xl md:text-2xl lg:text-3xl font-light italic text-muted-foreground mt-3">
                that light the way
              </span>
            </h1>
            
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
          
          {/* Right Side - Image Placeholder */}
          <div className="order-1 lg:order-2 relative animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden bg-secondary/30 border border-border/30 aspect-[4/3] lg:aspect-square flex items-center justify-center">
              <span className="text-muted-foreground/50 text-sm">Hero image placeholder</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
