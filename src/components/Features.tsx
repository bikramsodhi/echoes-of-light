import { Mail, Users, Lock, Calendar, Sparkles, Heart } from "lucide-react";

const features = [
  {
    icon: Mail,
    title: "Message Vault",
    description: "A private space for letters, voice memos, videos, and photos. Your memories, preserved with intention.",
  },
  {
    icon: Users,
    title: "Recipient Profiles",
    description: "Create profiles for each loved one. Assign messages privately, ensuring the right words reach the right hearts.",
  },
  {
    icon: Calendar,
    title: "Scheduled Delivery",
    description: "Set messages for birthdays, anniversaries, or future milestones. Your presence, felt across time.",
  },
  {
    icon: Lock,
    title: "Legacy Verification",
    description: "A trusted contact verifies when it's time. Messages are delivered securely and with dignity.",
  },
  {
    icon: Sparkles,
    title: "Reflective Guide",
    description: "A gentle AI companion helps you find the right words. Never intrusive, always supportive.",
  },
  {
    icon: Heart,
    title: "Last Wishes",
    description: "Optional documents for your final thoughts. Because some words are meant to comfort.",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            A Space of Memory & Meaning
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Everything you need to create, preserve, and share your most important messages.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
