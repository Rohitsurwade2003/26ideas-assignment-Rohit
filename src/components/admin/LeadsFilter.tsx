import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';

interface LeadsFilterProps {
  bandFilter: string;
  labelFilter: string;
  onBandFilterChange: (value: string) => void;
  onLabelFilterChange: (value: string) => void;
}

export const LeadsFilter = ({
  bandFilter,
  labelFilter,
  onBandFilterChange,
  onLabelFilterChange,
}: LeadsFilterProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-1">
        <Label className="text-subtext text-text-secondary">Filter by Band</Label>
        <Select value={bandFilter} onValueChange={onBandFilterChange}>
          <SelectTrigger className="mt-1 bg-background-primary border-border-primary text-text-primary">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="bg-background-secondary border-border-primary">
            <SelectItem value="All" className="text-text-primary">All</SelectItem>
            <SelectItem value="High" className="text-text-primary">High</SelectItem>
            <SelectItem value="Medium" className="text-text-primary">Medium</SelectItem>
            <SelectItem value="Low" className="text-text-primary">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Label className="text-subtext text-text-secondary">Filter by Label</Label>
        <Select value={labelFilter} onValueChange={onLabelFilterChange}>
          <SelectTrigger className="mt-1 bg-background-primary border-border-primary text-text-primary">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="bg-background-secondary border-border-primary">
            <SelectItem value="All" className="text-text-primary">All</SelectItem>
            <SelectItem value="Internal automation" className="text-text-primary">Internal automation</SelectItem>
            <SelectItem value="Customer support" className="text-text-primary">Customer support</SelectItem>
            <SelectItem value="Data processing" className="text-text-primary">Data processing</SelectItem>
            <SelectItem value="Sales ops" className="text-text-primary">Sales ops</SelectItem>
            <SelectItem value="Other" className="text-text-primary">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};