import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FileText, Clock, Send, Calendar } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Tables } from '@/integrations/supabase/types';

type Message = Tables<'messages'>;
type Recipient = Tables<'recipients'>;

interface MessageCardProps {
  message: Message;
  recipients: Recipient[];
  onClick: () => void;
}

const statusConfig = {
  draft: {
    label: 'Draft',
    icon: FileText,
    className: 'bg-muted text-muted-foreground',
  },
  scheduled: {
    label: 'Scheduled',
    icon: Clock,
    className: 'bg-accent text-accent-foreground',
  },
  sent: {
    label: 'Sent',
    icon: Send,
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
};

export default function MessageCard({ message, recipients, onClick }: MessageCardProps) {
  const status = message.status || 'draft';
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const preview = message.content 
    ? message.content.slice(0, 150) + (message.content.length > 150 ? '...' : '')
    : 'No content yet...';

  return (
    <Card 
      className="hover:shadow-md transition-all duration-200 cursor-pointer animate-fade-in group"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={cn(
            "flex-shrink-0 p-2.5 rounded-lg transition-colors",
            status === 'sent' && "bg-emerald-100 dark:bg-emerald-900/30",
            status === 'scheduled' && "bg-accent",
            status === 'draft' && "bg-muted"
          )}>
            <StatusIcon className={cn(
              "h-5 w-5",
              status === 'sent' && "text-emerald-600 dark:text-emerald-400",
              status === 'scheduled' && "text-accent-foreground",
              status === 'draft' && "text-muted-foreground"
            )} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                {message.title || 'Untitled Message'}
              </h3>
              <Badge variant="secondary" className={cn("flex-shrink-0 text-xs", config.className)}>
                {config.label}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {preview}
            </p>

            <div className="flex items-center justify-between">
              {/* Recipients */}
              <div className="flex items-center gap-2">
                {recipients.length > 0 ? (
                  <div className="flex -space-x-2">
                    {recipients.slice(0, 3).map(recipient => (
                      <Avatar key={recipient.id} className="h-6 w-6 border-2 border-background">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {recipient.name.slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {recipients.length > 3 && (
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs text-muted-foreground border-2 border-background">
                        +{recipients.length - 3}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">No recipient assigned</span>
                )}
              </div>

              {/* Date info */}
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                {message.delivery_date ? (
                  <>
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(message.delivery_date), 'MMM d, yyyy')}</span>
                  </>
                ) : (
                  <span>Updated {formatDistanceToNow(new Date(message.updated_at || message.created_at || new Date()), { addSuffix: true })}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
