import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

type VerifyState = 'loading' | 'valid' | 'invalid' | 'accepted' | 'declined' | 'already_responded';

interface ContactInfo {
  id: string;
  name: string;
  userName: string;
}

export default function VerifyContact() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [state, setState] = useState<VerifyState>('loading');
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setState('invalid');
      return;
    }

    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      // Look up the contact by invite token
      const { data: contact, error } = await supabase
        .from('trusted_contacts')
        .select('id, name, status, user_id')
        .eq('invite_token', token)
        .maybeSingle();

      if (error) throw error;

      if (!contact) {
        setState('invalid');
        return;
      }

      if (contact.status !== 'pending') {
        setState('already_responded');
        return;
      }

      // Get the user's name who sent the invite
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', contact.user_id)
        .maybeSingle();

      setContactInfo({
        id: contact.id,
        name: contact.name,
        userName: profile?.full_name || 'Someone',
      });
      setState('valid');
    } catch (error) {
      console.error('Error verifying token:', error);
      setState('invalid');
    }
  };

  const handleResponse = async (accept: boolean) => {
    if (!contactInfo) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('trusted_contacts')
        .update({
          status: accept ? 'accepted' : 'declined',
          verified_at: accept ? new Date().toISOString() : null,
          verification_status: accept ? 'verified' : 'unverified',
        })
        .eq('id', contactInfo.id);

      if (error) throw error;

      setState(accept ? 'accepted' : 'declined');
      toast.success(accept ? 'You\'ve accepted the invitation' : 'You\'ve declined the invitation');
    } catch (error) {
      console.error('Error responding to invite:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        {state === 'loading' && (
          <CardContent className="py-16 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Verifying invitation...</p>
          </CardContent>
        )}

        {state === 'invalid' && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="font-serif text-2xl">Invalid Invitation</CardTitle>
              <CardDescription>
                This invitation link is invalid or has expired. Please contact the person who sent it.
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Button variant="outline" onClick={() => navigate('/')}>
                Go to Homepage
              </Button>
            </CardFooter>
          </>
        )}

        {state === 'already_responded' && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-amber-600" />
              </div>
              <CardTitle className="font-serif text-2xl">Already Responded</CardTitle>
              <CardDescription>
                You've already responded to this invitation.
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Button variant="outline" onClick={() => navigate('/')}>
                Go to Homepage
              </Button>
            </CardFooter>
          </>
        )}

        {state === 'valid' && contactInfo && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-serif text-2xl">Trusted Contact Invitation</CardTitle>
              <CardDescription className="text-base mt-2">
                <strong>{contactInfo.userName}</strong> has asked you to be their trusted contact on EchoLight.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                <p className="mb-3">
                  As a trusted contact, you may be asked to verify if {contactInfo.userName} has passed away. 
                  This helps ensure their messages are delivered to their loved ones at the right time.
                </p>
                <p>
                  This is a meaningful responsibility. Only accept if you're comfortable with this role.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleResponse(false)}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Decline'}
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={() => handleResponse(true)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Accept
                  </>
                )}
              </Button>
            </CardFooter>
          </>
        )}

        {state === 'accepted' && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="font-serif text-2xl">Thank You</CardTitle>
              <CardDescription className="text-base mt-2">
                You've accepted the invitation to be {contactInfo?.userName}'s trusted contact.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-sm text-muted-foreground">
                We'll contact you if verification is ever needed. Thank you for being there for someone you care about.
              </p>
            </CardContent>
            <CardFooter className="justify-center">
              <Button variant="outline" onClick={() => navigate('/')}>
                Go to Homepage
              </Button>
            </CardFooter>
          </>
        )}

        {state === 'declined' && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <XCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <CardTitle className="font-serif text-2xl">Invitation Declined</CardTitle>
              <CardDescription className="text-base mt-2">
                You've declined the invitation. We understand — this isn't for everyone.
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Button variant="outline" onClick={() => navigate('/')}>
                Go to Homepage
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
