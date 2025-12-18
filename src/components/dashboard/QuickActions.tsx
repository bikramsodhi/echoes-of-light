import { useNavigate } from 'react-router-dom';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users, FileText, Shield } from 'lucide-react';

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Create Message',
      description: 'Begin a new letter, voice memo, or video for someone you love',
      icon: Plus,
      path: '/vault/compose',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'Add Recipient',
      description: 'Add someone new to your circle of recipients',
      icon: Users,
      path: '/recipients?new=true',
      iconBg: 'bg-accent/20',
      iconColor: 'text-accent-foreground',
    },
    {
      title: 'Message Vault',
      description: 'View and manage all your saved messages',
      icon: FileText,
      path: '/vault',
      iconBg: 'bg-secondary',
      iconColor: 'text-secondary-foreground',
    },
    {
      title: 'Trusted Contacts',
      description: 'Manage who can verify and trigger delivery',
      icon: Shield,
      path: '/trusted-contacts',
      iconBg: 'bg-muted',
      iconColor: 'text-muted-foreground',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => (
        <Card 
          key={action.title}
          className="group hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer"
          onClick={() => navigate(action.path)}
        >
          <CardHeader>
            <div className={`p-3 rounded-lg ${action.iconBg} w-fit mb-2 group-hover:scale-105 transition-transform`}>
              <action.icon className={`h-5 w-5 ${action.iconColor}`} />
            </div>
            <CardTitle className="font-serif text-lg">{action.title}</CardTitle>
            <CardDescription className="text-sm">
              {action.description}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
