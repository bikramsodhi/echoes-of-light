import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock, Users, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';

interface DeliveryCadenceProps {
  recipientId: string;
  recipientName: string;
  messageCount: number;
}

interface Message {
  id: string;
  title: string | null;
  created_at: string | null;
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
  const [messageOrder, setMessageOrder] = useState<string[]>([]);

  // Parse existing cadence into components (simplified - no longer includes orderBy)
  const parseCadence = (cadence: string): { 
    spaceOut: boolean; 
    quantity: string; 
    period: 'week' | 'month';
  } => {
    if (cadence === 'all_at_once' || !cadence.includes('_per_')) {
      return { spaceOut: false, quantity: '1', period: 'week' };
    }
    
    // Parse formats like "1_per_week", "2_per_month" (strip any legacy order suffix)
    const cadencePart = cadence.split(':')[0];
    const match = cadencePart.match(/^(\d+)_per_(week|month)$/);
    
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
  const buildCadence = (
    spaceOut: boolean, 
    quantity: string, 
    period: 'week' | 'month'
  ): string => {
    if (!spaceOut) return 'all_at_once';
    return `${quantity}_per_${period}`;
  };

  // Fetch messages for this recipient
  const { data: recipientMessages } = useQuery({
    queryKey: ['recipient-messages-for-cadence', user?.id, recipientId],
    queryFn: async () => {
      const { data: messageRecipients, error: mrError } = await supabase
        .from('message_recipients')
        .select('message_id')
        .eq('recipient_id', recipientId);

      if (mrError) throw mrError;
      if (!messageRecipients?.length) return [];

      const messageIds = messageRecipients.map(mr => mr.message_id);
      
      const { data: messages, error: mError } = await supabase
        .from('messages')
        .select('id, title, created_at')
        .in('id', messageIds)
        .eq('user_id', user!.id)
        .eq('delivery_trigger', 'posthumous')
        .neq('status', 'sent')
        .order('created_at', { ascending: true });

      if (mError) throw mError;
      return messages || [];
    },
    enabled: !!user && !!recipientId,
  });

  // Fetch existing cadence setting with message_order
  const { data: existingCadenceData } = useQuery({
    queryKey: ['recipient-cadence', user?.id, recipientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipient_delivery_cadence')
        .select('cadence, message_order')
        .eq('user_id', user!.id)
        .eq('recipient_id', recipientId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user && !!recipientId,
  });

  // Initialize state from existing data
  useEffect(() => {
    if (existingCadenceData) {
      const parsed = parseCadence(existingCadenceData.cadence || 'all_at_once');
      setSpaceOut(parsed.spaceOut);
      setQuantity(parsed.quantity);
      setPeriod(parsed.period);
      
      if (existingCadenceData.message_order?.length) {
        setMessageOrder(existingCadenceData.message_order);
      }
    }
  }, [existingCadenceData]);

  // Set default order from messages if no custom order exists
  useEffect(() => {
    if (recipientMessages?.length && !messageOrder.length) {
      const defaultOrder = recipientMessages.map(m => m.id);
      setMessageOrder(defaultOrder);
    }
  }, [recipientMessages, messageOrder.length]);

  // Save cadence mutation
  const saveMutation = useMutation({
    mutationFn: async ({ cadence, order }: { cadence: string; order: string[] }) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('recipient_delivery_cadence')
        .upsert(
          {
            user_id: user.id,
            recipient_id: recipientId,
            cadence,
            message_order: order,
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
    saveMutation.mutate({ cadence: newCadence, order: messageOrder });
  };

  const handleQuantityChange = (value: string) => {
    setQuantity(value);
    const newCadence = buildCadence(spaceOut, value, period);
    saveMutation.mutate({ cadence: newCadence, order: messageOrder });
  };

  const handlePeriodChange = (value: 'week' | 'month') => {
    setPeriod(value);
    const newCadence = buildCadence(spaceOut, quantity, value);
    saveMutation.mutate({ cadence: newCadence, order: messageOrder });
  };

  const moveMessage = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...messageOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    setMessageOrder(newOrder);
    
    const currentCadence = buildCadence(spaceOut, quantity, period);
    saveMutation.mutate({ cadence: currentCadence, order: newOrder });
  };

  // Get ordered messages based on messageOrder
  const getOrderedMessages = (): Message[] => {
    if (!recipientMessages?.length) return [];
    
    // If we have a custom order, use it
    if (messageOrder.length) {
      const orderedMessages: Message[] = [];
      const messageMap = new Map(recipientMessages.map(m => [m.id, m]));
      
      // Add messages in custom order
      for (const id of messageOrder) {
        const msg = messageMap.get(id);
        if (msg) {
          orderedMessages.push(msg);
          messageMap.delete(id);
        }
      }
      
      // Add any remaining messages not in the order
      for (const msg of messageMap.values()) {
        orderedMessages.push(msg);
      }
      
      return orderedMessages;
    }
    
    return recipientMessages;
  };

  const orderedMessages = getOrderedMessages();

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
          <div className="flex flex-wrap items-center gap-3 animate-fade-in">
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

        {/* Message order list */}
        {spaceOut && orderedMessages.length > 1 && (
          <div className="space-y-2 animate-fade-in">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GripVertical className="h-4 w-4" />
              <span>Delivery order (first to last)</span>
            </div>
            <div className="space-y-1 rounded-lg border border-border/50 p-2">
              {orderedMessages.map((message, index) => (
                <div 
                  key={message.id}
                  className="flex items-center gap-2 rounded-md bg-background/50 px-3 py-2 text-sm"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {index + 1}
                  </span>
                  <span className="flex-1 truncate">
                    {message.title || 'Untitled message'}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => moveMessage(index, 'up')}
                      disabled={index === 0 || saveMutation.isPending}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => moveMessage(index, 'down')}
                      disabled={index === orderedMessages.length - 1 || saveMutation.isPending}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
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
