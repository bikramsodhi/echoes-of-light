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
    <section className="py-16 bg-secondary/30 relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-5 tracking-tight">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
            A thoughtful process designed for reflection, not urgency. 
            Your legacy, protected at every step.
          </p>
        </div>
        
        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.number}
                className="group relative"
              >
                <div className="bg-background border border-border/50 backdrop-blur-sm rounded-xl p-8 h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  {/* Step Number */}
                  <span className="text-xs font-semibold text-muted-foreground/60 tracking-widest mb-4 block uppercase">
                    Step {step.number}
                  </span>
                  
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105">
                    <Icon className="w-6 h-6 text-foreground/80" strokeWidth={1.5} />
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
