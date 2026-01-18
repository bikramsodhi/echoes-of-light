import { Vault, Mic, CalendarClock, Shield } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create Your Private Vault",
    description: "Sign up with bank-level encryption. Your messages are protected from the moment you begin.",
    icon: Vault,
  },
  {
    number: "02",
    title: "Record Your Memories",
    description: "Write letters, record voice messages, upload photos and videos. Take all the time you need.",
    icon: Mic,
  },
  {
    number: "03",
    title: "Set Delivery Conditions",
    description: "Choose exactly when and how each message is delivered. Specific dates, milestones, or trusted contact verification.",
    icon: CalendarClock,
  },
  {
    number: "04",
    title: "Rest with Peace of Mind",
    description: "Your words are encrypted and waiting. When the time comes, they'll arrive gently to those you love.",
    icon: Shield,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-28 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-5 tracking-tight">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
            A thoughtful process designed for reflection, not urgency. 
            Your legacy, protected at every step.
          </p>
        </div>
        
        {/* Steps Grid - Card Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.number}
                className="group relative"
              >
                <div className="card-elegant rounded-xl p-8 h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  {/* Step Number */}
                  <span className="text-xs font-semibold text-primary/50 tracking-widest mb-4 block">
                    STEP {step.number}
                  </span>
                  
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105">
                    <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-serif text-xl text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
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