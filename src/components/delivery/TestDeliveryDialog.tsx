import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, Send, Heart, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

type Message = Tables<'messages'>;
type Recipient = Tables<'recipients'>;

interface TestDeliveryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: Message;
  recipients: Recipient[];
  onSendTest?: () => void;
}

export default function TestDeliveryDialog({
  open,
  onOpenChange,
  message,
  recipients,
  onSendTest,
}: TestDeliveryDialogProps) {
  const [isSending, setIsSending] = useState(false);

  const handleSendTest = async () => {
    setIsSending(true);
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSending(false);
    onSendTest?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Preview Delivery
          </DialogTitle>
          <DialogDescription>
            See exactly what your recipients will receive
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 py-4">
            {/* Message Preview Card */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 bg-primary/5 border-b border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-xl text-foreground">
                      {message.title || 'A message for you'}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      From someone who loves you
                    </p>
                  </div>
                  <Heart className="h-5 w-5 text-primary fill-primary" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="prose prose-sm max-w-none">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {message.content || 'No content yet...'}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-muted/50 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  This message was written with love and care, to be delivered when the time was right.
                </p>
              </div>
            </div>

            <Separator />

            {/* Delivery Info */}
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Delivery Details</h4>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Recipients</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {recipients.length > 0 ? (
                        recipients.map(r => (
                          <Badge key={r.id} variant="secondary" className="text-xs">
                            {r.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No recipients assigned</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Delivery Trigger</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {message.delivery_trigger === 'posthumous' && 'After I pass'}
                      {message.delivery_trigger === 'scheduled' && (
                        message.delivery_date 
                          ? format(new Date(message.delivery_date), 'MMMM d, yyyy')
                          : message.delivery_event || 'Scheduled'
                      )}
                      {message.delivery_trigger === 'manual' && 'Manual delivery'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleSendTest} disabled={isSending} className="gap-2">
            <Send className="h-4 w-4" />
            {isSending ? 'Sending...' : 'Send Test to Myself'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
