import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Image as ImageIcon, Film, Music, FileText, ExternalLink, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaPreviewProps {
  urls: string[];
  onRemove?: (url: string) => void;
  readonly?: boolean;
  className?: string;
}

function getMediaType(url: string): 'image' | 'video' | 'audio' | 'document' {
  const ext = url.split('.').pop()?.toLowerCase() || '';
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
  if (['mp4', 'webm', 'mov', 'quicktime'].includes(ext)) return 'video';
  if (['mp3', 'wav', 'webm', 'ogg', 'mpeg'].includes(ext)) return 'audio';
  return 'document';
}

function MediaThumbnail({ url, onRemove, readonly }: { url: string; onRemove?: () => void; readonly?: boolean }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const mediaType = getMediaType(url);

  return (
    <div className="group relative aspect-square rounded-lg overflow-hidden bg-muted border border-border">
      {mediaType === 'image' && !error ? (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          <img
            src={url}
            alt="Uploaded media"
            className={cn(
              "w-full h-full object-cover transition-opacity",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setError(true);
            }}
          />
        </>
      ) : mediaType === 'video' ? (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <Film className="h-8 w-8 text-muted-foreground" />
        </div>
      ) : mediaType === 'audio' ? (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <Music className="h-8 w-8 text-muted-foreground" />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      
      {/* Overlay */}
      <div className={cn(
        "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2",
        readonly ? "pointer-events-none" : ""
      )}>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-white hover:bg-white/20"
          onClick={() => window.open(url, '_blank')}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
        
        {!readonly && onRemove && (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white hover:bg-destructive/80"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default function MediaPreview({ urls, onRemove, readonly = false, className }: MediaPreviewProps) {
  if (urls.length === 0) return null;

  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3", className)}>
      {urls.map((url, index) => (
        <MediaThumbnail
          key={url}
          url={url}
          readonly={readonly}
          onRemove={onRemove ? () => onRemove(url) : undefined}
        />
      ))}
    </div>
  );
}
