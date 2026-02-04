import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Lock, Clock } from "lucide-react";
import heroVideo from "@/assets/hero-video.mp4";

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
          
          {/* Headline - Static Text */}
          <div className="mb-4 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-tight">
              Leave Behind Words
            </h1>
            <p className="text-3xl md:text-4xl lg:text-5xl font-serif text-primary mt-2">
              That Light The Way
            </p>
          </div>
          
          {/* Supporting Paragraph - Smaller, centered */}
          <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed animate-fade-in-up animation-delay-200 max-w-lg">
            Create heartfelt messages for your loved ones — secured, private, 
            and delivered gently when the time is right.
          </p>
          
          {/* CTA Buttons - Centered */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in-up animation-delay-400">
            <Button variant="premium" size="xl" asChild className="min-w-[220px] px-8">
              <Link to="/vault/compose">Begin Your Legacy</Link>
            </Button>
            <Button variant="trust" size="lg" asChild className="min-w-[220px] px-8">
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
          
          {/* Hero Video - Centered, ~62% width (25% larger than 50%) */}
          <div className="relative animate-fade-in w-full flex justify-center">
            <div className="relative w-[100%] sm:w-[75%] lg:w-[62%] max-w-[625px] rounded-xl overflow-hidden shadow-lg shadow-foreground/10">
              <video
                src={heroVideo}
                className="w-full h-auto object-cover"
                playsInline
                muted
                autoPlay
                loop
                preload="auto"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
