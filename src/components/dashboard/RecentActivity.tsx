import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Clock, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'message_created' | 'message_updated' | 'recipient_added' | 'message_scheduled' | 'message_sent';
  title: string;
  timestamp: Date;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const activityConfig = {
  message_created: { icon: FileText, label: 'Created', color: 'text-primary' },
  message_updated: { icon: FileText, label: 'Updated', color: 'text-muted-foreground' },
  recipient_added: { icon: Users, label: 'Added', color: 'text-accent-foreground' },
  message_scheduled: { icon: Clock, label: 'Scheduled', color: 'text-amber-600 dark:text-amber-400' },
  message_sent: { icon: CheckCircle, label: 'Delivered', color: 'text-emerald-600 dark:text-emerald-400' },
};

export default function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Recent Activity</CardTitle>
          <CardDescription>Your journey begins here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">
              No activity yet. Start by creating your first message or adding a recipient.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">Recent Activity</CardTitle>
        <CardDescription>What you've been working on</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const config = activityConfig[activity.type];
            return (
              <div key={activity.id} className="flex items-center gap-4">
                <div className={`p-2 rounded-lg bg-muted`}>
                  <config.icon className={`h-4 w-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {config.label} · {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
