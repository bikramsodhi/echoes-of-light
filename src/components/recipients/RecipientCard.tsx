import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2, Mail, Phone, MessageSquare } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Recipient = Tables<'recipients'>;

interface RecipientCardProps {
  recipient: Recipient;
  viewMode: 'grid' | 'list';
  onEdit: () => void;
  onDelete: () => void;
}

export default function RecipientCard({ recipient, viewMode, onEdit, onDelete }: RecipientCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const initials = recipient.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleDelete = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

  if (viewMode === 'list') {
    return (
      <>
        <Card className="hover:shadow-md transition-shadow animate-fade-in">
          <CardContent className="p-4 flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={recipient.avatar_url || undefined} alt={recipient.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-foreground truncate">{recipient.name}</h3>
                {recipient.relationship && (
                  <Badge variant="secondary" className="text-xs">
                    {recipient.relationship}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                {recipient.email && (
                  <span className="flex items-center gap-1 truncate">
                    <Mail className="h-3 w-3" />
                    {recipient.email}
                  </span>
                )}
                {recipient.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {recipient.phone}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={onEdit}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Let go of this recipient?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove {recipient.name} from your recipients. Any messages assigned to them will remain, but won't have a recipient.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep them</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                Remove gently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-200 animate-fade-in overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={recipient.avatar_url || undefined} alt={recipient.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <h3 className="font-serif text-lg text-foreground mb-1">{recipient.name}</h3>
          
          {recipient.relationship && (
            <Badge variant="secondary" className="mb-3">
              {recipient.relationship}
            </Badge>
          )}

          <div className="space-y-2 text-sm text-muted-foreground mt-4">
            {recipient.email && (
              <div className="flex items-center gap-2 truncate">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{recipient.email}</span>
              </div>
            )}
            {recipient.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>{recipient.phone}</span>
              </div>
            )}
          </div>

          {recipient.notes && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p className="line-clamp-2">{recipient.notes}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Let go of this recipient?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {recipient.name} from your recipients. Any messages assigned to them will remain, but won't have a recipient.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep them</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Remove gently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
