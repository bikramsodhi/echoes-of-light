import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Quote } from 'lucide-react';

interface InspirationStepProps {
  onNext: () => void;
  onBack: () => void;
}

const exampleMessages = [
  {
    title: 'A letter for her wedding day',
    preview: '"My darling daughter, as you step into this new chapter, I want you to know..."',
    recipient: 'To Emma, on her wedding day',
  },
  {
    title: 'A video for his 18th birthday',
    preview: '"Hey buddy, I\'m recording this because I want you to hear my voice..."',
    recipient: 'To Jake, when he turns 18',
  },
  {
    title: 'A note for when times get tough',
    preview: '"When you\'re reading this, you might be going through something hard..."',
    recipient: 'To my best friend, when she needs it',
  },
];

export default function InspirationStep({ onNext, onBack }: InspirationStepProps) {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
          Imagine what you could say
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Here are some ways others have used EchoLight to leave meaning behind.
        </p>
      </div>

      <div className="grid gap-4 mb-8">
        {exampleMessages.map((message, index) => (
          <Card 
            key={message.title} 
            className="p-6 border-border/50 bg-gradient-to-br from-card to-card/50 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-3 mb-3">
              <Quote className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-foreground mb-2">{message.title}</h3>
                <p className="text-sm text-muted-foreground italic">{message.preview}</p>
              </div>
            </div>
            <p className="text-xs text-primary/70 ml-7">{message.recipient}</p>
          </Card>
        ))}
      </div>

      <div className="text-center mb-8">
        <p className="text-sm text-muted-foreground">
          Your messages are yours alone. We're just here to help them find their way.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={onNext}>
          Almost there
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
