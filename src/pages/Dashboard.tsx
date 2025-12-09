import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import MessageSummary from '@/components/dashboard/MessageSummary';
import EmotionalNudge from '@/components/dashboard/EmotionalNudge';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { user } = useAuth();
  const { messageCounts, recipientCount, activities, isLoading } = useDashboardData();

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'there';

  return (
    <AppLayout title="Dashboard">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="animate-fade-in">
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-2">
            Welcome back, {firstName}
          </h1>
          <p className="text-muted-foreground text-lg">
            Your space of memory awaits. What would you like to leave behind today?
          </p>
        </div>

        {/* Emotional Nudge */}
        <div className="animate-fade-in animation-delay-200">
          <EmotionalNudge />
        </div>

        {/* Message Summary */}
        <div className="animate-fade-in animation-delay-400">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : (
            <MessageSummary
              drafts={messageCounts.drafts}
              scheduled={messageCounts.scheduled}
              sent={messageCounts.sent}
              recipients={recipientCount}
            />
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4 animate-fade-in animation-delay-600">
          <h2 className="font-serif text-xl text-foreground">Quick Actions</h2>
          <QuickActions />
        </div>

        {/* Recent Activity */}
        <div className="animate-fade-in animation-delay-600">
          <RecentActivity activities={activities} />
        </div>
      </div>
    </AppLayout>
  );
}
