import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

interface OnboardingPromptProps {
  onDismiss?: () => void;
}

export default function OnboardingPrompt({ onDismiss }: OnboardingPromptProps) {
  const navigate = useNavigate();

  return (
    <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-background shadow-lg animate-fade-in">
      {/* Soft glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-50" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <CardContent className="relative p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          {/* Icon */}
          <div className="flex-shrink-0 p-3 rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="h-8 w-8" />
          </div>
          
          {/* Content */}
          <div className="flex-1 space-y-2">
            <h3 className="font-serif text-xl md:text-2xl text-foreground">
              Set Up Your EchoLight
            </h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Take a moment to personalize your space. We'll guide you through creating 
              a meaningful experience for preserving your memories.
            </p>
          </div>
          
          {/* Action */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              onClick={() => navigate('/onboarding')}
              className="flex-1 md:flex-none min-h-[44px] px-6 gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200"
            >
              <span>Continue Setup</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            {onDismiss && (
              <Button
                variant="ghost"
                onClick={onDismiss}
                className="min-h-[44px] text-muted-foreground hover:text-foreground"
              >
                Later
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
