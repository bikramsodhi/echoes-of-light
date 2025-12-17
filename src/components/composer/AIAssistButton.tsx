import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Sparkles, Loader2, Lightbulb, Wand2, HelpCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AIAssistButtonProps {
  content: string;
  recipientContext?: string;
  onSuggestion: (suggestion: string) => void;
}

type AssistType = 'prompt' | 'polish' | 'continue';

export default function AIAssistButton({ content, recipientContext, onSuggestion }: AIAssistButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const handleAssist = async (type: AssistType) => {
    setIsLoading(true);
    setSuggestion(null);

    try {
      const { data, error } = await supabase.functions.invoke('ai-writing-assistant', {
        body: { 
          type, 
          content: content || undefined,
          context: recipientContext || undefined
        }
      });

      if (error) throw error;
      
      if (data?.suggestion) {
        setSuggestion(data.suggestion);
        onSuggestion(data.suggestion);
      }
    } catch (error) {
      console.error('AI assist error:', error);
      toast.error('Something interrupted the moment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const options = [
    {
      type: 'prompt' as AssistType,
      icon: Lightbulb,
      label: 'Inspire me',
      description: 'Get a gentle writing prompt',
      disabled: false,
    },
    {
      type: 'polish' as AssistType,
      icon: Wand2,
      label: 'Polish my thoughts',
      description: 'Suggestions to refine your message',
      disabled: !content || content.length < 20,
    },
    {
      type: 'continue' as AssistType,
      icon: HelpCircle,
      label: 'Help me continue',
      description: 'Ideas for what to say next',
      disabled: !content || content.length < 10,
    },
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <Sparkles className="h-4 w-4" />
          Help me say this
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-3">
          <div className="space-y-1">
            <h4 className="font-medium text-sm">Writing Companion</h4>
            <p className="text-xs text-muted-foreground">
              A gentle guide to help you find the right words
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">Reflecting...</span>
            </div>
          ) : suggestion ? (
            <div className="space-y-3">
              <div className="bg-accent/50 rounded-lg p-3">
                <p className="text-sm leading-relaxed">{suggestion}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full"
                onClick={() => setSuggestion(null)}
              >
                Try something else
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {options.map((option) => (
                <button
                  key={option.type}
                  onClick={() => handleAssist(option.type)}
                  disabled={option.disabled}
                  className="w-full flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option.icon className="h-4 w-4 mt-0.5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{option.label}</p>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
