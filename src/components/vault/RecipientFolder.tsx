import { ReactNode } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface RecipientFolderProps {
  name: string;
  relationship?: string;
  messageCount: number;
  isSelected: boolean;
  onClick: () => void;
  icon?: ReactNode;
}

export default function RecipientFolder({
  name,
  relationship,
  messageCount,
  isSelected,
  onClick,
  icon,
}: RecipientFolderProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200",
        "hover:bg-accent/50",
        isSelected && "bg-accent shadow-sm"
      )}
    >
      {icon ? (
        <div className={cn(
          "flex items-center justify-center h-9 w-9 rounded-full",
          isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
        )}>
          {icon}
        </div>
      ) : (
        <Avatar className="h-9 w-9">
          <AvatarFallback className={cn(
            "text-xs font-medium",
            isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
          )}>
            {initials}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium truncate",
          isSelected ? "text-foreground" : "text-muted-foreground"
        )}>
          {name}
        </p>
        {relationship && (
          <p className="text-xs text-muted-foreground truncate">{relationship}</p>
        )}
      </div>
      
      <span className={cn(
        "text-xs font-medium px-2 py-0.5 rounded-full",
        isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
      )}>
        {messageCount}
      </span>
    </button>
  );
}
