import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeliverySchedulerProps {
  deliveryDate: Date | null;
  deliveryEvent: string | null;
  onDateChange: (date: Date | null) => void;
  onEventChange: (event: string | null) => void;
  className?: string;
}

const PRESET_EVENTS = [
  { value: 'birthday', label: "On their birthday" },
  { value: 'wedding', label: "On their wedding day" },
  { value: 'graduation', label: "On graduation day" },
  { value: 'anniversary', label: "On our anniversary" },
  { value: 'christmas', label: "On Christmas" },
  { value: 'new_year', label: "On New Year's Day" },
  { value: 'mothers_day', label: "On Mother's Day" },
  { value: 'fathers_day', label: "On Father's Day" },
  { value: 'custom', label: "Custom date..." },
];

export default function DeliveryScheduler({
  deliveryDate,
  deliveryEvent,
  onDateChange,
  onEventChange,
  className,
}: DeliverySchedulerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleEventSelect = (value: string) => {
    if (value === 'custom') {
      onEventChange(null);
      setIsCalendarOpen(true);
    } else {
      onEventChange(value);
      onDateChange(null);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    onDateChange(date || null);
    onEventChange(null);
    setIsCalendarOpen(false);
  };

  const getDisplayValue = () => {
    if (deliveryDate) {
      return format(deliveryDate, 'MMMM d, yyyy');
    }
    if (deliveryEvent) {
      return PRESET_EVENTS.find(e => e.value === deliveryEvent)?.label || deliveryEvent;
    }
    return 'Select timing...';
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Choose a meaningful moment
        </Label>
        
        <Select
          value={deliveryEvent || (deliveryDate ? 'custom' : '')}
          onValueChange={handleEventSelect}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="When should this arrive?" />
          </SelectTrigger>
          <SelectContent>
            {PRESET_EVENTS.map(event => (
              <SelectItem key={event.value} value={event.value}>
                {event.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Calendar for custom date */}
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !deliveryDate && deliveryEvent && "hidden"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {deliveryDate ? format(deliveryDate, 'PPP') : 'Pick a specific date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={deliveryDate || undefined}
            onSelect={handleDateSelect}
            disabled={(date) => date < new Date()}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Custom event name */}
      {deliveryEvent && !PRESET_EVENTS.find(e => e.value === deliveryEvent) && (
        <div className="space-y-2">
          <Label htmlFor="custom-event">Event name</Label>
          <Input
            id="custom-event"
            placeholder="e.g., 18th birthday, first day of college..."
            value={deliveryEvent}
            onChange={(e) => onEventChange(e.target.value)}
          />
        </div>
      )}

      {/* Summary */}
      {(deliveryDate || deliveryEvent) && (
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-muted-foreground">
            This message will be delivered{' '}
            <span className="font-medium text-foreground">
              {getDisplayValue()}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
