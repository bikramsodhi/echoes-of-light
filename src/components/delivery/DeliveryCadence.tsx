import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock, Users } from 'lucide-react';

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
  
  const [spaceOut, setSpaceOut] = useState(false);
  const [quantity, setQuantity] = useState('1');
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  // Parse existing cadence into components
  const parseCadence = (cadence: string): { spaceOut: boolean; quantity: string; period: 'week' | 'month' } => {
    if (cadence === 'all_at_once') {
      return { spaceOut: false, quantity: '1', period: 'week' };
    }
    
    // Parse formats like "1_per_week", "2_per_month"
    const match = cadence.match(/^(\d+)_per_(week|month)$/);
    if (match) {
      return { 
        spaceOut: true, 
        quantity: match[1], 
        period: match[2] as 'week' | 'month' 
      };
    }
    
    // Legacy format fallback
    if (cadence === 'weekly') {
      return { spaceOut: true, quantity: '1', period: 'week' };
    }
    if (cadence === 'monthly') {
      return { spaceOut: true, quantity: '1', period: 'month' };
    }
    
    return { spaceOut: false, quantity: '1', period: 'week' };
  };

  // Build cadence string from components
  const buildCadence = (spaceOut: boolean, quantity: string, period: 'week' | 'month'): string => {
    if (!spaceOut) return 'all_at_once';
    return `${quantity}_per_${period}`;
  };

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
      return data?.cadence as string | null;
    },
    enabled: !!user && !!recipientId,
  });

  useEffect(() => {
    if (existingCadence) {
      const parsed = parseCadence(existingCadence);
      setSpaceOut(parsed.spaceOut);
      setQuantity(parsed.quantity);
      setPeriod(parsed.period);
    }
  }, [existingCadence]);

  // Save cadence mutation
  const saveMutation = useMutation({
    mutationFn: async (newCadence: string) => {
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

  const handleSpaceOutChange = (checked: boolean) => {
    setSpaceOut(checked);
    const newCadence = buildCadence(checked, quantity, period);
    saveMutation.mutate(newCadence);
  };

  const handleQuantityChange = (value: string) => {
    setQuantity(value);
    const newCadence = buildCadence(spaceOut, value, period);
    saveMutation.mutate(newCadence);
  };

  const handlePeriodChange = (value: 'week' | 'month') => {
    setPeriod(value);
    const newCadence = buildCadence(spaceOut, quantity, value);
    saveMutation.mutate(newCadence);
  };

  // Generate quantity options (1 up to messageCount, max 4)
  const maxQuantity = Math.min(messageCount, 4);
  const quantityOptions = Array.from({ length: maxQuantity }, (_, i) => (i + 1).toString());

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
        {/* Toggle for spacing */}
        <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
          <div className="space-y-0.5">
            <Label htmlFor="space-out" className="font-medium cursor-pointer">
              Space out delivery
            </Label>
            <p className="text-xs text-muted-foreground">
              {spaceOut 
                ? "Messages will arrive gradually over time" 
                : "All messages will arrive together"}
            </p>
          </div>
          <Switch
            id="space-out"
            checked={spaceOut}
            onCheckedChange={handleSpaceOutChange}
          />
        </div>

        {/* Quantity and period selectors */}
        {spaceOut && (
          <div className="flex items-center gap-3 animate-fade-in">
            <span className="text-sm text-muted-foreground">Send</span>
            <Select value={quantity} onValueChange={handleQuantityChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {quantityOptions.map((num) => (
                  <SelectItem key={num} value={num}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">per</span>
            <Select value={period} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">week</SelectItem>
                <SelectItem value="month">month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {spaceOut && (
          <p className="text-xs text-primary/80 flex items-center gap-1 pt-1">
            <Clock className="h-3 w-3" />
            We'll deliver them gently, {quantity} at a time.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
