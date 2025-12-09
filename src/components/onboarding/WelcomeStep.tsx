import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="text-center animate-fade-in">
      <div className="mb-8">
        <div className="inline-flex p-4 rounded-full bg-primary/10 mb-6">
          <Sparkles className="h-12 w-12 text-primary animate-pulse-soft" />
        </div>
        
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
          This is your space to leave
          <span className="text-gradient-primary"> light </span>
          behind
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
          A place where your words, your voice, and your heart can reach the people 
          you love — even when you can't be there.
        </p>
      </div>
      
      <div className="flex flex-col items-center gap-4">
        <Button size="lg" onClick={onNext} className="px-8">
          Begin your journey
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        
        <p className="text-sm text-muted-foreground">
          Takes about 2 minutes
        </p>
      </div>
    </div>
  );
}
