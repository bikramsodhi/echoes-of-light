import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type Recipient = Tables<'recipients'>;

const recipientSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  relationship: z.string().max(50, 'Relationship must be less than 50 characters').optional(),
  email: z.string().email('Please enter a valid email').max(255).optional().or(z.literal('')),
  phone: z.string().max(20, 'Phone must be less than 20 characters').optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

type RecipientFormValues = z.infer<typeof recipientSchema>;

interface RecipientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipient: Recipient | null;
}

export default function RecipientDialog({ open, onOpenChange, recipient }: RecipientDialogProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isEditing = !!recipient;

  const form = useForm<RecipientFormValues>({
    resolver: zodResolver(recipientSchema),
    defaultValues: {
      name: '',
      relationship: '',
      email: '',
      phone: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (recipient) {
      form.reset({
        name: recipient.name,
        relationship: recipient.relationship || '',
        email: recipient.email || '',
        phone: recipient.phone || '',
        notes: recipient.notes || '',
      });
    } else {
      form.reset({
        name: '',
        relationship: '',
        email: '',
        phone: '',
        notes: '',
      });
    }
  }, [recipient, form]);

  const mutation = useMutation({
    mutationFn: async (values: RecipientFormValues) => {
      if (!user) throw new Error('Not authenticated');

      const payload = {
        name: values.name,
        relationship: values.relationship || null,
        email: values.email || null,
        phone: values.phone || null,
        notes: values.notes || null,
        user_id: user.id,
      };

      if (isEditing && recipient) {
        const { error } = await supabase
          .from('recipients')
          .update(payload)
          .eq('id', recipient.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('recipients')
          .insert(payload);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipients'] });
      toast.success(isEditing ? 'Recipient updated' : 'Recipient added to your circle');
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast.error('Something interrupted the moment. Please try again.');
    },
  });

  const onSubmit = (values: RecipientFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            {isEditing ? 'Edit Recipient' : 'Add a Recipient'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the details for this special person'
              : 'Who would you like to leave a message for?'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Their name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Daughter, Best friend, Brother" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="their@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any special details or memories about this person..."
                      className="resize-none"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Save Changes' : 'Add Recipient'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
