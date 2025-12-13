import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Send, Sparkles } from 'lucide-react';

interface DeliveryAnimationProps {
  status: 'idle' | 'sending' | 'sent';
  onComplete?: () => void;
}

export default function DeliveryAnimation({ status, onComplete }: DeliveryAnimationProps) {
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    if (status === 'sent') {
      setShowSparkles(true);
      const timer = setTimeout(() => {
        setShowSparkles(false);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, onComplete]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Main icon container */}
      <div
        className={cn(
          "relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-500",
          status === 'idle' && "bg-muted",
          status === 'sending' && "bg-primary/20 animate-pulse",
          status === 'sent' && "bg-emerald-100 dark:bg-emerald-900/30"
        )}
      >
        {/* Ripple effect for sent state */}
        {status === 'sent' && (
          <>
            <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
            <div 
              className="absolute inset-0 rounded-full bg-emerald-400/10" 
              style={{ animation: 'pulse 1.5s ease-in-out infinite' }}
            />
          </>
        )}

        {/* Icon */}
        {status === 'idle' && (
          <Send className="h-6 w-6 text-muted-foreground" />
        )}
        {status === 'sending' && (
          <Send className="h-6 w-6 text-primary animate-bounce" />
        )}
        {status === 'sent' && (
          <Check className="h-6 w-6 text-emerald-600 dark:text-emerald-400 animate-scale-in" />
        )}
      </div>

      {/* Sparkle effects */}
      {showSparkles && (
        <>
          <Sparkles 
            className="absolute -top-2 -right-2 h-4 w-4 text-amber-400 animate-fade-in" 
            style={{ animationDelay: '100ms' }}
          />
          <Sparkles 
            className="absolute -bottom-1 -left-3 h-3 w-3 text-amber-300 animate-fade-in" 
            style={{ animationDelay: '300ms' }}
          />
          <Sparkles 
            className="absolute top-0 left-0 h-3 w-3 text-primary/60 animate-fade-in" 
            style={{ animationDelay: '200ms' }}
          />
        </>
      )}
    </div>
  );
}
