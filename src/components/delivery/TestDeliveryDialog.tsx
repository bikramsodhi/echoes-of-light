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
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
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
  const { user } = useAuth();

  const handleSendTest = async () => {
    if (!user?.email) {
      toast.error('No email address found for your account');
      return;
    }

    setIsSending(true);
    
    try {
      // Get the user's profile for their name
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      const senderName = profile?.full_name || 'EchoLight User';

      // Get or create a message_recipient entry for the test
      let { data: messageRecipient } = await supabase
        .from('message_recipients')
        .select('delivery_token')
        .eq('message_id', message.id)
        .limit(1)
        .single();

      // If no message_recipient exists, we need at least one recipient assigned
      if (!messageRecipient && recipients.length > 0) {
        const { data: newMr } = await supabase
          .from('message_recipients')
          .insert({
            message_id: message.id,
            recipient_id: recipients[0].id,
          })
          .select('delivery_token')
          .single();
        messageRecipient = newMr;
      }

      const accessLink = messageRecipient?.delivery_token 
        ? `${window.location.origin}/portal?token=${messageRecipient.delivery_token}`
        : `${window.location.origin}/portal`;

      // Call the send-email edge function
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'message_delivery',
          recipientName: senderName, // Send to self
          recipientEmail: user.email,
          senderName: senderName,
          messageTitle: message.title || 'A message for you',
          accessLink: accessLink,
        },
      });

      if (error) throw error;

      toast.success('Test email sent! Check your inbox.');
      onSendTest?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Failed to send test email:', error);
      toast.error(error.message || 'Failed to send test email');
    } finally {
      setIsSending(false);
    }
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
