
import { useState, useEffect } from 'react';
import { Plus, Filter, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';
import { useToast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string[];
  sharedWith?: string[];
  createdBy: string;
}

export interface TaskFilters {
  status?: string;
  priority?: string;
  dueToday?: boolean;
  overdue?: boolean;
  search?: string;
}

const TodoApp = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Mock data for demo - replace with real API calls
  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Complete project proposal',
        description: 'Write and submit the Q4 project proposal for the new feature',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current-user',
        sharedWith: ['john@example.com']
      },
      {
        id: '2',
        title: 'Review code changes',
        description: 'Review the pull request for the authentication module',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current-user'
      },
      {
        id: '3',
        title: 'Team meeting preparation',
        description: 'Prepare agenda and materials for weekly team sync',
        status: 'completed',
        priority: 'low',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current-user'
      }
    ];
    setTasks(mockTasks);
  }, []);

  // Apply filters whenever tasks or filters change
  useEffect(() => {
    let filtered = [...tasks];

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    if (filters.priority && filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    if (filters.dueToday) {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(task => task.dueDate === today);
    }

    if (filters.overdue) {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(task => task.dueDate && task.dueDate < today && task.status !== 'completed');
    }

    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  }, [tasks, filters, searchQuery]);

  const handleCreateTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title || '',
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user',
      sharedWith: taskData.sharedWith
    };

    setTasks(prev => [...prev, newTask]);
    setIsTaskFormOpen(false);
    toast({
      title: "Task created",
      description: "Your task has been created successfully.",
    });
  };

  const handleUpdateTask = (taskData: Partial<Task>) => {
    if (!editingTask) return;

    const updatedTask = {
      ...editingTask,
      ...taskData,
      updatedAt: new Date().toISOString()
    };

    setTasks(prev => prev.map(task => task.id === editingTask.id ? updatedTask : task));
    setEditingTask(null);
    setIsTaskFormOpen(false);
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast({
      title: "Task deleted",
      description: "Your task has been deleted successfully.",
    });
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
        : task
    ));
    toast({
      title: "Task updated",
      description: `Task marked as ${newStatus.replace('-', ' ')}.`,
    });
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const closeTaskForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    overdue: tasks.filter(t => {
      const today = new Date().toISOString().split('T')[0];
      return t.dueDate && t.dueDate < today && t.status !== 'completed';
    }).length
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
              <p className="text-gray-600">Manage your tasks efficiently</p>
            </div>
            <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingTask(null)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingTask ? 'Edit Task' : 'Create New Task'}
                  </DialogTitle>
                </DialogHeader>
                <TaskForm
                  task={editingTask}
                  onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                  onCancel={closeTaskForm}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-600">Total Tasks</h3>
            <p className="text-2xl font-bold text-gray-900">{taskStats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-600">Completed</h3>
            <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-600">In Progress</h3>
            <p className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-600">Overdue</h3>
            <p className="text-2xl font-bold text-red-600">{taskStats.overdue}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg border mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <TaskFilters filters={filters} onFiltersChange={setFilters} />
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="bg-white p-8 rounded-lg border text-center">
              <div className="text-gray-500">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                <p className="text-sm">
                  {tasks.length === 0 
                    ? "Create your first task to get started!" 
                    : "Try adjusting your filters or search query."
                  }
                </p>
              </div>
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEditForm}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
