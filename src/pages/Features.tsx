import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Mail, 
  Users, 
  Calendar, 
  Shield, 
  Sparkles, 
  Heart,
  Lock,
  Eye,
  Bell,
  FileText,
  Mic,
  Video,
  Image,
  ArrowRight
} from "lucide-react";

const features = [
  {
    icon: Mail,
    title: "Message Vault",
    tagline: "Your memories, preserved with intention",
    description: "A private sanctuary for your most meaningful words. Write letters, record voice memos, capture videos, and save photos — all organized and waiting for the perfect moment.",
    details: [
      { icon: FileText, text: "Text letters with rich formatting" },
      { icon: Mic, text: "Voice memos that capture your tone" },
      { icon: Video, text: "Video messages for face-to-face connection" },
      { icon: Image, text: "Photos and documents with context" },
    ],
  },
  {
    icon: Users,
    title: "Recipient Profiles",
    tagline: "The right words to the right hearts",
    description: "Create thoughtful profiles for each person you want to reach. Organize messages by recipient, add personal notes, and ensure every word finds its intended destination.",
    details: [
      { icon: Heart, text: "Relationship context for each recipient" },
      { icon: Mail, text: "Multiple messages per person" },
      { icon: Eye, text: "Preview how they'll receive your words" },
      { icon: Bell, text: "Delivery preferences per recipient" },
    ],
  },
  {
    icon: Calendar,
    title: "Scheduled Delivery",
    tagline: "Your presence, felt across time",
    description: "Set messages to arrive on birthdays, anniversaries, graduations, or any milestone that matters. Your voice can reach them exactly when they need it most.",
    details: [
      { icon: Calendar, text: "Date-based milestone delivery" },
      { icon: Bell, text: "Event-triggered messages" },
      { icon: Eye, text: "Self-test preview before delivery" },
      { icon: Heart, text: "Recurring annual messages" },
    ],
  },
  {
    icon: Shield,
    title: "Legacy Verification",
    tagline: "Delivered with dignity, when the time is right",
    description: "Trusted contacts you choose will verify when it's time. A thoughtful consensus system ensures your messages are delivered securely and with the care they deserve.",
    details: [
      { icon: Users, text: "Multiple trusted contacts" },
      { icon: Lock, text: "Minimum 2-person verification" },
      { icon: Shield, text: "Dispute resolution built-in" },
      { icon: Heart, text: "Gentle, respectful process" },
    ],
  },
  {
    icon: Sparkles,
    title: "Reflective Guide",
    tagline: "Finding the right words, together",
    description: "An optional AI companion that helps you explore your thoughts with gentle prompts. Never intrusive, never finishing your sentences — just thoughtful questions that inspire reflection.",
    details: [
      { icon: Sparkles, text: "Emotionally intelligent prompts" },
      { icon: Heart, text: "Adapts to your emotional context" },
      { icon: FileText, text: "Poetic scaffolding, not completion" },
      { icon: Eye, text: "Always optional, always supportive" },
    ],
  },
  {
    icon: Heart,
    title: "Last Wishes",
    tagline: "Because some words are meant to comfort",
    description: "Optional space for your final thoughts, practical guidance, or words of comfort. A private document that helps those you love navigate what comes next.",
    details: [
      { icon: FileText, text: "Personal farewell messages" },
      { icon: Lock, text: "Encrypted and private" },
      { icon: Users, text: "Delivered to chosen recipients" },
      { icon: Heart, text: "Peace of mind for everyone" },
    ],
  },
];

const Features = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6 animate-fade-in">
            A Space of Memory & Meaning
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Everything you need to create, preserve, and share your most important messages — 
            designed with care, privacy, and emotional intelligence at every step.
          </p>
        </div>
      </section>

      {/* Features List */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-24">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}
              >
                {/* Content Side */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-primary uppercase tracking-wide">
                      {feature.tagline}
                    </span>
                  </div>
                  
                  <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                    {feature.title}
                  </h2>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Details Card */}
                <div className="flex-1 w-full">
                  <div className="bg-card border border-border/50 rounded-2xl p-8 space-y-4">
                    {feature.details.map((detail, i) => (
                      <div 
                        key={i}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                          <detail.icon className="w-5 h-5 text-primary/70" />
                        </div>
                        <span className="text-foreground">{detail.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Promise */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-4xl text-center">
          <Lock className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">
            Built on Trust & Privacy
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Your messages are encrypted and private. We never read your content, sell your data, 
            or compromise your trust. EchoLight exists to serve your legacy — nothing else.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>End-to-end encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <span>Zero-knowledge privacy</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <span>Your data, your control</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">
            Ready to Begin?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start preserving your most meaningful messages today.
          </p>
          <Link to="/auth">
            <Button size="lg" className="gap-2">
              Create Your EchoLight
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
