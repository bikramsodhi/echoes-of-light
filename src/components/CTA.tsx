import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Lock, Shield, Clock, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-28">
      <div className="container mx-auto px-6">
        <div className="relative max-w-4xl mx-auto rounded-2xl bg-gradient-to-br from-primary/5 via-secondary/50 to-accent/10 border border-border/60 p-14 md:p-20 text-center overflow-hidden">
          {/* Subtle decorative elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 border border-border/50 mb-8">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm text-muted-foreground">Free to start • No credit card required</span>
            </div>
            
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-5 tracking-tight">
              Your Words Matter
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Start preserving your memories today. Your loved ones will thank you — 
              even if they can't tell you themselves.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Button variant="premium" size="xl" asChild className="min-w-[200px]">
                <Link to="/auth">Create Your Legacy</Link>
              </Button>
              <Button variant="gentle" size="xl" asChild>
                <Link to="/how-it-works">Learn More</Link>
              </Button>
            </div>
            
            {/* Security features */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary/70" />
                <span>End-to-End Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary/70" />
                <span>Your Privacy Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary/70" />
                <span>You Control the Timeline</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;