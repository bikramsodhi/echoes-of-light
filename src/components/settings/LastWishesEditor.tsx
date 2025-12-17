import { useEffect, useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollText, Heart, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const lastWishesSchema = z.object({
  last_wishes_enabled: z.boolean(),
  last_wishes_content: z.string().max(10000).optional(),
});

type LastWishesFormValues = z.infer<typeof lastWishesSchema>;

export default function LastWishesEditor() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [charCount, setCharCount] = useState(0);

  const form = useForm<LastWishesFormValues>({
    resolver: zodResolver(lastWishesSchema),
    defaultValues: {
      last_wishes_enabled: false,
      last_wishes_content: '',
    },
  });

  const isEnabled = form.watch('last_wishes_enabled');
  const content = form.watch('last_wishes_content');

  useEffect(() => {
    setCharCount(content?.length || 0);
  }, [content]);

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
        last_wishes_enabled: settings.last_wishes_enabled ?? false,
        last_wishes_content: settings.last_wishes_content ?? '',
      });
    }
  }, [settings, form]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (values: LastWishesFormValues) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('user_settings').upsert(
        {
          user_id: user.id,
          last_wishes_enabled: values.last_wishes_enabled,
          last_wishes_content: values.last_wishes_content || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_settings'] });
      toast({
        title: 'Last wishes saved',
        description: 'Your final message has been safely stored.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error saving',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: LastWishesFormValues) => {
    saveMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Alert className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-foreground/80">
            Your last wishes document is a special message that will be shared
            alongside your other messages. It's a place for final thoughts,
            practical instructions, or anything you'd like to say.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-primary" />
              Last Wishes Document
            </CardTitle>
            <CardDescription>
              A final message to accompany your legacy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="last_wishes_enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Enable Last Wishes
                    </FormLabel>
                    <FormDescription>
                      When enabled, this document will be delivered with your messages
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

            {isEnabled && (
              <FormField
                control={form.control}
                name="last_wishes_content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-primary" />
                      Your Final Words
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your final thoughts, instructions, or anything you'd like your loved ones to know...

Some ideas:
• Practical matters (accounts, passwords, important documents)
• Personal wishes for your loved ones
• Things you've always wanted to say
• Memories you want to preserve
• Gratitude and appreciation"
                        className="min-h-[300px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="flex justify-between">
                      <span>
                        Take your time. This space is for you to share whatever feels important.
                      </span>
                      <span className="text-muted-foreground">
                        {charCount.toLocaleString()} / 10,000
                      </span>
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Saving...' : 'Save Last Wishes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
