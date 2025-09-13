import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DashboardMetrics, Activity, Project } from '@/types';
import { TrendingUp, CheckCircle, AlertCircle, Activity as ActivityIcon, Plus, FolderOpen } from 'lucide-react';

const Dashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [, setActivities] = useState<Activity[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch('/api/v1/projects');
      const projectsData = await response.json();
      setProjects(projectsData || []);

      const savedTestCases = localStorage.getItem('testCases');
      const savedTickets = localStorage.getItem('tickets');
      const testCases = savedTestCases ? JSON.parse(savedTestCases) : [];
      const tickets = savedTickets ? JSON.parse(savedTickets) : [];

      setMetrics({
        test_metrics: {
          total_test_cases: testCases.length,
          active_test_cases: testCases.filter((tc: any) => tc.status === 'active').length,
          pass_rate: 85,
          recent_runs: 0
        },
        ticket_metrics: {
          total_tickets: tickets.length,
          open_tickets: tickets.filter((t: any) => t.status === 'To Do').length,
          closed_tickets: tickets.filter((t: any) => t.status === 'Done').length,
          critical_tickets: tickets.filter((t: any) => t.priority === 'critical').length
        },
        automation_metrics: { automation_coverage: 0, automated_runs: 0, manual_runs: 0 },
        document_metrics: { total_documents: 0, recent_uploads: 0 }
      });
      setActivities([]);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.name.trim()) {
      setError('Project name is required');
      return;
    }

    if (!newProject.description.trim()) {
      setError('Project description is required');
      return;
    }

    setError('');

    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    try {
      const response = await fetch('/api/v1/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Data': JSON.stringify(user || {})
        },
        body: JSON.stringify({
          project: {
            name: newProject.name,
            description: newProject.description,
            status: 'active'
          }
        }),
      });

      if (response.ok) {
        const createdProject = await response.json();
        setProjects([createdProject, ...projects]);
        setNewProject({ name: '', description: '' });
        setShowCreateProject(false);
      } else {
        const errorData = await response.json();
        setError(errorData.errors ? Object.values(errorData.errors).join(', ') : 'Failed to create project');
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      setError('Network error occurred');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">QA Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Real-time quality assurance metrics</p>
        </div>
        <Dialog open={showCreateProject} onOpenChange={setShowCreateProject}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}
              <Input
                placeholder="Project name *"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              />
              <Textarea
                placeholder="Project description *"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              />
              <Button onClick={handleCreateProject} className="w-full">
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Section */}
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center">
            <FolderOpen className="h-5 w-5 mr-2 text-blue-600" />
            Projects ({projects.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </div>
                  {project.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{project.description}</p>
                  )}
                  <div className="text-xs text-gray-500">
                    Created by {project.created_by} • {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">No projects created yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Existing metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Test Cases</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics?.test_metrics.total_test_cases || 0}
            </div>
            <p className="text-xs text-green-600 mt-1">
              {metrics?.test_metrics.active_test_cases || 0} active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Pass Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics?.test_metrics.pass_rate || 0}%
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Tickets</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics?.ticket_metrics.open_tickets || 0}
            </div>
            <p className="text-xs text-orange-600 mt-1">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {projects.filter(p => p.status === 'active').length}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Total: {projects.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Existing charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Test Results Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-900 dark:text-white">Pass Rate</span>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {metrics?.test_metrics.pass_rate || 0}%
                </Badge>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${metrics?.test_metrics.pass_rate || 0}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center">
              <ActivityIcon className="h-5 w-5 mr-2 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <ActivityIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
