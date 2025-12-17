import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Trash2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AccountSettings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') return;

    setIsDeleting(true);
    try {
      // Delete user data from all tables (cascade should handle most)
      // The auth.users deletion will cascade to profiles
      const { error } = await supabase.rpc('delete_user_account' as never);
      
      if (error) {
        // If no RPC exists, sign out and show message
        await signOut();
        toast({
          title: 'Account deletion requested',
          description: 'Please contact support to complete account deletion.',
        });
        navigate('/');
        return;
      }

      await signOut();
      toast({
        title: 'Account deleted',
        description: 'Your account and all data have been removed.',
      });
      navigate('/');
    } catch (error) {
      // Fallback - just sign out
      await signOut();
      toast({
        title: 'Signed out',
        description: 'Please contact support to complete account deletion.',
      });
      navigate('/');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Information
          </CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              value={user?.email || ''}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Your email cannot be changed from this page
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Display Name</Label>
            <Input
              value={user?.user_metadata?.full_name || 'Not set'}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Member Since</Label>
            <Input
              value={
                user?.created_at
                  ? new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Unknown'
              }
              disabled
              className="bg-muted"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Delete Account
          </CardTitle>
          <CardDescription>
            Permanently remove your account and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive" className="bg-destructive/5">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This action cannot be undone. All your messages, recipients,
              trusted contacts, and settings will be permanently deleted.
              Your loved ones will not receive any scheduled messages.
            </AlertDescription>
          </Alert>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete My Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-4">
                  <p>
                    This will permanently delete your account and all your data,
                    including:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>All your messages and drafts</li>
                    <li>Your recipients and their information</li>
                    <li>Your trusted contacts</li>
                    <li>Your last wishes document</li>
                    <li>All settings and preferences</li>
                  </ul>
                  <p className="font-medium text-destructive">
                    Your loved ones will not receive any of your messages.
                  </p>
                  <div className="pt-2">
                    <Label htmlFor="delete-confirm">
                      Type <span className="font-mono font-bold">DELETE</span> to
                      confirm:
                    </Label>
                    <Input
                      id="delete-confirm"
                      value={deleteConfirmation}
                      onChange={(e) =>
                        setDeleteConfirmation(e.target.value.toUpperCase())
                      }
                      placeholder="DELETE"
                      className="mt-2"
                    />
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteConfirmation('')}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmation !== 'DELETE' || isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
