import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MessageViewer from '@/components/delivery/MessageViewer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Lock, AlertCircle } from 'lucide-react';

interface DeliveredMessage {
  id: string;
  title: string | null;
  content: string | null;
  media_urls: string[] | null;
  sent_at: string | null;
  sender_name: string | null;
}

export default function RecipientPortal() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<DeliveredMessage | null>(null);
  const [viewed, setViewed] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('No message token provided');
      setLoading(false);
      return;
    }

    // For now, show a demo message since we don't have real delivery tokens yet
    // In production, this would validate the token and fetch the actual message
    const fetchMessage = async () => {
      try {
        // Simulate loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Demo message for testing the UI
        setMessage({
          id: 'demo',
          title: 'A Letter of Love',
          content: `My dearest,

If you're reading this, it means the time has come for these words to find you. I want you to know that writing this brought me such peace, knowing that even across time and distance, my love would reach you.

Remember the little moments we shared — the laughter, the quiet evenings, the way you always knew how to make me smile. Those memories are treasures that nothing can take away.

I hope this message finds you well, surrounded by people who love you as much as I do. Please know that you made my life infinitely richer just by being in it.

With all my heart, always.`,
          media_urls: [],
          sent_at: new Date().toISOString(),
          sender_name: 'Someone who loved you deeply',
        });
      } catch (err) {
        setError('Unable to load this message. The link may have expired.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [token]);

  const handleViewMessage = () => {
    setViewed(true);
    // In production, mark the message as viewed in the database
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 animate-pulse">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <Skeleton className="h-4 w-48 mx-auto" />
          <p className="text-sm text-muted-foreground">Loading your message...</p>
        </div>
      </div>
    );
  }

  if (error || !message) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="font-serif text-2xl text-foreground">Unable to Load Message</h1>
          <p className="text-muted-foreground">
            {error || 'This message could not be found. The link may have expired or been used already.'}
          </p>
          <p className="text-sm text-muted-foreground">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    );
  }

  if (!viewed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
            <Heart className="h-10 w-10 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h1 className="font-serif text-3xl text-foreground">
              A Message Awaits You
            </h1>
            <p className="text-muted-foreground">
              Someone left these words for you, with love and intention.
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Lock className="h-4 w-4" />
              <span className="font-medium">Private & Secure</span>
            </div>
            <p>
              This message was written especially for you. 
              Take your time — there's no rush.
            </p>
          </div>

          <Button onClick={handleViewMessage} size="lg" className="gap-2">
            <Heart className="h-4 w-4" />
            Open Message
          </Button>

          <p className="text-xs text-muted-foreground">
            Delivered with care by EchoLight
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <MessageViewer
        title={message.title || undefined}
        content={message.content || undefined}
        senderName={message.sender_name || undefined}
        deliveredAt={message.sent_at ? new Date(message.sent_at) : undefined}
        mediaUrls={message.media_urls || []}
      />
    </div>
  );
}
