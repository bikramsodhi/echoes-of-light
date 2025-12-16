import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, ShieldCheck, Info } from 'lucide-react';
import TrustedContactCard from '@/components/trusted/TrustedContactCard';
import InviteContactDialog from '@/components/trusted/InviteContactDialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type TrustedContact = Tables<'trusted_contacts'>;

export default function TrustedContacts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<TrustedContact | null>(null);

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['trusted-contacts', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trusted_contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TrustedContact[];
    },
    enabled: !!user,
  });

  const { data: settings } = useQuery({
    queryKey: ['user-settings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_settings')
        .select('min_verifications_required')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (contactId: string) => {
      const { error } = await supabase
        .from('trusted_contacts')
        .delete()
        .eq('id', contactId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trusted-contacts'] });
      toast.success('Contact removed');
    },
    onError: () => {
      toast.error('Failed to remove contact');
    },
  });

  const resendInviteMutation = useMutation({
    mutationFn: async (contact: TrustedContact) => {
      // Get user's profile name for the email
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user!.id)
        .single();

      const userName = profile?.full_name || 'Someone';

      // Call send-email edge function
      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'trusted_contact_invite',
          contactName: contact.name,
          contactEmail: contact.email,
          userName,
          inviteToken: contact.invite_token,
        },
      });

      if (emailError) throw emailError;

      // Update invite_sent_at timestamp
      const { error: updateError } = await supabase
        .from('trusted_contacts')
        .update({ invite_sent_at: new Date().toISOString() })
        .eq('id', contact.id);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trusted-contacts'] });
      toast.success('Invitation resent successfully');
    },
    onError: (error) => {
      console.error('Failed to resend invitation:', error);
      toast.error('Failed to resend invitation');
    },
  });

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const verifiedCount = contacts.filter(c => c.status === 'accepted').length;
  const minRequired = settings?.min_verifications_required ?? 2;

  const handleEdit = (contact: TrustedContact) => {
    setEditingContact(contact);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingContact(null);
  };

  return (
    <AppLayout>
      <div className="container max-w-4xl py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl text-foreground">Trusted Contacts</h1>
            <p className="text-muted-foreground mt-1">
              People who can verify your legacy when the time comes
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        </div>

        {/* Info Alert */}
        <Alert className="bg-primary/5 border-primary/20">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <AlertDescription className="text-foreground/80">
            Trusted contacts can confirm your passing to trigger message delivery. 
            At least <strong>{minRequired}</strong> contacts must confirm before messages are sent.
            {verifiedCount < minRequired && (
              <span className="text-amber-600 ml-1">
                You currently have {verifiedCount} accepted contact{verifiedCount !== 1 ? 's' : ''}.
              </span>
            )}
          </AlertDescription>
        </Alert>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Contacts List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-serif text-xl text-foreground mb-2">
              {contacts.length === 0 ? 'No trusted contacts yet' : 'No contacts match your search'}
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              {contacts.length === 0
                ? 'Add people you trust to help ensure your messages reach their destinations.'
                : 'Try a different search term.'}
            </p>
            {contacts.length === 0 && (
              <Button onClick={() => setDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Contact
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredContacts.map(contact => (
              <TrustedContactCard
                key={contact.id}
                contact={contact}
                onEdit={() => handleEdit(contact)}
                onDelete={() => deleteMutation.mutate(contact.id)}
                onResendInvite={() => resendInviteMutation.mutate(contact)}
              />
            ))}
          </div>
        )}

        {/* Dialog */}
        <InviteContactDialog
          open={dialogOpen}
          onOpenChange={handleDialogClose}
          editingContact={editingContact}
        />
      </div>
    </AppLayout>
  );
}
