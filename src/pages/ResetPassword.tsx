import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, Sparkles, ArrowLeft } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

export default function ResetPassword() {
  const [mode, setMode] = useState<'request' | 'update'>('request');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if we have a recovery token in the URL
  useState(() => {
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setMode('update');
    }
  });

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }
    
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setIsLoading(false);
    
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Something interrupted the moment',
        description: error.message,
      });
    } else {
      setEmailSent(true);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const result = passwordSchema.safeParse(password);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);
    
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Something interrupted the moment',
        description: error.message,
      });
    } else {
      toast({
        title: 'Password updated',
        description: 'Your password has been changed. Redirecting to your dashboard...',
      });
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="font-serif text-3xl text-foreground">EchoLight</span>
            </div>
          </div>
          
          <Card className="border-border/50 shadow-lg glow-soft">
            <CardHeader className="text-center">
              <CardTitle className="font-serif text-2xl">Check your email</CardTitle>
              <CardDescription className="mt-2">
                We've sent a gentle reminder to <strong>{email}</strong>. 
                Follow the link to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/auth')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to sign in
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="font-serif text-3xl text-foreground">EchoLight</span>
          </div>
          <p className="text-muted-foreground">
            {mode === 'request' ? 'Reset your password' : 'Create a new password'}
          </p>
        </div>

        <Card className="border-border/50 shadow-lg glow-soft">
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-serif text-2xl">
              {mode === 'request' ? 'Forgot Password' : 'New Password'}
            </CardTitle>
            <CardDescription>
              {mode === 'request' 
                ? "Enter your email and we'll send you a reset link" 
                : 'Choose a new password for your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mode === 'request' ? (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <a href="/auth" className="hover:text-primary transition-colors">
            <ArrowLeft className="inline h-3 w-3 mr-1" />
            Back to sign in
          </a>
        </p>
      </div>
    </div>
  );
}
