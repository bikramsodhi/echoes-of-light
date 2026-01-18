import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-light.png";
import { Shield, Lock, Clock, FileText, Calendar, CheckCircle } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Background - Subtle gradient with reduced image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/30" />
        <img 
          src={heroImage} 
          alt="Peaceful light symbolizing legacy" 
          className="w-full h-full object-cover opacity-40 mix-blend-soft-light"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/60 border border-border/50 mb-10 animate-fade-in backdrop-blur-sm">
            <Lock className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
            <span className="text-sm text-muted-foreground font-medium">Private & Secure • End-to-End Encrypted</span>
          </div>
          
          {/* Headline - Elegant serif with clear hierarchy */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-6 animate-fade-in-up leading-[1.1] tracking-tight">
            <span className="text-foreground">Leave Behind Words</span>
            <br />
            <span className="text-primary/80 text-4xl md:text-5xl lg:text-6xl font-normal italic">that light the way</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Create heartfelt messages for your loved ones — secured, private, 
            and delivered gently when the time is right.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up animation-delay-400">
            <Button variant="premium" size="xl" asChild className="min-w-[200px]">
              <Link to="/vault/compose">Begin Your Legacy</Link>
            </Button>
            <Button variant="trust" size="lg" asChild>
              <Link to="/security" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                See How We Protect Your Words
              </Link>
            </Button>
          </div>
          
          {/* Trust Indicators Row */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 animate-fade-in-up animation-delay-600">
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-success" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium">Bank-Level Security</span>
            </div>
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="w-4 h-4 text-primary" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium">You Control Access</span>
            </div>
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <Clock className="w-4 h-4 text-accent-foreground" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium">Delivered On Your Terms</span>
            </div>
          </div>
        </div>
        
        {/* Deeper Purpose */}
        <div className="mt-20 max-w-2xl mx-auto text-center animate-fade-in-up animation-delay-800">
          <p className="text-lg md:text-xl text-foreground/70 italic font-serif mb-3">
            "What if you could say what mattered—when you're not around to say it?"
          </p>
          <p className="text-base text-muted-foreground">
            Messages that wait. Words that stay. Love that arrives, even when you can't.
          </p>
        </div>
      </div>
      
      {/* Grounding Element - Message Preview Card */}
      <div className="relative z-10 w-full max-w-md mx-auto mt-16 px-6 animate-fade-in-up animation-delay-800">
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
    </section>
  );
};

export default Hero;