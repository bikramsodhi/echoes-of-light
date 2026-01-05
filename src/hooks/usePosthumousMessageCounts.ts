import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface RecipientMessageCount {
  recipientId: string;
  recipientName: string;
  count: number;
}

/**
 * Hook to fetch message counts per recipient for posthumous delivery messages.
 * Used to determine when to show the Delivery Cadence UI.
 */
export function usePosthumousMessageCounts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['posthumous-message-counts', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Fetch all posthumous messages with their recipients
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('id')
        .eq('user_id', user.id)
        .eq('delivery_trigger', 'posthumous')
        .neq('status', 'sent');

      if (messagesError) throw messagesError;
      if (!messages || messages.length === 0) return [];

      const messageIds = messages.map((m) => m.id);

      // Fetch message_recipients for these messages
      const { data: messageRecipients, error: mrError } = await supabase
        .from('message_recipients')
        .select('message_id, recipient_id')
        .in('message_id', messageIds);

      if (mrError) throw mrError;
      if (!messageRecipients) return [];

      // Fetch recipient names
      const recipientIds = [...new Set(messageRecipients.map((mr) => mr.recipient_id))];
      const { data: recipients, error: recipientsError } = await supabase
        .from('recipients')
        .select('id, name')
        .in('id', recipientIds);

      if (recipientsError) throw recipientsError;

      // Count messages per recipient
      const countMap = new Map<string, number>();
      messageRecipients.forEach((mr) => {
        countMap.set(mr.recipient_id, (countMap.get(mr.recipient_id) || 0) + 1);
      });

      // Build result with recipient names
      const result: RecipientMessageCount[] = [];
      countMap.forEach((count, recipientId) => {
        const recipient = recipients?.find((r) => r.id === recipientId);
        if (recipient && count >= 1) {
          result.push({
            recipientId,
            recipientName: recipient.name,
            count,
          });
        }
      });

      return result;
    },
    enabled: !!user,
  });
}
