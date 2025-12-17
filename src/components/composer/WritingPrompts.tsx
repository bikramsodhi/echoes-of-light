import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WritingPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const promptCategories = [
  {
    title: 'Expressing Love',
    prompts: [
      'What do you admire most about this person?',
      'Describe a moment when they made you feel truly seen.',
      'What do you hope they always remember about you?',
    ],
  },
  {
    title: 'Sharing Memories',
    prompts: [
      'What is your favorite memory together?',
      'Describe a time they made you laugh until it hurt.',
      'What small moment together would you want to relive?',
    ],
  },
  {
    title: 'Offering Guidance',
    prompts: [
      'What life lesson do you wish you had learned sooner?',
      'What advice would you give them for difficult times?',
      'What do you hope they pursue in their life?',
    ],
  },
  {
    title: 'Saying Goodbye',
    prompts: [
      'What do you want them to know about your love for them?',
      'How do you hope they remember you?',
      'What final words of comfort would you offer?',
    ],
  },
];

export default function WritingPrompts({ onSelectPrompt }: WritingPromptsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <div className="border rounded-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-accent/30 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Writing Prompts</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 space-y-2">
          <p className="text-xs text-muted-foreground mb-3">
            Not sure where to start? These gentle prompts may help.
          </p>
          
          {promptCategories.map((category) => (
            <div key={category.title} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedCategory(
                  expandedCategory === category.title ? null : category.title
                )}
                className="w-full flex items-center justify-between p-2 hover:bg-accent/30 transition-colors text-left"
              >
                <span className="text-sm">{category.title}</span>
                {expandedCategory === category.title ? (
                  <ChevronUp className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                )}
              </button>

              {expandedCategory === category.title && (
                <div className="px-2 pb-2 space-y-1">
                  {category.prompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => onSelectPrompt(prompt)}
                      className={cn(
                        "w-full text-left text-xs p-2 rounded hover:bg-accent/50 transition-colors",
                        "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      "{prompt}"
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
