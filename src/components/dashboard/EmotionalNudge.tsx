import { Card, CardContent } from '@/components/ui/card';
import { Heart, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const nudges = [
  "What's one memory you'd want someone to carry with them, long after you're gone?",
  "If you could tell them one more thing, what would it be?",
  "What moment between you still makes you smile?",
  "What do you hope they'll remember about your time together?",
  "What advice would you give them for the hard days?",
  "What's something you've never said, but always wanted to?",
  "What would you want them to know about how much they mean to you?",
];

export default function EmotionalNudge() {
  const [currentNudge, setCurrentNudge] = useState(() => 
    nudges[Math.floor(Math.random() * nudges.length)]
  );

  const getNewNudge = () => {
    const availableNudges = nudges.filter(n => n !== currentNudge);
    setCurrentNudge(availableNudges[Math.floor(Math.random() * availableNudges.length)]);
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
      <CardContent className="py-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-primary/10 flex-shrink-0">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="text-foreground font-medium">
                A gentle thought for today
              </p>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={getNewNudge}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-muted-foreground text-sm italic">
              "{currentNudge}"
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
