import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Lock, Clock, Users } from 'lucide-react';

const privacySchema = z.object({
  enable_encryption: z.boolean(),
  inactivity_check_days: z.number().min(7).max(365),
  min_verifications_required: z.number().min(1).max(5),
});

type PrivacyFormValues = z.infer<typeof privacySchema>;

export default function PrivacySettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<PrivacyFormValues>({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      enable_encryption: false,
      inactivity_check_days: 30,
      min_verifications_required: 2,
    },
  });

  // Fetch existing settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['user_settings', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user,
  });

  // Update form when settings load
  useEffect(() => {
    if (settings) {
      form.reset({
        enable_encryption: settings.enable_encryption ?? false,
        inactivity_check_days: settings.inactivity_check_days ?? 30,
        min_verifications_required: settings.min_verifications_required ?? 2,
      });
    }
  }, [settings, form]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (values: PrivacyFormValues) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('user_settings').upsert(
        {
          user_id: user.id,
          enable_encryption: values.enable_encryption,
          inactivity_check_days: values.inactivity_check_days,
          min_verifications_required: values.min_verifications_required,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_settings'] });
      toast({
        title: 'Settings saved',
        description: 'Your privacy settings have been updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error saving settings',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: PrivacyFormValues) => {
    saveMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-10 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-10 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Security & Encryption
            </CardTitle>
            <CardDescription>
              Control how your messages are protected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="enable_encryption"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Enable Enhanced Protection
                    </FormLabel>
                    <FormDescription>
                      Add an extra layer of security to your messages. When enabled,
                      messages require additional verification before delivery.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Check-In Settings
            </CardTitle>
            <CardDescription>
              How often should we check if you're still with us?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="inactivity_check_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inactivity Period: {field.value} days</FormLabel>
                  <FormControl>
                    <Slider
                      min={7}
                      max={365}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="py-4"
                    />
                  </FormControl>
                  <FormDescription>
                    After {field.value} days of inactivity, we'll reach out to your
                    trusted contacts to check in. Choose between 7 and 365 days.
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Verification Requirements
            </CardTitle>
            <CardDescription>
              How many trusted contacts need to confirm before delivery?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="min_verifications_required"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Required Confirmations: {field.value} contact
                    {field.value !== 1 ? 's' : ''}
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="py-4"
                    />
                  </FormControl>
                  <FormDescription>
                    For your peace of mind, at least {field.value} trusted contact
                    {field.value !== 1 ? 's' : ''} must confirm before your messages
                    are delivered. We recommend at least 2 for added security.
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Saving...' : 'Save Privacy Settings'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
