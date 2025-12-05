import { Quote } from "lucide-react";

const Testimonial = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-secondary/20 to-transparent">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Quote className="w-12 h-12 text-primary/30 mx-auto mb-6" />
          
          <blockquote className="font-serif text-2xl md:text-3xl text-foreground mb-8 leading-relaxed">
            "Writing these letters was like having one last conversation. 
            Knowing they'll receive my words, in my voice, brings me peace I didn't expect."
          </blockquote>
          
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent" />
            <div className="text-left">
              <p className="text-foreground font-medium">Margaret T.</p>
              <p className="text-muted-foreground text-sm">EchoLight member since 2024</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
