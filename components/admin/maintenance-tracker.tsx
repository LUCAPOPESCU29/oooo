'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  Home,
  Calendar,
  User,
  Mail,
  Loader2
} from 'lucide-react';

interface MaintenanceTask {
  id: number;
  cabin: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed';
  reportedBy: string;
  reportedByEmail: string;
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
}

export function MaintenanceTracker() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/maintenance');
      const data = await response.json();
      setTasks(data.issues || []);
    } catch (error) {
      console.error('Failed to fetch maintenance tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const priorityColors = {
    low: 'bg-blue-100 text-blue-700 border-blue-300',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    high: 'bg-orange-100 text-orange-700 border-orange-300',
    urgent: 'bg-red-100 text-red-700 border-red-300',
  };

  const statusIcons = {
    pending: Clock,
    'in-progress': AlertTriangle,
    completed: CheckCircle,
  };

  const updateTaskStatus = async (taskId: number, newStatus: MaintenanceTask['status']) => {
    try {
      const response = await fetch('/api/maintenance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status: newStatus })
      });

      if (response.ok) {
        setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)));
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-orange-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Wrench className="text-orange-600" size={28} />
          Maintenance Tracker
        </h2>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <Clock size={32} className="mb-3 opacity-80" />
          <div className="text-3xl font-bold">{tasks.filter((t) => t.status === 'pending').length}</div>
          <div className="text-blue-100">Pending</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
          <AlertTriangle size={32} className="mb-3 opacity-80" />
          <div className="text-3xl font-bold">{tasks.filter((t) => t.status === 'in-progress').length}</div>
          <div className="text-yellow-100">In Progress</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <CheckCircle size={32} className="mb-3 opacity-80" />
          <div className="text-3xl font-bold">{tasks.filter((t) => t.status === 'completed').length}</div>
          <div className="text-green-100">Completed</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white">
          <AlertTriangle size={32} className="mb-3 opacity-80" />
          <div className="text-3xl font-bold">{tasks.filter((t) => t.priority === 'urgent').length}</div>
          <div className="text-red-100">Urgent</div>
        </div>
      </div>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Wrench size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Maintenance Issues</h3>
          <p className="text-gray-600">All maintenance tasks are completed or no issues have been reported yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task, index) => {
            const StatusIcon = statusIcons[task.status];
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{task.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${
                          priorityColors[task.priority]
                        }`}
                      >
                        {task.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{task.description}</p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Home size={16} className="text-orange-600" />
                        <span className="font-medium text-gray-900">{task.cabin}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-orange-600" />
                        <span>{task.reportedBy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-orange-600" />
                        <span>{task.reportedByEmail}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-orange-600" />
                        <span>Reported: {new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>
                      {task.assignedTo && (
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-green-600" />
                          <span>Assigned: {task.assignedTo}</span>
                        </div>
                      )}
                      {task.dueDate && (
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-red-600" />
                          <span>Due: {task.dueDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <StatusIcon
                    size={32}
                    className={
                      task.status === 'completed'
                        ? 'text-green-500'
                        : task.status === 'in-progress'
                        ? 'text-yellow-500'
                        : 'text-gray-400'
                    }
                  />
                </div>

                {/* Status Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => updateTaskStatus(task.id, 'pending')}
                    className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                      task.status === 'pending'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => updateTaskStatus(task.id, 'in-progress')}
                    className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                      task.status === 'in-progress'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => updateTaskStatus(task.id, 'completed')}
                    className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                      task.status === 'completed'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
