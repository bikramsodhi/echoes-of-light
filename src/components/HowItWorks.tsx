const steps = [
  {
    number: "01",
    title: "Create Your Vault",
    description: "Sign up and begin your private space. Add recipients, organize your thoughts, and take your time.",
  },
  {
    number: "02",
    title: "Record Your Memories",
    description: "Write letters, record voice messages, upload photos and videos. Our gentle guide is here if you need inspiration.",
  },
  {
    number: "03",
    title: "Assign & Schedule",
    description: "Choose who receives each message. Set delivery for specific dates or when your trusted contact confirms.",
  },
  {
    number: "04",
    title: "Rest Easy",
    description: "Your words are encrypted and safe. When the time comes, your messages will find their way — gently.",
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
          {steps.map((step, index) => (
            <div 
              key={step.number}
              className="flex gap-6 md:gap-10 mb-12 last:mb-0"
            >
              {/* Step Number */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20">
                  <span className="font-serif text-2xl text-primary">{step.number}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-px h-12 bg-gradient-to-b from-primary/30 to-transparent mx-auto mt-4" />
                )}
              </div>
              
              {/* Step Content */}
              <div className="pt-3">
                <h3 className="font-serif text-xl text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
