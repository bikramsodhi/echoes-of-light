import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="relative max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border border-primary/20 p-12 md:p-16 text-center overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              Your Words Matter
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Start preserving your memories today. Your loved ones will thank you — 
              even if they can't tell you themselves.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="warm" size="xl" asChild>
                <Link to="/auth">Create Your Legacy</Link>
              </Button>
              <Button variant="gentle" size="xl" asChild>
                <Link to="/auth">Learn More</Link>
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mt-8">
              Free to start • No credit card required • Your privacy, protected
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
