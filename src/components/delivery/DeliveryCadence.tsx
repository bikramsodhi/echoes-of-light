import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock, Users } from 'lucide-react';

type CadenceType = 'all_at_once' | 'weekly' | 'monthly';

interface DeliveryCadenceProps {
  recipientId: string;
  recipientName: string;
  messageCount: number;
}

export default function DeliveryCadence({
  recipientId,
  recipientName,
  messageCount,
}: DeliveryCadenceProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [cadence, setCadence] = useState<CadenceType>('all_at_once');

  // Fetch existing cadence setting
  const { data: existingCadence } = useQuery({
    queryKey: ['recipient-cadence', user?.id, recipientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipient_delivery_cadence')
        .select('cadence')
        .eq('user_id', user!.id)
        .eq('recipient_id', recipientId)
        .maybeSingle();

      if (error) throw error;
      return data?.cadence as CadenceType | null;
    },
    enabled: !!user && !!recipientId,
  });

  useEffect(() => {
    if (existingCadence) {
      setCadence(existingCadence);
    }
  }, [existingCadence]);

  // Save cadence mutation
  const saveMutation = useMutation({
    mutationFn: async (newCadence: CadenceType) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('recipient_delivery_cadence')
        .upsert(
          {
            user_id: user.id,
            recipient_id: recipientId,
            cadence: newCadence,
          },
          { onConflict: 'user_id,recipient_id' }
        );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipient-cadence'] });
    },
  });

  const handleCadenceChange = (value: CadenceType) => {
    setCadence(value);
    saveMutation.mutate(value);
  };

  return (
    <Card className="border-primary/20 bg-accent/10">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-primary">
          <Users className="h-4 w-4" />
          <CardTitle className="text-base font-medium">
            Delivery Pacing for {recipientName}
          </CardTitle>
        </div>
        <CardDescription className="text-sm">
          You've written {messageCount} messages to {recipientName}. How should we deliver them?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Choose how they're spaced. We'll send them gently, just as you intended.
        </p>

        <RadioGroup
          value={cadence}
          onValueChange={(v) => handleCadenceChange(v as CadenceType)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 rounded-lg border border-border/50 p-3 hover:bg-accent/50 transition-colors">
            <RadioGroupItem value="all_at_once" id="all_at_once" />
            <Label htmlFor="all_at_once" className="flex-1 cursor-pointer">
              <span className="font-medium">All at once</span>
              <p className="text-xs text-muted-foreground mt-0.5">
                Deliver all messages together when the time comes
              </p>
            </Label>
          </div>

          <div className="flex items-center space-x-3 rounded-lg border border-border/50 p-3 hover:bg-accent/50 transition-colors">
            <RadioGroupItem value="weekly" id="weekly" />
            <Label htmlFor="weekly" className="flex-1 cursor-pointer">
              <span className="font-medium">One each week</span>
              <p className="text-xs text-muted-foreground mt-0.5">
                Space messages out, one arriving each week
              </p>
            </Label>
          </div>

          <div className="flex items-center space-x-3 rounded-lg border border-border/50 p-3 hover:bg-accent/50 transition-colors">
            <RadioGroupItem value="monthly" id="monthly" />
            <Label htmlFor="monthly" className="flex-1 cursor-pointer">
              <span className="font-medium">One each month</span>
              <p className="text-xs text-muted-foreground mt-0.5">
                A gentle pacing, one message arriving each month
              </p>
            </Label>
          </div>
        </RadioGroup>

        {cadence !== 'all_at_once' && (
          <p className="text-xs text-primary/80 flex items-center gap-1 pt-2">
            <Clock className="h-3 w-3" />
            We'll deliver them gently, one by one.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
