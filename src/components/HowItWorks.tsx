import { Vault, Mic, CalendarClock, Heart } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create Your Vault",
    description: "Sign up and begin your private space. Add recipients, organize your thoughts, and take your time.",
    icon: Vault,
  },
  {
    number: "02",
    title: "Record Your Memories",
    description: "Write letters, record voice messages, upload photos and videos. Our gentle guide is here if you need inspiration.",
    icon: Mic,
  },
  {
    number: "03",
    title: "Assign & Schedule",
    description: "Choose who receives each message. Set delivery for specific dates or when your trusted contact confirms.",
    icon: CalendarClock,
  },
  {
    number: "04",
    title: "Rest Easy",
    description: "Your words are protected and safe. When the time comes, your messages will find their way — gently.",
    icon: Heart,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            How EchoLight Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A gentle process designed for reflection, not urgency.
          </p>
        </div>
        
        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.number}
                className="flex gap-6 md:gap-10 mb-12 last:mb-0 group"
              >
                {/* Step Number & Icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/10">
                    <Icon className="w-7 h-7 text-primary transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-px h-12 bg-gradient-to-b from-primary/30 to-transparent mx-auto mt-4" />
                  )}
                </div>
                
                {/* Step Content */}
                <div className="pt-3">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-medium text-primary/60 tracking-wider">{step.number}</span>
                    <h3 className="font-serif text-xl text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
