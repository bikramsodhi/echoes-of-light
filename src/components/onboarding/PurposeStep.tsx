import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Heart, Shield, Clock } from 'lucide-react';

interface PurposeStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function PurposeStep({ onNext, onBack }: PurposeStepProps) {
  const features = [
    {
      icon: Heart,
      title: 'Create meaningful messages',
      description: 'Write letters, record videos, or leave voice memos for the people who matter most.',
    },
    {
      icon: Clock,
      title: 'Deliver when the time is right',
      description: 'Schedule messages for birthdays, anniversaries, or when you\'re no longer here.',
    },
    {
      icon: Shield,
      title: 'Keep them safe until then',
      description: 'Your messages stay private and secure, delivered only when you choose.',
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
          That's what EchoLight is for.
        </h2>
        <p className="text-lg text-foreground/70 font-medium max-w-md mx-auto mb-3">
          Messages that wait. Words that stay. Love that arrives, even when you can't.
        </p>
        <p className="text-muted-foreground max-w-md mx-auto">
          Think of it as a gentle vault for the words you want to leave behind — 
          delivered with care, when the moment is right.
        </p>
      </div>

      <div className="grid gap-4 mb-8">
        {features.map((feature, index) => (
          <Card 
            key={feature.title} 
            className="p-6 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={onNext}>
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
