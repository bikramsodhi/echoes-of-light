import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { MoreVertical, Mail, Phone, Edit, Trash2, Send, CheckCircle, Clock, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

type TrustedContact = Tables<'trusted_contacts'>;

interface TrustedContactCardProps {
  contact: TrustedContact;
  onEdit: () => void;
  onDelete: () => void;
  onResendInvite: () => void;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  accepted: {
    label: 'Accepted',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  declined: {
    label: 'Declined',
    icon: XCircle,
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
};

export default function TrustedContactCard({
  contact,
  onEdit,
  onDelete,
  onResendInvite,
}: TrustedContactCardProps) {
  const status = contact.status ?? 'pending';
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const initials = contact.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-medium text-foreground truncate">{contact.name}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5 truncate">
                    <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                    {contact.email}
                  </span>
                  {contact.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                      {contact.phone}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant="secondary" className={config.className}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {config.label}
                </Badge>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    {status === 'pending' && (
                      <DropdownMenuItem onClick={onResendInvite}>
                        <Send className="h-4 w-4 mr-2" />
                        Resend Invite
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove trusted contact?</AlertDialogTitle>
                          <AlertDialogDescription>
                            {contact.name} will no longer be able to verify your legacy.
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Meta info */}
            <div className="mt-2 text-xs text-muted-foreground">
              {contact.invite_sent_at ? (
                <span>Invite sent {formatDistanceToNow(new Date(contact.invite_sent_at), { addSuffix: true })}</span>
              ) : (
                <span>Added {formatDistanceToNow(new Date(contact.created_at!), { addSuffix: true })}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
