import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Testimonials, Testimonial } from "@/components/ui/testimonials";

const reflections: Testimonial[] = [
  {
    quote: "I wish I'd had this",
    description: "When my dad passed, I scrambled to find his old emails. I would've treasured something like this.",
  },
  {
    quote: "She left voicemails",
    description: "She used to leave me voicemails. I wish there was a place where she could've said everything she wanted to.",
  },
  {
    quote: "We meant to write",
    description: "We always meant to write each other something. EchoLight would've helped me start.",
  },
  {
    quote: "Things left unsaid",
    description: "There are things I still wish my mom had told me. A space like this might've made it easier for her.",
  },
  {
    quote: "You don't know until you need it",
    description: "It's the kind of thing you don't know you need—until you really do.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Founder's Note Section */}
        <section className="py-20 md:py-28">
          <div className="container px-4 md:px-6 max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none space-y-6">
              <p className="font-serif text-2xl md:text-3xl text-foreground leading-relaxed">
                Some words aren't meant for right now.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                They're meant for someday. For a moment that might come after we're gone.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                A birthday. A hard week. A time when someone we love needs to hear our voice again.
              </p>
              
              <p className="text-lg text-foreground leading-relaxed font-medium">
                EchoLight was created for those moments.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Not to focus on death—but on what still matters after. Love. Meaning. Presence.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                This is a place to leave what you didn't get to say. Or what you always meant to.
              </p>
              
              <div className="py-6" />
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                I made EchoLight because I've lost people I still wish I could hear from.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                And I've loved people I don't ever want to leave wondering.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                If this helps even one message find the right person at the right time, it's worth it.
              </p>
              
              <div className="pt-8">
                <p className="text-foreground">
                  — <span className="font-medium">The EchoLight Team</span>
                </p>
                <p className="text-muted-foreground text-sm">
                  Creator of EchoLight
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Emotional Reflections Section */}
        <section className="bg-primary/10 py-16">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="text-center pb-4">
              <p className="text-sm italic text-muted-foreground leading-relaxed max-w-xl mx-auto">
                These aren't testimonials.
                <br />
                Just real words from people who've known loss—and recognize what EchoLight could have meant.
              </p>
            </div>
            <Testimonials 
              testimonials={reflections}
              title="What people say when they see it"
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
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