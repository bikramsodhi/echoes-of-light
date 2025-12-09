import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/layout/AppLayout';
import RecipientFolder from '@/components/vault/RecipientFolder';
import MessageList from '@/components/vault/MessageList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Archive, FolderOpen } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Recipient = Tables<'recipients'>;
type Message = Tables<'messages'>;

export default function Vault() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'scheduled' | 'sent'>('all');
  const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(null);

  const { data: recipients = [], isLoading: recipientsLoading } = useQuery({
    queryKey: ['recipients', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipients')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Recipient[];
    },
    enabled: !!user,
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as Message[];
    },
    enabled: !!user,
  });

  const { data: messageRecipients = [] } = useQuery({
    queryKey: ['message_recipients', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('message_recipients')
        .select('*');
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const getMessagesForRecipient = (recipientId: string) => {
    const messageIds = messageRecipients
      .filter(mr => mr.recipient_id === recipientId)
      .map(mr => mr.message_id);
    return messages.filter(m => messageIds.includes(m.id));
  };

  const getUnassignedMessages = () => {
    const assignedMessageIds = new Set(messageRecipients.map(mr => mr.message_id));
    return messages.filter(m => !assignedMessageIds.has(m.id));
  };

  const filterMessages = (msgs: Message[]) => {
    let filtered = msgs;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(m => m.status === statusFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.title?.toLowerCase().includes(query) ||
        m.content?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  const displayMessages = selectedRecipientId === 'unassigned'
    ? filterMessages(getUnassignedMessages())
    : selectedRecipientId
      ? filterMessages(getMessagesForRecipient(selectedRecipientId))
      : filterMessages(messages);

  const selectedRecipient = recipients.find(r => r.id === selectedRecipientId);
  const isLoading = recipientsLoading || messagesLoading;

  return (
    <AppLayout title="Message Vault">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Recipient Folders */}
          <div className="lg:w-72 flex-shrink-0 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg text-foreground">Folders</h2>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => navigate('/recipients')}
                className="text-xs"
              >
                Manage
              </Button>
            </div>
            
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-14" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {/* All Messages */}
                <RecipientFolder
                  name="All Messages"
                  icon={<Archive className="h-4 w-4" />}
                  messageCount={messages.length}
                  isSelected={selectedRecipientId === null}
                  onClick={() => setSelectedRecipientId(null)}
                />
                
                {/* Recipient Folders */}
                {recipients.map(recipient => (
                  <RecipientFolder
                    key={recipient.id}
                    name={recipient.name}
                    relationship={recipient.relationship || undefined}
                    messageCount={getMessagesForRecipient(recipient.id).length}
                    isSelected={selectedRecipientId === recipient.id}
                    onClick={() => setSelectedRecipientId(recipient.id)}
                  />
                ))}
                
                {/* Unassigned */}
                {getUnassignedMessages().length > 0 && (
                  <RecipientFolder
                    name="Unassigned"
                    icon={<FolderOpen className="h-4 w-4" />}
                    messageCount={getUnassignedMessages().length}
                    isSelected={selectedRecipientId === 'unassigned'}
                    onClick={() => setSelectedRecipientId('unassigned')}
                  />
                )}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl text-foreground">
                  {selectedRecipientId === null 
                    ? 'All Messages'
                    : selectedRecipientId === 'unassigned'
                      ? 'Unassigned Messages'
                      : `Messages for ${selectedRecipient?.name}`}
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  {displayMessages.length} message{displayMessages.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Button onClick={() => navigate('/vault/compose')} className="gap-2">
                <Plus className="h-4 w-4" />
                New Message
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="draft">Drafts</TabsTrigger>
                  <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                  <TabsTrigger value="sent">Sent</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Messages */}
            <MessageList 
              messages={displayMessages} 
              isLoading={isLoading}
              recipients={recipients}
              messageRecipients={messageRecipients}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
