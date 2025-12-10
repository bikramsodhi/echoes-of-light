import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sparkles } from 'lucide-react';
import MediaPreview from '@/components/media/MediaPreview';
import type { Tables } from '@/integrations/supabase/types';

type Recipient = Tables<'recipients'>;

interface MessagePreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
  recipients: Recipient[];
  mediaUrls?: string[];
}

export default function MessagePreview({ open, onOpenChange, title, content, recipients, mediaUrls = [] }: MessagePreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Message Preview
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Simulated message card */}
          <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-background rounded-xl p-6 border border-border/50">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 mb-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="font-serif text-xl text-foreground">EchoLight</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A message has been left for you
              </p>
            </div>

            <h2 className="font-serif text-2xl text-foreground mb-4 text-center">
              {title || 'Untitled Message'}
            </h2>

            <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {content || 'Your message content will appear here...'}
            </p>
          </div>

          {mediaUrls.length > 0 && (
            <div className="mt-4">
              <MediaPreview urls={mediaUrls} readonly />
            </div>
          )}

            {recipients.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-2">For:</p>
                <div className="flex flex-wrap gap-2">
                  {recipients.map(recipient => (
                    <div key={recipient.id} className="flex items-center gap-2 bg-background rounded-full px-3 py-1.5">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {recipient.name.slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-foreground">{recipient.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            This is how your message will appear to recipients
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
