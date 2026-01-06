const reflections = [
  "This would've helped me say goodbye.",
  "I didn't know how much I needed to hear her voice—until I couldn't.",
  "We always meant to write each other something.",
  "I wish this existed a year ago.",
];

const Testimonial = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-secondary/20 to-transparent">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-serif text-3xl text-foreground mb-4">
            What people say when they see it
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            These aren't testimonials. Just words of recognition.
            <br />
            EchoLight wasn't there when these moments happened—but it's here now.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-8">
          {reflections.map((quote, index) => (
            <blockquote 
              key={index}
              className="font-serif text-xl text-foreground/90 leading-relaxed text-center italic p-6"
            >
              "{quote}"
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;