import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type TrustedContact = Tables<'trusted_contacts'>;

const formSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().trim().email('Please enter a valid email').max(255, 'Email is too long'),
  phone: z.string().trim().max(20, 'Phone number is too long').optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface InviteContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingContact: TrustedContact | null;
}

export default function InviteContactDialog({
  open,
  onOpenChange,
  editingContact,
}: InviteContactDialogProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isEditing = !!editingContact;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (editingContact) {
        form.reset({
          name: editingContact.name,
          email: editingContact.email,
          phone: editingContact.phone ?? '',
        });
      } else {
        form.reset({
          name: '',
          email: '',
          phone: '',
        });
      }
    }
  }, [open, editingContact, form]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!user) throw new Error('Not authenticated');

      const contactData = {
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        phone: values.phone?.trim() || null,
        user_id: user.id,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('trusted_contacts')
          .update(contactData)
          .eq('id', editingContact.id);

        if (error) throw error;
      } else {
        // Create new contact and simulate sending invite
        const { error } = await supabase
          .from('trusted_contacts')
          .insert({
            ...contactData,
            status: 'pending',
            invite_sent_at: new Date().toISOString(),
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trusted-contacts'] });
      toast.success(
        isEditing 
          ? 'Contact updated' 
          : 'Invitation sent (simulated)'
      );
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Something went wrong');
    },
  });

  const handleSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">
            {isEditing ? 'Edit Trusted Contact' : 'Invite a Trusted Contact'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the contact details below.'
              : 'This person will be able to verify your legacy when needed. An invitation will be sent to their email.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sarah Johnson" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="e.g., sarah@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    They'll receive an invitation to become your trusted contact.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="e.g., +1 555 123 4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending} className="gap-2">
                {mutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isEditing ? 'Saving...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    {!isEditing && <Send className="h-4 w-4" />}
                    {isEditing ? 'Save Changes' : 'Send Invitation'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
