import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function useOnboardingStatus() {
  const { user } = useAuth();
  const [isComplete, setIsComplete] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkOnboardingStatus() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking onboarding status:', error);
        setIsComplete(false);
      } else {
        setIsComplete(data?.onboarding_completed ?? false);
      }
      setIsLoading(false);
    }

    checkOnboardingStatus();
  }, [user]);

  return { isComplete, isLoading };
}
