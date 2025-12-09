import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/layout/AppLayout';
import RecipientCard from '@/components/recipients/RecipientCard';
import RecipientDialog from '@/components/recipients/RecipientDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Users, Grid, List } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type Recipient = Tables<'recipients'>;

export default function Recipients() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);

  const { data: recipients = [], isLoading } = useQuery({
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

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('recipients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipients'] });
      toast.success('Recipient removed gently');
    },
    onError: () => {
      toast.error('Something interrupted the moment. Please try again.');
    },
  });

  const filteredRecipients = recipients.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.relationship?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (recipient: Recipient) => {
    setEditingRecipient(recipient);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingRecipient(null);
  };

  return (
    <AppLayout title="Recipients">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl text-foreground">Your Recipients</h1>
            <p className="text-muted-foreground mt-1">
              The people who will receive your messages
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Recipient
          </Button>
        </div>

        {/* Search and View Toggle */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or relationship..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className={viewMode === 'grid' 
            ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" 
            : "space-y-3"
          }>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className={viewMode === 'grid' ? "h-48" : "h-20"} />
            ))}
          </div>
        ) : filteredRecipients.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-serif text-xl text-foreground mb-2">
              {searchQuery ? 'No recipients found' : 'No recipients yet'}
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Who would you like to leave a message for? Add your first recipient to begin.'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Recipient
              </Button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" 
            : "space-y-3"
          }>
            {filteredRecipients.map((recipient) => (
              <RecipientCard
                key={recipient.id}
                recipient={recipient}
                viewMode={viewMode}
                onEdit={() => handleEdit(recipient)}
                onDelete={() => handleDelete(recipient.id)}
              />
            ))}
          </div>
        )}
      </div>

      <RecipientDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        recipient={editingRecipient}
      />
    </AppLayout>
  );
}
