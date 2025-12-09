import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, Users, CheckCircle } from 'lucide-react';

interface MessageSummaryProps {
  drafts: number;
  scheduled: number;
  sent: number;
  recipients: number;
}

export default function MessageSummary({ drafts, scheduled, sent, recipients }: MessageSummaryProps) {
  const stats = [
    {
      label: 'Drafts',
      value: drafts,
      description: 'Messages in progress',
      icon: FileText,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
    {
      label: 'Scheduled',
      value: scheduled,
      description: 'Ready for delivery',
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-100 dark:bg-amber-900/20',
    },
    {
      label: 'Sent',
      value: sent,
      description: 'Delivered with care',
      icon: CheckCircle,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
    },
    {
      label: 'Recipients',
      value: recipients,
      description: 'People you\'re writing for',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">{stat.label}</CardDescription>
            <div className={`p-2 rounded-md ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-3xl font-serif">{stat.value}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
