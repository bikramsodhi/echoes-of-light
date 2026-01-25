import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Lock, Shield, Clock, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-6 bg-background">
      <div className="container mx-auto px-6">
        <div className="relative max-w-3xl mx-auto rounded-xl bg-muted border border-border/40 p-10 md:p-12 text-center overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border/50 mb-5">
              <Sparkles className="w-4 h-4 text-accent-foreground" />
              <span className="text-sm text-muted-foreground">Free to start • No credit card required</span>
            </div>
            
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4 tracking-tight">
              Your Words Matter
            </h2>
            <p className="text-muted-foreground text-base mb-8 max-w-lg mx-auto leading-relaxed">
              Start preserving your memories today. Your loved ones will thank you — 
              even if they can't tell you themselves.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                variant="premium" 
                size="xl" 
                asChild 
                className="min-w-[180px]"
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
            <div className="flex flex-wrap justify-center gap-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>End-to-End Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Your Privacy Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
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
