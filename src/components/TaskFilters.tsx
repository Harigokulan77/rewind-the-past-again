
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { TaskFilters as ITaskFilters } from './TodoApp';

interface TaskFiltersProps {
  filters: ITaskFilters;
  onFiltersChange: (filters: ITaskFilters) => void;
}

const TaskFilters = ({ filters, onFiltersChange }: TaskFiltersProps) => {
  const updateFilter = (key: keyof ITaskFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilter = (key: keyof ITaskFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const activeFilterCount = Object.keys(filters).length;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={filters.status || 'all'} onValueChange={(value) => updateFilter('status', value === 'all' ? undefined : value)}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="todo">To Do</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.priority || 'all'} onValueChange={(value) => updateFilter('priority', value === 'all' ? undefined : value)}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priority</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant={filters.dueToday ? "default" : "outline"}
        size="sm"
        onClick={() => updateFilter('dueToday', !filters.dueToday)}
      >
        Due Today
      </Button>

      <Button
        variant={filters.overdue ? "destructive" : "outline"}
        size="sm"
        onClick={() => updateFilter('overdue', !filters.overdue)}
      >
        Overdue
      </Button>

      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
          </Badge>
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="w-3 h-3" />
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;
