import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Lock, Shield, Clock, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-10 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="relative max-w-2xl mx-auto rounded-xl bg-muted/50 border border-border/30 p-8 md:p-10 text-center overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border/50 mb-4">
              <Sparkles className="w-3 h-3 text-accent-foreground" />
              <span className="text-xs text-muted-foreground">Free to start • No credit card required</span>
            </div>
            
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3 tracking-tight">
              Your Words Matter
            </h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto leading-relaxed">
              Start preserving your memories today. Your loved ones will thank you — 
              even if they can't tell you themselves.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Button 
                variant="premium" 
                size="lg" 
                asChild 
                className="min-w-[160px]"
              >
                <Link to="/auth">Create Your Legacy</Link>
              </Button>
              <Button 
                variant="ghost" 
                size="lg" 
                asChild
                className="text-muted-foreground hover:text-foreground"
              >
                <Link to="/how-it-works">Learn More</Link>
              </Button>
            </div>
            
            {/* Security features */}
            <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                <span>End-to-End Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3 h-3" />
                <span>Your Privacy Protected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
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
