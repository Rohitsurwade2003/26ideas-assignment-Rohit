import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardStatsProps {
  refreshTrigger?: number;
}

interface Stats {
  totalLeads: number;
  bandStats: { [key: string]: number };
  labelStats: { [key: string]: number };
}

export const DashboardStats = ({ refreshTrigger }: DashboardStatsProps) => {
  const [stats, setStats] = useState<Stats>({
    totalLeads: 0,
    bandStats: {},
    labelStats: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Get total leads count
      const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });

      // Get leads by fit_band
      const { data: bandData } = await supabase
        .from('leads')
        .select('fit_band')
        .not('fit_band', 'is', null);

      // Get leads by use_case_label
      const { data: labelData } = await supabase
        .from('leads')
        .select('use_case_label')
        .not('use_case_label', 'is', null);

      // Process band stats
      const bandStats: { [key: string]: number } = {};
      bandData?.forEach(lead => {
        if (lead.fit_band) {
          bandStats[lead.fit_band] = (bandStats[lead.fit_band] || 0) + 1;
        }
      });

      // Process label stats
      const labelStats: { [key: string]: number } = {};
      labelData?.forEach(lead => {
        if (lead.use_case_label) {
          labelStats[lead.use_case_label] = (labelStats[lead.use_case_label] || 0) + 1;
        }
      });

      setStats({
        totalLeads: totalLeads || 0,
        bandStats,
        labelStats
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="bg-background-secondary border-border-primary">
            <CardHeader>
              <div className="h-4 bg-background-tertiary rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-background-tertiary rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getBandColor = (band: string) => {
    switch (band) {
      case 'High': return 'text-status-success';
      case 'Medium': return 'text-status-warning';
      case 'Low': return 'text-text-secondary';
      default: return 'text-text-primary';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Leads */}
      <Card className="bg-background-secondary border-border-primary">
        <CardHeader>
          <CardTitle className="text-h3 text-text-primary">Total Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent-primary">{stats.totalLeads}</div>
        </CardContent>
      </Card>

      {/* Leads by Fit Band */}
      <Card className="bg-background-secondary border-border-primary">
        <CardHeader>
          <CardTitle className="text-h3 text-text-primary">Fit Bands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {['High', 'Medium', 'Low'].map(band => (
              <div key={band} className="flex justify-between items-center">
                <span className={`text-subtext ${getBandColor(band)}`}>{band}</span>
                <span className="text-body text-text-primary font-medium">
                  {stats.bandStats[band] || 0}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leads by Use Case Label */}
      <Card className="bg-background-secondary border-border-primary">
        <CardHeader>
          <CardTitle className="text-h3 text-text-primary">Use Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {['Internal automation', 'Customer support', 'Data processing', 'Sales ops', 'Other'].map(label => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-subtext text-text-secondary text-sm">{label}</span>
                <span className="text-body text-text-primary font-medium">
                  {stats.labelStats[label] || 0}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};