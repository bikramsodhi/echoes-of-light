import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useDashboardData() {
  const { user } = useAuth();

  const { data: messageCounts, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messageCounts', user?.id],
    queryFn: async () => {
      if (!user) return { drafts: 0, scheduled: 0, sent: 0 };

      const { data, error } = await supabase
        .from('messages')
        .select('status')
        .eq('user_id', user.id);

      if (error) throw error;

      return {
        drafts: data?.filter(m => m.status === 'draft').length || 0,
        scheduled: data?.filter(m => m.status === 'scheduled').length || 0,
        sent: data?.filter(m => m.status === 'sent').length || 0,
      };
    },
    enabled: !!user,
  });

  const { data: recipientCount, isLoading: isLoadingRecipients } = useQuery({
    queryKey: ['recipientCount', user?.id],
    queryFn: async () => {
      if (!user) return 0;

      const { count, error } = await supabase
        .from('recipients')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
  });

  const { data: recentMessages, isLoading: isLoadingRecentMessages } = useQuery({
    queryKey: ['recentMessages', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('messages')
        .select('id, title, status, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const { data: recentRecipients, isLoading: isLoadingRecentRecipients } = useQuery({
    queryKey: ['recentRecipients', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('recipients')
        .select('id, name, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Build activity feed from messages and recipients
  const activities = [
    ...(recentMessages?.map(m => ({
      id: m.id,
      type: m.status === 'sent' ? 'message_sent' as const : 
            m.status === 'scheduled' ? 'message_scheduled' as const : 
            'message_updated' as const,
      title: m.title || 'Untitled message',
      timestamp: new Date(m.updated_at || m.created_at),
    })) || []),
    ...(recentRecipients?.map(r => ({
      id: r.id,
      type: 'recipient_added' as const,
      title: r.name,
      timestamp: new Date(r.created_at),
    })) || []),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5);

  const isLoading = isLoadingMessages || isLoadingRecipients || isLoadingRecentMessages || isLoadingRecentRecipients;

  return {
    messageCounts: messageCounts || { drafts: 0, scheduled: 0, sent: 0 },
    recipientCount: recipientCount || 0,
    activities,
    isLoading,
  };
}
