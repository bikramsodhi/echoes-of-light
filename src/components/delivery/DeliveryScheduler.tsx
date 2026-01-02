import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeliverySchedulerProps {
  deliveryDate: Date | null;
  deliveryEvent: string | null;
  onDateChange: (date: Date | null) => void;
  onEventChange: (event: string | null) => void;
  className?: string;
}

const DATE_SUGGESTIONS = [
  "Birthday",
  "Anniversary",
  "Graduation",
  "Wedding",
  "Christmas",
  "Mother's Day",
  "Father's Day",
];

export default function DeliveryScheduler({
  deliveryDate,
  onDateChange,
  onEventChange,
  className,
}: DeliverySchedulerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    onDateChange(date || null);
    onEventChange(null); // Clear any event when a date is selected
    setIsCalendarOpen(false);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Date Suggestions */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-muted-foreground">
          <Lightbulb className="h-4 w-4" />
          Ideas for meaningful dates
        </Label>
        <div className="flex flex-wrap gap-2">
          {DATE_SUGGESTIONS.map((suggestion) => (
            <span
              key={suggestion}
              className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
            >
              {suggestion}
            </span>
          ))}
        </div>
      </div>

      {/* Date Picker */}
      <div className="space-y-2">
        <Label>Select delivery date</Label>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !deliveryDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {deliveryDate ? format(deliveryDate, 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={deliveryDate || undefined}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date()}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Summary */}
      {deliveryDate && (
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-muted-foreground">
            This message will be delivered on{' '}
            <span className="font-medium text-foreground">
              {format(deliveryDate, 'MMMM d, yyyy')}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
