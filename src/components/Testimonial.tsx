import { Testimonials, Testimonial as TestimonialType } from "@/components/ui/testimonials";

const reflections: TestimonialType[] = [
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

const TestimonialSection = () => {
  return (
    <section className="py-12 bg-secondary/20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-4">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3 tracking-tight">
            What people say when they see it
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            These aren't testimonials. Just words of recognition.
            <br />
            EchoLight wasn't there when these moments happened—but it's here now.
          </p>
        </div>
        <Testimonials 
          testimonials={reflections}
          title=""
        />
      </div>
    </section>
  );
};

export default TestimonialSection;
