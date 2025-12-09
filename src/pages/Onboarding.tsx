import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import WelcomeStep from '@/components/onboarding/WelcomeStep';
import PurposeStep from '@/components/onboarding/PurposeStep';
import InspirationStep from '@/components/onboarding/InspirationStep';
import GetStartedStep from '@/components/onboarding/GetStartedStep';
import { Progress } from '@/components/ui/progress';
import { Sparkles } from 'lucide-react';

const TOTAL_STEPS = 4;

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    navigate('/dashboard');
  };

  const handleComplete = async () => {
    await completeOnboarding();
    navigate('/dashboard');
  };

  const completeOnboarding = async () => {
    if (!user) return;
    
    // Update profile to mark onboarding as complete
    await supabase
      .from('profiles')
      .update({ onboarding_completed: true })
      .eq('id', user.id);
  };

  const progressValue = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl text-foreground">EchoLight</span>
          </div>
          <button 
            onClick={handleSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip to dashboard
          </button>
        </div>
      </header>

      {/* Progress */}
      <div className="container mx-auto px-4 py-4 max-w-2xl">
        <Progress value={progressValue} className="h-1" />
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Step {currentStep} of {TOTAL_STEPS}
        </p>
      </div>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-2xl">
          {currentStep === 1 && (
            <WelcomeStep onNext={handleNext} />
          )}
          {currentStep === 2 && (
            <PurposeStep onNext={handleNext} onBack={handleBack} />
          )}
          {currentStep === 3 && (
            <InspirationStep onNext={handleNext} onBack={handleBack} />
          )}
          {currentStep === 4 && (
            <GetStartedStep onComplete={handleComplete} onBack={handleBack} />
          )}
        </div>
      </main>
    </div>
  );
}
