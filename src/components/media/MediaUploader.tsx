import { useState, useRef, useCallback } from 'react';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Image, Film, Music, FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaUploaderProps {
  onUpload: (urls: string[]) => void;
  maxFiles?: number;
  className?: string;
}

export default function MediaUploader({ onUpload, maxFiles = 10, className }: MediaUploaderProps) {
  const { uploadMultiple, isUploading, progress } = useMediaUpload();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const fileArray = Array.from(files).slice(0, maxFiles);
    const urls = await uploadMultiple(fileArray);
    
    if (urls.length > 0) {
      onUpload(urls);
    }
  }, [uploadMultiple, onUpload, maxFiles]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*,application/pdf"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-muted-foreground/25 hover:border-primary/50",
          isUploading && "pointer-events-none opacity-70"
        )}
      >
        {isUploading ? (
          <div className="space-y-4">
            <Loader2 className="h-10 w-10 mx-auto text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Uploading your memories...</p>
            {progress && (
              <Progress value={progress.percentage} className="max-w-xs mx-auto" />
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <Image className="h-6 w-6" />
              <Film className="h-6 w-6" />
              <Music className="h-6 w-6" />
              <FileText className="h-6 w-6" />
            </div>
            
            <div>
              <p className="text-foreground font-medium">
                Drop files here or{' '}
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary hover:underline"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Photos, videos, audio, and documents up to 50MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
