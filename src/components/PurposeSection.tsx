import { FileText, Calendar, CheckCircle } from "lucide-react";

const PurposeSection = () => {
  return (
    <section className="py-16 bg-navy">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Deeper Purpose */}
          <div className="text-center mb-16">
            <p className="text-xl md:text-2xl text-primary-foreground/90 italic font-serif mb-4">
              "What if you could say what mattered—when you're not around to say it?"
            </p>
            <p className="text-base text-primary-foreground/60 font-sans">
              Messages that wait. Words that stay. Love that arrives, even when you can't.
            </p>
          </div>
          
          {/* Message Preview Card */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-primary-foreground/5 border border-primary-foreground/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-foreground/80" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-medium text-primary-foreground">For Emma</span>
                    <span className="text-xs text-primary-foreground/40">•</span>
                    <span className="inline-flex items-center gap-1 text-xs text-success">
                      <CheckCircle className="w-3 h-3" />
                      Secured
                    </span>
                  </div>
                  <p className="text-sm text-primary-foreground/60 leading-relaxed line-clamp-2">
                    "I wanted you to know how proud I am of the person you've become..."
                  </p>
                  <div className="flex items-center gap-1.5 mt-3 text-xs text-primary-foreground/40">
                    <Calendar className="w-3 h-3" strokeWidth={1.5} />
                    <span>To be delivered on her 30th birthday</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PurposeSection;
