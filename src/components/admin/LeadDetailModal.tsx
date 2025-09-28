import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Loader2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LeadDetail {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  website: string | null;
  problem_text: string;
  fit_score: number | null;
  fit_band: string | null;
  use_case_label: string | null;
  rationale: string | null;
  status: string | null;
}

interface LeadDetailModalProps {
  leadId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LeadDetailModal = ({ leadId, isOpen, onClose, onSuccess }: LeadDetailModalProps) => {
  const { toast } = useToast();
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [sendingOutreach, setSendingOutreach] = useState(false);

  useEffect(() => {
    if (leadId && isOpen) {
      fetchLeadDetail();
    }
  }, [leadId, isOpen]);

  const fetchLeadDetail = async () => {
    if (!leadId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (error) throw error;
      setLead(data);
    } catch (error) {
      console.error('Error fetching lead:', error);
      toast({
        title: "Error",
        description: "Failed to fetch lead details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendOutreach = async () => {
    if (!leadId) return;

    setSendingOutreach(true);
    try {
      const response = await fetch('https://ideas26.app.n8n.cloud/webhook/d7bb661c-64d3-4b45-8b45-5dd0ecfeefbc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lead_id: leadId }),
      });

      if (!response.ok) {
        throw new Error('Failed to send outreach');
      }

      // Update the lead status to outreach_sent
      await supabase
        .from('leads')
        .update({ status: 'outreach_sent' })
        .eq('id', leadId);

      toast({
        title: "Success",
        description: "Outreach sent successfully!",
      });

      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error sending outreach:', error);
      toast({
        title: "Error",
        description: "Failed to send outreach. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingOutreach(false);
    }
  };

  const getBandColor = (band: string | null) => {
    switch (band) {
      case 'High':
        return 'bg-status-success text-white';
      case 'Medium':
        return 'bg-status-warning text-white';
      case 'Low':
        return 'bg-text-secondary text-white';
      default:
        return 'bg-background-tertiary text-text-secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-background-secondary border-border-primary">
        <DialogHeader>
          <DialogTitle className="text-h2 text-text-primary">Lead Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-accent-primary" />
          </div>
        ) : lead ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-subtext text-text-secondary font-medium mb-1">Name</h3>
                <p className="text-text-primary">{lead.name}</p>
              </div>
              <div>
                <h3 className="text-subtext text-text-secondary font-medium mb-1">Email</h3>
                <p className="text-text-primary">{lead.email}</p>
              </div>
              <div>
                <h3 className="text-subtext text-text-secondary font-medium mb-1">Company</h3>
                <p className="text-text-primary">{lead.company || '-'}</p>
              </div>
              <div>
                <h3 className="text-subtext text-text-secondary font-medium mb-1">Website</h3>
                <p className="text-text-primary">{lead.website || '-'}</p>
              </div>
              <div>
                <h3 className="text-subtext text-text-secondary font-medium mb-1">Created At</h3>
                <p className="text-text-primary">{formatDate(lead.created_at)}</p>
              </div>
              <div>
                <h3 className="text-subtext text-text-secondary font-medium mb-1">Status</h3>
                <p className="text-text-primary">{lead.status || 'new'}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <h3 className="text-subtext text-text-secondary font-medium mb-1">Score</h3>
                <p className="text-text-primary">{lead.fit_score || '-'}</p>
              </div>
              <div>
                <h3 className="text-subtext text-text-secondary font-medium mb-1">Band</h3>
                {lead.fit_band ? (
                  <Badge className={getBandColor(lead.fit_band)}>
                    {lead.fit_band}
                  </Badge>
                ) : (
                  <span className="text-text-secondary">-</span>
                )}
              </div>
              <div>
                <h3 className="text-subtext text-text-secondary font-medium mb-1">Use Case</h3>
                <p className="text-text-primary">{lead.use_case_label || '-'}</p>
              </div>
            </div>

            <div>
              <h3 className="text-subtext text-text-secondary font-medium mb-2">Problem Statement</h3>
              <div className="bg-background-primary p-4 rounded-lg border border-border-primary">
                <p className="text-text-primary whitespace-pre-wrap">{lead.problem_text}</p>
              </div>
            </div>

            {lead.rationale && (
              <div>
                <h3 className="text-subtext text-text-secondary font-medium mb-2">AI Rationale</h3>
                <div className="bg-background-primary p-4 rounded-lg border border-border-primary">
                  <p className="text-text-primary whitespace-pre-wrap">{lead.rationale}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-border-primary">
              <Button
                onClick={sendOutreach}
                disabled={lead.status === 'outreach_sent' || sendingOutreach}
                className="bg-accent-primary hover:bg-accent-primary-hover text-white"
              >
                {sendingOutreach ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Outreach
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-text-secondary">Failed to load lead details.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};