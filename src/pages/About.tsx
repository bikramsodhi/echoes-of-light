import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Clock, Users } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Compassion First',
    description: 'Every design decision is guided by empathy. We create calm, gentle experiences for life\'s most meaningful moments.',
  },
  {
    icon: Shield,
    title: 'Privacy & Trust',
    description: 'Your words are sacred. End-to-end encryption ensures your messages remain private until the right moment.',
  },
  {
    icon: Clock,
    title: 'Timeless Care',
    description: 'Messages held safely, delivered with intention. No rush, no pressure—just quiet, patient stewardship.',
  },
  {
    icon: Users,
    title: 'Human Connection',
    description: 'Technology should bring people closer. We help love transcend time and circumstance.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
              A quiet place to leave words, memories, and light
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              EchoLight was born from a simple belief: that the words we leave behind 
              can bring comfort, closure, and connection to those we love.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 md:px-6 max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <h2 className="font-serif text-3xl text-foreground text-center mb-8">
                Our Story
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We started EchoLight because we believe everyone deserves the chance to say 
                what matters most—even when they can't be there to say it in person.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Life is unpredictable. Sometimes the words we most want to share never 
                get spoken. A letter never written. A story never told. A goodbye 
                never said.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                EchoLight is a gentle space to capture those moments—to write the letters, 
                record the stories, and prepare the goodbyes. Not with urgency, but with 
                intention. Not with fear, but with love.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <h2 className="font-serif text-3xl text-foreground text-center mb-12">
              What We Believe
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container px-4 md:px-6 max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl text-foreground mb-4">
              Begin Your Journey
            </h2>
            <p className="text-muted-foreground mb-8">
              Start capturing the moments and messages that matter most.
            </p>
            <Button size="lg" asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
