
import { useState } from 'react';
import { Edit, Trash, Clock, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Task } from './TodoApp';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'todo': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isOverdue = () => {
    if (!task.dueDate || task.status === 'completed') return false;
    const today = new Date().toISOString().split('T')[0];
    return task.dueDate < today;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(task.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${task.status === 'completed' ? 'opacity-75' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className={`font-semibold text-lg ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1">{task.description}</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDelete}
              className={showDeleteConfirm ? 'bg-red-100 text-red-700' : ''}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Select value={task.status} onValueChange={(value) => onStatusChange(task.id, value as Task['status'])}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          
          <Badge variant="outline" className={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>

          {task.dueDate && (
            <Badge variant="outline" className={`${isOverdue() ? 'bg-red-100 text-red-800 border-red-200' : 'bg-blue-100 text-blue-800 border-blue-200'}`}>
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(task.dueDate)}
              {isOverdue() && ' (Overdue)'}
            </Badge>
          )}

          {task.sharedWith && task.sharedWith.length > 0 && (
            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
              <Users className="w-3 h-3 mr-1" />
              Shared ({task.sharedWith.length})
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Created {formatDate(task.createdAt)}</span>
          {task.updatedAt !== task.createdAt && (
            <span>Updated {formatDate(task.updatedAt)}</span>
          )}
        </div>

        {showDeleteConfirm && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            Click delete again to confirm
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
