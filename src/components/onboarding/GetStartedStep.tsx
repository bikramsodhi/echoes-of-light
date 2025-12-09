import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Users, PenLine, Sparkles } from 'lucide-react';

interface GetStartedStepProps {
  onComplete: () => void;
  onBack: () => void;
}

export default function GetStartedStep({ onComplete, onBack }: GetStartedStepProps) {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
          You're ready to begin
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Take your time. There's no rush. Your words will wait.
        </p>
      </div>

      <Card className="p-6 mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <h3 className="font-serif text-lg text-foreground mb-4">Here's what you can do next:</h3>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Add your first recipient</p>
              <p className="text-sm text-muted-foreground">
                Who would you like to leave a message for?
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-accent/20 mt-0.5">
              <PenLine className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">Write your first message</p>
              <p className="text-sm text-muted-foreground">
                Start with a simple letter — even a few sentences.
              </p>
            </div>
          </li>
        </ul>
      </Card>

      <div className="text-center mb-8">
        <p className="text-sm text-muted-foreground italic">
          "Because even after you're gone, your voice echoes in the light."
        </p>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button size="lg" onClick={onComplete} className="px-8">
          Enter your space
        </Button>
      </div>
    </div>
  );
}
