import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Send, Search, Shield, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

type Message = Tables<'messages'>;

export default function Admin() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showDeliverDialog, setShowDeliverDialog] = useState(false);

  // Check if user is admin
  const { data: isAdmin, isLoading: adminLoading } = useQuery({
    queryKey: ['is_admin', user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      
      return !!data && !error;
    },
    enabled: !!user,
  });

  // Fetch all scheduled/ready messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['admin_messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .in('status', ['draft', 'scheduled'])
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Message[];
    },
    enabled: isAdmin === true,
  });

  // Fetch message recipients
  const { data: messageRecipients = [] } = useQuery({
    queryKey: ['admin_message_recipients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('message_recipients')
        .select(`
          message_id,
          recipient:recipients(id, name)
        `);
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin === true,
  });

  // Deliver mutation
  const deliverMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from('messages')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString(),
        })
        .eq('id', messageId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_messages'] });
      toast.success('Message delivered with care');
      setShowDeliverDialog(false);
      setSelectedMessage(null);
    },
    onError: () => {
      toast.error('Failed to deliver message');
    },
  });

  const getRecipientsForMessage = (messageId: string) => {
    return messageRecipients
      .filter(mr => mr.message_id === messageId)
      .map(mr => (mr.recipient as any)?.name)
      .filter(Boolean);
  };

  const filteredMessages = messages.filter(m => 
    m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (adminLoading) {
    return (
      <AppLayout title="Admin">
        <div className="flex items-center justify-center min-h-[400px]">
          <Skeleton className="h-8 w-32" />
        </div>
      </AppLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AppLayout title="Access Denied">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="font-serif text-2xl text-foreground mb-2">Access Restricted</h2>
          <p className="text-muted-foreground max-w-md">
            This area is reserved for administrators. If you believe you should have access, 
            please contact support.
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Admin Panel">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <Shield className="h-6 w-6 text-primary" />
          <div>
            <h2 className="font-medium text-foreground">Message Delivery Control</h2>
            <p className="text-sm text-muted-foreground">
              Review and trigger message deliveries for testing or legacy verification
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Messages Table */}
        {messagesLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No pending messages found</p>
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.map((message) => {
                  const recipients = getRecipientsForMessage(message.id);
                  
                  return (
                    <TableRow key={message.id}>
                      <TableCell className="font-medium">
                        {message.title || 'Untitled'}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {recipients.length > 0 ? (
                            recipients.slice(0, 2).map((name, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">None</span>
                          )}
                          {recipients.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{recipients.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={message.status === 'draft' ? 'secondary' : 'default'}
                          className="capitalize"
                        >
                          {message.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground capitalize">
                        {message.delivery_trigger}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {message.created_at && format(new Date(message.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedMessage(message);
                            setShowDeliverDialog(true);
                          }}
                          className="gap-1"
                        >
                          <Send className="h-3 w-3" />
                          Deliver
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Deliver Confirmation Dialog */}
      <AlertDialog open={showDeliverDialog} onOpenChange={setShowDeliverDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Confirm Delivery
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to deliver "{selectedMessage?.title || 'Untitled'}" to all assigned recipients.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedMessage && deliverMutation.mutate(selectedMessage.id)}
              disabled={deliverMutation.isPending}
            >
              {deliverMutation.isPending ? 'Delivering...' : 'Deliver Now'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
