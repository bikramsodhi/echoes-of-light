import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/layout/AppLayout';
import MessagePreview from '@/components/vault/MessagePreview';
import MediaUploader from '@/components/media/MediaUploader';
import MediaPreview from '@/components/media/MediaPreview';
import DeliveryScheduler from '@/components/delivery/DeliveryScheduler';
import TestDeliveryDialog from '@/components/delivery/TestDeliveryDialog';
import AIAssistButton from '@/components/composer/AIAssistButton';
import WritingPrompts from '@/components/composer/WritingPrompts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Save, Eye, Trash2, Loader2, Check, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import type { Tables } from '@/integrations/supabase/types';

type Message = Tables<'messages'>;
type Recipient = Tables<'recipients'>;

export default function MessageComposer() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [deliveryTrigger, setDeliveryTrigger] = useState<'posthumous' | 'scheduled' | 'manual'>('posthumous');
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [deliveryEvent, setDeliveryEvent] = useState<string | null>(null);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showTestDelivery, setShowTestDelivery] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const { deleteFile } = useMediaUpload();

  const isEditing = !!id;

  // Fetch message if editing
  const { data: message, isLoading: messageLoading } = useQuery({
    queryKey: ['message', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Message | null;
    },
    enabled: !!id,
  });

  // Fetch recipients
  const { data: recipients = [] } = useQuery({
    queryKey: ['recipients', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipients')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Recipient[];
    },
    enabled: !!user,
  });

  // Fetch message recipients
  const { data: messageRecipients = [] } = useQuery({
    queryKey: ['message_recipients', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from('message_recipients')
        .select('recipient_id')
        .eq('message_id', id);
      
      if (error) throw error;
      return data.map(mr => mr.recipient_id);
    },
    enabled: !!id,
  });

  // Initialize form when message loads
  useEffect(() => {
    if (message) {
      setTitle(message.title || '');
      setContent(message.content || '');
      setDeliveryTrigger(message.delivery_trigger || 'posthumous');
      setDeliveryDate(message.delivery_date ? new Date(message.delivery_date) : null);
      setDeliveryEvent(message.delivery_event || null);
      setMediaUrls(message.media_urls || []);
    }
  }, [message]);

  useEffect(() => {
    if (messageRecipients.length > 0) {
      setSelectedRecipients(messageRecipients);
    }
  }, [messageRecipients]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');

      const payload = {
        title: title || null,
        content: content || null,
        delivery_trigger: deliveryTrigger,
        delivery_date: deliveryDate?.toISOString() || null,
        delivery_event: deliveryEvent || null,
        media_urls: mediaUrls.length > 0 ? mediaUrls : null,
        status: 'draft' as const,
        user_id: user.id,
      };

      let messageId = id;

      if (isEditing && id) {
        const { error } = await supabase
          .from('messages')
          .update(payload)
          .eq('id', id);
        
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('messages')
          .insert(payload)
          .select('id')
          .single();
        
        if (error) throw error;
        messageId = data.id;
      }

      // Update message recipients
      if (messageId) {
        // Delete existing
        await supabase
          .from('message_recipients')
          .delete()
          .eq('message_id', messageId);

        // Insert new
        if (selectedRecipients.length > 0) {
          const { error } = await supabase
            .from('message_recipients')
            .insert(selectedRecipients.map(recipientId => ({
              message_id: messageId!,
              recipient_id: recipientId,
            })));
          
          if (error) throw error;
        }
      }

      return messageId;
    },
    onSuccess: (messageId) => {
      setLastSaved(new Date());
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['message', messageId] });
      queryClient.invalidateQueries({ queryKey: ['message_recipients'] });
      
      if (!isEditing && messageId) {
        navigate(`/vault/compose/${messageId}`, { replace: true });
      }
    },
    onError: () => {
      toast.error('Something interrupted the moment. Please try again.');
    },
  });

  // Auto-save with debounce
  const debouncedSave = useDebouncedCallback(() => {
    if (title || content) {
      setIsSaving(true);
      saveMutation.mutate();
      setTimeout(() => setIsSaving(false), 500);
    }
  }, 2000);

  useEffect(() => {
    if (isEditing) {
      debouncedSave();
    }
  }, [title, content, deliveryTrigger, deliveryDate, deliveryEvent, mediaUrls, selectedRecipients]);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('No message to delete');
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('Message released');
      navigate('/vault');
    },
    onError: () => {
      toast.error('Something interrupted the moment. Please try again.');
    },
  });

  const handleSave = () => {
    saveMutation.mutate();
    toast.success('Message saved');
  };

  const handleRecipientToggle = (recipientId: string) => {
    setSelectedRecipients(prev => 
      prev.includes(recipientId)
        ? prev.filter(rid => rid !== recipientId)
        : [...prev, recipientId]
    );
  };

  const handleMediaUpload = (urls: string[]) => {
    setMediaUrls(prev => [...prev, ...urls]);
  };

  const handleMediaRemove = async (url: string) => {
    await deleteFile(url);
    setMediaUrls(prev => prev.filter(u => u !== url));
  };

  if (messageLoading) {
    return (
      <AppLayout title="Loading...">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={isEditing ? 'Edit Message' : 'New Message'}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate('/vault')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Vault
          </Button>
          
          <div className="flex items-center gap-3">
            {lastSaved && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                {isSaving ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-3 w-3" />
                    Saved
                  </>
                )}
              </span>
            )}
            
            {isEditing && message && (
              <Button variant="outline" onClick={() => setShowTestDelivery(true)} className="gap-2">
                <Send className="h-4 w-4" />
                Test Delivery
              </Button>
            )}

            <Button variant="outline" onClick={() => setShowPreview(true)} className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            
            <Button onClick={handleSave} disabled={saveMutation.isPending} className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>

            {isEditing && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Give this message a name..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg"
            />
          </div>

          {/* Content */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Your Message</Label>
              <AIAssistButton 
                content={content} 
                recipientContext={
                  selectedRecipients.length === 1 
                    ? recipients.find(r => r.id === selectedRecipients[0])?.relationship || undefined
                    : undefined
                }
                onSuggestion={setAiSuggestion}
              />
            </div>
            <Textarea
              id="content"
              placeholder="What would you like to say? Take your time..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] resize-none text-base leading-relaxed"
            />
            
            {/* AI Suggestion Display */}
            {aiSuggestion && (
              <div className="bg-accent/30 border border-primary/20 rounded-lg p-4 animate-fade-in">
                <p className="text-sm text-muted-foreground mb-2">A gentle thought from your writing companion:</p>
                <p className="text-sm leading-relaxed italic">{aiSuggestion}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 text-xs"
                  onClick={() => setAiSuggestion(null)}
                >
                  Dismiss
                </Button>
              </div>
            )}
            
            {/* Writing Prompts */}
            <WritingPrompts onSelectPrompt={(prompt) => setAiSuggestion(prompt)} />
          </div>

          {/* Recipients */}
          <div className="space-y-3">
            <Label>Recipients</Label>
            {recipients.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No recipients yet.{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary"
                  onClick={() => navigate('/recipients')}
                >
                  Add someone
                </Button>
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {recipients.map(recipient => (
                  <label
                    key={recipient.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    <Checkbox
                      checked={selectedRecipients.includes(recipient.id)}
                      onCheckedChange={() => handleRecipientToggle(recipient.id)}
                    />
                    <span className="text-sm">{recipient.name}</span>
                    {recipient.relationship && (
                      <Badge variant="secondary" className="text-xs">
                        {recipient.relationship}
                      </Badge>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Media Uploads */}
          <div className="space-y-3">
            <Label>Attachments</Label>
            {mediaUrls.length > 0 && (
              <MediaPreview 
                urls={mediaUrls} 
                onRemove={handleMediaRemove}
              />
            )}
            <MediaUploader onUpload={handleMediaUpload} />
          </div>

          <Separator />

          {/* Delivery Trigger */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>When should this be delivered?</Label>
              <Select value={deliveryTrigger} onValueChange={(v) => setDeliveryTrigger(v as typeof deliveryTrigger)}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="posthumous">After I pass</SelectItem>
                  <SelectItem value="scheduled">On a specific date</SelectItem>
                  <SelectItem value="manual">When I choose</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Show scheduler for scheduled delivery */}
            {deliveryTrigger === 'scheduled' && (
              <DeliveryScheduler
                deliveryDate={deliveryDate}
                deliveryEvent={deliveryEvent}
                onDateChange={setDeliveryDate}
                onEventChange={setDeliveryEvent}
              />
            )}
          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <MessagePreview
        open={showPreview}
        onOpenChange={setShowPreview}
        title={title}
        content={content}
        recipients={recipients.filter(r => selectedRecipients.includes(r.id))}
        mediaUrls={mediaUrls}
      />

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Release this message?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this message. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteMutation.mutate()}
              className="bg-destructive hover:bg-destructive/90"
            >
              Release
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Test Delivery Dialog */}
      {message && (
        <TestDeliveryDialog
          open={showTestDelivery}
          onOpenChange={setShowTestDelivery}
          message={message}
          recipients={recipients.filter(r => selectedRecipients.includes(r.id))}
          onSendTest={() => toast.success('Test delivery sent to your email!')}
        />
      )}
    </AppLayout>
  );
}
