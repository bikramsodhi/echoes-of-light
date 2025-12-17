import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/components/layout/AppLayout';
import PrivacySettings from '@/components/settings/PrivacySettings';
import LastWishesEditor from '@/components/settings/LastWishesEditor';
import AccountSettings from '@/components/settings/AccountSettings';
import { Shield, FileText, User } from 'lucide-react';

export default function Settings() {
  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your preferences, privacy, and account
          </p>
        </div>

        <Tabs defaultValue="privacy" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="last-wishes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Last Wishes</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="privacy">
            <PrivacySettings />
          </TabsContent>

          <TabsContent value="last-wishes">
            <LastWishesEditor />
          </TabsContent>

          <TabsContent value="account">
            <AccountSettings />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
