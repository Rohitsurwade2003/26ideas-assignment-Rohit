import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminSidebar } from '@/components/admin/Sidebar';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { LeadsTable } from '@/components/admin/LeadsTable';
import { LeadsFilter } from '@/components/admin/LeadsFilter';
import { LeadDetailModal } from '@/components/admin/LeadDetailModal';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { useToast } from '@/hooks/use-toast';

interface Lead {
  id: string;
  created_at: string;
  name: string;
  company: string | null;
  fit_score: number | null;
  fit_band: string | null;
  use_case_label: string | null;
  status: string | null;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [bandFilter, setBandFilter] = useState('All');
  const [labelFilter, setLabelFilter] = useState('All');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchLeads();
  }, [bandFilter, labelFilter]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('leads')
        .select('id, created_at, name, company, fit_score, fit_band, use_case_label, status')
        .order('created_at', { ascending: false });

      if (bandFilter !== 'All') {
        query = query.eq('fit_band', bandFilter);
      }

      if (labelFilter !== 'All') {
        query = query.eq('use_case_label', labelFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Error",
        description: "Failed to fetch leads.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLeadClick = (leadId: string) => {
    setSelectedLeadId(leadId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedLeadId(null);
  };

  const handleOutreachSuccess = () => {
    fetchLeads(); // Refresh the leads table
    setRefreshTrigger(prev => prev + 1); // Refresh dashboard stats
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background-primary flex w-full">
        <AdminSidebar />
        
        <main className="flex-1 flex flex-col">
          <header className="flex h-16 items-center border-b border-border-primary bg-background-secondary px-6">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-h2 text-text-primary font-bold">Leads Dashboard</h1>
          </header>
          
          <div className="flex-1 p-8">
            <div className="max-w-6xl mx-auto">
              <DashboardStats refreshTrigger={refreshTrigger} />
              
              <LeadsFilter
                bandFilter={bandFilter}
                labelFilter={labelFilter}
                onBandFilterChange={setBandFilter}
                onLabelFilterChange={setLabelFilter}
              />

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-text-primary">Loading leads...</div>
                </div>
              ) : (
                <LeadsTable leads={leads} onLeadClick={handleLeadClick} />
              )}

              <LeadDetailModal
                leadId={selectedLeadId}
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSuccess={handleOutreachSuccess}
              />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;