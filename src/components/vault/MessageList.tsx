import { useNavigate } from 'react-router-dom';
import MessageCard from './MessageCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Message = Tables<'messages'>;
type Recipient = Tables<'recipients'>;
type MessageRecipient = Tables<'message_recipients'>;

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  recipients: Recipient[];
  messageRecipients: MessageRecipient[];
}

export default function MessageList({ messages, isLoading, recipients, messageRecipients }: MessageListProps) {
  const navigate = useNavigate();

  const getRecipientsForMessage = (messageId: string) => {
    const recipientIds = messageRecipients
      .filter(mr => mr.message_id === messageId)
      .map(mr => mr.recipient_id);
    return recipients.filter(r => recipientIds.includes(r.id));
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-serif text-xl text-foreground mb-2">No messages yet</h3>
        <p className="text-muted-foreground max-w-sm mx-auto mb-6">
          Your vault is waiting for your first message. What would you like to say?
        </p>
        <Button onClick={() => navigate('/vault/compose')} className="gap-2">
          <Plus className="h-4 w-4" />
          Write Your First Message
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map(message => (
        <MessageCard
          key={message.id}
          message={message}
          recipients={getRecipientsForMessage(message.id)}
          onClick={() => navigate(`/vault/compose/${message.id}`)}
        />
      ))}
    </div>
  );
}
