import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Vault, Mic, CalendarClock, Heart, Shield, Users, Clock, Sparkles, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    title: "Create Your Vault",
    description: "Sign up and begin your private space. Add recipients, organize your thoughts, and take your time.",
    details: [
      "Set up your secure account with email or Google",
      "Create profiles for the people you want to reach",
      "Add notes and context to help you craft meaningful messages",
    ],
    icon: Vault,
  },
  {
    number: "02",
    title: "Record Your Memories",
    description: "Write letters, record voice messages, upload photos and videos. Our gentle guide is here if you need inspiration.",
    details: [
      "Write heartfelt letters with our distraction-free editor",
      "Record voice memos to share your actual voice",
      "Upload photos, videos, and documents that matter",
    ],
    icon: Mic,
  },
  {
    number: "03",
    title: "Assign & Schedule",
    description: "Choose who receives each message. Set delivery for specific dates or when your trusted contact confirms.",
    details: [
      "Assign messages to specific recipients",
      "Schedule delivery for birthdays, anniversaries, or milestones",
      "Set posthumous delivery through trusted contact verification",
    ],
    icon: CalendarClock,
  },
  {
    number: "04",
    title: "Rest Easy",
    description: "Your words are encrypted and safe. When the time comes, your messages will find their way — gently.",
    details: [
      "Messages are securely stored with encryption",
      "Trusted contacts verify delivery when the time comes",
      "Recipients receive your messages with care and privacy",
    ],
    icon: Heart,
  },
];

const features = [
  {
    icon: Mail,
    title: "Message Vault",
    description: "A private space for letters, voice memos, videos, and photos — preserved with intention.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "End-to-end encryption ensures only intended recipients can read your messages.",
  },
  {
    icon: Users,
    title: "Trusted Contacts",
    description: "Designate people you trust to verify and initiate delivery when needed.",
  },
  {
    icon: Clock,
    title: "Flexible Timing",
    description: "Schedule messages for specific dates or posthumous delivery — your choice.",
  },
  {
    icon: Sparkles,
    title: "Gentle Guidance",
    description: "Optional prompts help you reflect and craft meaningful messages.",
  },
  {
    icon: Heart,
    title: "Last Wishes",
    description: "Optional documents for your final thoughts — because some words are meant to comfort.",
  },
];

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6">
                How EchoLight Works
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                A gentle process designed for reflection, not urgency. Take your time to craft messages that matter — we'll ensure they reach the right people at the right moment.
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Steps */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div 
                    key={step.number}
                    className="flex flex-col md:flex-row gap-6 md:gap-10 mb-16 last:mb-0 group"
                  >
                    {/* Step Number & Icon */}
                    <div className="flex-shrink-0 flex md:flex-col items-center md:items-start gap-4 md:gap-0">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/10">
                        <Icon className="w-9 h-9 text-primary transition-transform duration-300 group-hover:scale-110" />
                      </div>
                      {index < steps.length - 1 && (
                        <div className="hidden md:block w-px h-24 bg-gradient-to-b from-primary/30 to-transparent mx-auto mt-6" />
                      )}
                    </div>
                    
                    {/* Step Content */}
                    <div className="flex-1 bg-card rounded-2xl p-6 md:p-8 border border-border/50 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-primary/20">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-medium text-primary/60 tracking-wider bg-primary/10 px-2 py-1 rounded-full">{step.number}</span>
                        <h3 className="font-serif text-2xl text-foreground">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-5 text-lg">{step.description}</p>
                      <ul className="space-y-3">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-3 text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Key Features Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl text-foreground mb-4">Built with Care</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Every feature is designed with your privacy and peace of mind at heart.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={feature.title}
                    className="p-6 rounded-2xl bg-card border border-border/50 text-center transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-serif text-lg text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                Ready to Begin?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Start your journey of meaningful connection. Take all the time you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
