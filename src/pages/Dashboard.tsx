import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, FileText, Users, Settings, LogOut, Plus, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl text-foreground">EchoLight</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Welcome Section */}
        <div className="mb-10 animate-fade-in">
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-2">
            Welcome back, {firstName}
          </h1>
          <p className="text-muted-foreground text-lg">
            Your space of memory awaits. What would you like to leave behind today?
          </p>
        </div>

        {/* Emotional Nudge */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 animate-fade-in animation-delay-200">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-foreground font-medium mb-1">
                  A gentle thought for today
                </p>
                <p className="text-muted-foreground text-sm">
                  "What's one memory you'd want someone to carry with them, long after you're gone?"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10 animate-fade-in animation-delay-400">
          <Card className="group hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer">
            <CardHeader>
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-2 group-hover:bg-primary/20 transition-colors">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="font-serif text-xl">Create Message</CardTitle>
              <CardDescription>
                Begin a new letter, voice memo, or video for someone you love
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer">
            <CardHeader>
              <div className="p-3 rounded-lg bg-accent/20 w-fit mb-2 group-hover:bg-accent/30 transition-colors">
                <Users className="h-5 w-5 text-accent-foreground" />
              </div>
              <CardTitle className="font-serif text-xl">Recipients</CardTitle>
              <CardDescription>
                Manage the people who will receive your messages
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer">
            <CardHeader>
              <div className="p-3 rounded-lg bg-secondary w-fit mb-2 group-hover:bg-secondary/80 transition-colors">
                <FileText className="h-5 w-5 text-secondary-foreground" />
              </div>
              <CardTitle className="font-serif text-xl">Message Vault</CardTitle>
              <CardDescription>
                View and edit your saved messages and media
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Message Summary */}
        <div className="grid gap-4 md:grid-cols-3 animate-fade-in animation-delay-600">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Drafts</CardDescription>
              <CardTitle className="text-3xl font-serif">0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Messages in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Scheduled</CardDescription>
              <CardTitle className="text-3xl font-serif">0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Ready for delivery</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Recipients</CardDescription>
              <CardTitle className="text-3xl font-serif">0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">People you're writing for</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
