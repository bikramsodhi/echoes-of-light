import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import DeliveryAnimation from './DeliveryAnimation';
import { Heart, Mail, Users } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Recipient = Tables<'recipients'>;

interface DeliveryConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipients: Recipient[];
  onConfirm: () => Promise<void>;
  messageTitle?: string;
}

export default function DeliveryConfirmation({
  open,
  onOpenChange,
  recipients,
  onConfirm,
  messageTitle,
}: DeliveryConfirmationProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      // Reset state when dialog closes
      setStatus('idle');
      setError(null);
    }
  }, [open]);

  const handleConfirm = async () => {
    setStatus('sending');
    setError(null);
    
    try {
      await onConfirm();
      setStatus('sent');
    } catch (err) {
      setError('Something interrupted the moment. Please try again.');
      setStatus('idle');
    }
  };

  const handleComplete = () => {
    setTimeout(() => onOpenChange(false), 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-serif">
            {status === 'sent' ? 'Message Delivered' : 'Ready to Send'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {status === 'sent' 
              ? 'Your words have found their way'
              : 'This message will be delivered with care'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-8 flex flex-col items-center gap-6">
          <DeliveryAnimation status={status} onComplete={handleComplete} />

          {status === 'idle' && (
            <>
              {/* Message preview */}
              {messageTitle && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Sending</p>
                  <p className="font-medium">{messageTitle}</p>
                </div>
              )}

              {/* Recipients list */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>
                  To {recipients.length} recipient{recipients.length !== 1 ? 's' : ''}
                  {recipients.length > 0 && `: ${recipients.map(r => r.name).join(', ')}`}
                </span>
              </div>

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
            </>
          )}

          {status === 'sending' && (
            <p className="text-sm text-muted-foreground animate-pulse">
              Delivering with care...
            </p>
          )}

          {status === 'sent' && (
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Mail className="h-4 w-4" />
                <span className="text-sm font-medium">Successfully delivered</span>
              </div>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Heart className="h-3 w-3 text-rose-400" />
                Your words will bring comfort
              </p>
            </div>
          )}
        </div>

        {status === 'idle' && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Not yet
            </Button>
            <Button onClick={handleConfirm} className="flex-1">
              Send Now
            </Button>
          </div>
        )}

        {status === 'sent' && (
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Done
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
