import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Image as ImageIcon, Film, Music, FileText, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSignedUrl } from '@/hooks/useSignedUrl';

interface MediaPreviewProps {
  urls: string[]; // These are file paths, not URLs
  onRemove?: (path: string) => void;
  readonly?: boolean;
  className?: string;
}

// Extensions that browsers can't display as images
const NON_PREVIEWABLE_IMAGE_EXTENSIONS = ['heic', 'heif'];

function getMediaType(path: string): 'image' | 'video' | 'audio' | 'document' | 'non-previewable-image' {
  const ext = path.split('.').pop()?.toLowerCase() || '';
  
  if (NON_PREVIEWABLE_IMAGE_EXTENSIONS.includes(ext)) return 'non-previewable-image';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
  if (['mp4', 'webm', 'mov', 'quicktime'].includes(ext)) return 'video';
  if (['mp3', 'wav', 'webm', 'ogg', 'mpeg'].includes(ext)) return 'audio';
  return 'document';
}

function getFileName(path: string): string {
  return path.split('/').pop() || path;
}

function MediaThumbnail({ 
  filePath, 
  onRemove, 
  readonly 
}: { 
  filePath: string; 
  onRemove?: () => void; 
  readonly?: boolean;
}) {
  const { signedUrl, isLoading: isLoadingUrl } = useSignedUrl(filePath);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [error, setError] = useState(false);
  const mediaType = getMediaType(filePath);

  const isLoading = isLoadingUrl || (mediaType === 'image' && isLoadingImage && !error);

  return (
    <div className="group relative aspect-square rounded-lg overflow-hidden bg-muted border border-border">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
      
      {mediaType === 'image' && signedUrl && !error ? (
        <img
          src={signedUrl}
          alt="Uploaded media"
          className={cn(
            "w-full h-full object-cover transition-opacity",
            isLoadingImage ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsLoadingImage(false)}
          onError={() => {
            setIsLoadingImage(false);
            setError(true);
          }}
        />
      ) : mediaType === 'non-previewable-image' ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-muted p-2 text-center">
          <CheckCircle2 className="h-6 w-6 text-primary mb-1" />
          <ImageIcon className="h-4 w-4 text-muted-foreground mb-1" />
          <span className="text-xs font-medium text-foreground">Uploaded</span>
          <span className="text-[10px] text-muted-foreground truncate max-w-full px-1">
            {getFileName(filePath).split('.').pop()?.toUpperCase()}
          </span>
        </div>
      ) : mediaType === 'video' ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-muted p-2 text-center">
          <CheckCircle2 className="h-6 w-6 text-primary mb-1" />
          <Film className="h-4 w-4 text-muted-foreground mb-1" />
          <span className="text-xs font-medium text-foreground">Uploaded</span>
          <span className="text-[10px] text-muted-foreground truncate max-w-full px-1">
            {getFileName(filePath).split('.').pop()?.toUpperCase()}
          </span>
        </div>
      ) : mediaType === 'audio' ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-muted p-2 text-center">
          <CheckCircle2 className="h-6 w-6 text-primary mb-1" />
          <Music className="h-4 w-4 text-muted-foreground mb-1" />
          <span className="text-xs font-medium text-foreground">Uploaded</span>
          <span className="text-[10px] text-muted-foreground truncate max-w-full px-1">
            {getFileName(filePath).split('.').pop()?.toUpperCase()}
          </span>
        </div>
      ) : error || (!isLoadingUrl && !signedUrl) ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-muted p-2 text-center">
          <CheckCircle2 className="h-6 w-6 text-primary mb-1" />
          <ImageIcon className="h-4 w-4 text-muted-foreground mb-1" />
          <span className="text-xs font-medium text-foreground">Uploaded</span>
          <span className="text-[10px] text-muted-foreground truncate max-w-full px-1">
            {getFileName(filePath).split('.').pop()?.toUpperCase()}
          </span>
        </div>
      ) : mediaType === 'document' ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-muted p-2 text-center">
          <CheckCircle2 className="h-6 w-6 text-primary mb-1" />
          <FileText className="h-4 w-4 text-muted-foreground mb-1" />
          <span className="text-xs font-medium text-foreground">Uploaded</span>
          <span className="text-[10px] text-muted-foreground truncate max-w-full px-1">
            {getFileName(filePath).split('.').pop()?.toUpperCase()}
          </span>
        </div>
      ) : null}
      
      {/* Clickable overlay for opening files */}
      {signedUrl && (
        <button
          className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors flex items-center justify-center gap-2 cursor-pointer group/overlay"
          onClick={() => window.open(signedUrl, '_blank')}
          aria-label="Open file in new tab"
        >
          <div className="opacity-0 group-hover/overlay:opacity-100 transition-opacity flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white">
              <ExternalLink className="h-4 w-4" />
            </div>
            {!readonly && onRemove && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white hover:bg-destructive/80"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </button>
      )}
    </div>
  );
}

export default function MediaPreview({ urls, onRemove, readonly = false, className }: MediaPreviewProps) {
  if (urls.length === 0) return null;

  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3", className)}>
      {urls.map((path) => (
        <MediaThumbnail
          key={path}
          filePath={path}
          readonly={readonly}
          onRemove={onRemove ? () => onRemove(path) : undefined}
        />
      ))}
    </div>
  );
}
