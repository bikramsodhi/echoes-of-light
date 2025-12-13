import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Heart, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import MediaPreview from '@/components/media/MediaPreview';

interface MessageViewerProps {
  title?: string;
  content?: string;
  senderName?: string;
  deliveredAt?: Date;
  mediaUrls?: string[];
}

export default function MessageViewer({
  title,
  content,
  senderName = 'Someone who loves you',
  deliveredAt,
  mediaUrls = [],
}: MessageViewerProps) {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header with sender info */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Heart className="h-8 w-8 text-primary" />
        </div>
        <p className="text-muted-foreground text-sm mb-2">A message from</p>
        <h2 className="font-serif text-2xl text-foreground">{senderName}</h2>
        {deliveredAt && (
          <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
            <Calendar className="h-3 w-3" />
            Delivered on {format(deliveredAt, 'MMMM d, yyyy')}
          </p>
        )}
      </div>

      {/* Message content */}
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="text-center pb-2">
          {title && (
            <h3 className="font-serif text-xl text-foreground">{title}</h3>
          )}
        </CardHeader>
        <CardContent className="pt-2">
          {/* Text content */}
          {content && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                {content}
              </p>
            </div>
          )}

          {/* Media attachments */}
          {mediaUrls.length > 0 && (
            <>
              <Separator className="my-6" />
              <MediaPreview urls={mediaUrls} readonly />
            </>
          )}

          {/* Signature */}
          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground italic">
              "These words were left for you with love and intention."
            </p>
            <div className="flex items-center justify-center gap-1 mt-2 text-primary/60">
              <Heart className="h-3 w-3 fill-current" />
              <span className="text-xs">EchoLight</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
