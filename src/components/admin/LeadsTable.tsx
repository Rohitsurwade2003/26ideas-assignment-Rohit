import { useState } from 'react';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

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

interface LeadsTableProps {
  leads: Lead[];
  onLeadClick: (leadId: string) => void;
}

export const LeadsTable = ({ leads, onLeadClick }: LeadsTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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

  return (
    <div className="bg-background-secondary rounded-lg border border-border-primary">
      <Table>
        <TableHeader>
          <TableRow className="border-border-primary">
            <TableHead className="text-text-secondary">Created At</TableHead>
            <TableHead className="text-text-secondary">Name</TableHead>
            <TableHead className="text-text-secondary">Company</TableHead>
            <TableHead className="text-text-secondary">Score</TableHead>
            <TableHead className="text-text-secondary">Band</TableHead>
            <TableHead className="text-text-secondary">Label</TableHead>
            <TableHead className="text-text-secondary">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow
              key={lead.id}
              className="border-border-primary cursor-pointer hover:bg-background-tertiary transition-colors"
              onClick={() => onLeadClick(lead.id)}
            >
              <TableCell className="text-text-primary">
                {formatDate(lead.created_at)}
              </TableCell>
              <TableCell className="text-text-primary font-medium">
                {lead.name}
              </TableCell>
              <TableCell className="text-text-primary">
                {lead.company || '-'}
              </TableCell>
              <TableCell className="text-text-primary">
                {lead.fit_score || '-'}
              </TableCell>
              <TableCell>
                {lead.fit_band ? (
                  <Badge className={getBandColor(lead.fit_band)}>
                    {lead.fit_band}
                  </Badge>
                ) : (
                  <span className="text-text-secondary">-</span>
                )}
              </TableCell>
              <TableCell className="text-text-primary">
                {lead.use_case_label || '-'}
              </TableCell>
              <TableCell className="text-text-primary">
                {lead.status || 'new'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};