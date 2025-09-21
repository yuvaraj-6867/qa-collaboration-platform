import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

import { DashboardMetrics, Activity } from '@/types';
import { dashboardApi, projectsApi } from '@/lib/api';
import { TrendingUp, CheckCircle, AlertCircle, Activity as ActivityIcon, FolderOpen, Plus } from 'lucide-react';

const Dashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [userActivity, setUserActivity] = useState({
    onlineUsers: 0,
    todayActive: 0,
    weekActive: 0,
    users: []
  });
  
  const [chartData, setChartData] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [error, setError] = useState('');

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'active' as 'active' | 'inactive'
  });


  useEffect(() => {
    loadData();
    loadUserActivity();
    loadTrends();
    
    const interval = setInterval(() => {
      loadUserActivity();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  


  const [projects, setProjects] = useState<any[]>([]);

  const loadData = async () => {
    try {
      // Fetch metrics
      const metricsResult = await dashboardApi.getMetrics();
      setMetrics(metricsResult.data);

      // Fetch projects
      const projectsResult = await projectsApi.getAll();
      setProjects(projectsResult.data);

      setActivities([]);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserActivity = async () => {
    try {
      const result = await dashboardApi.getUserActivity();
      setUserActivity(result.data);
    } catch (error) {
      console.error('Failed to load user activity:', error);
    }
  };

  const loadTrends = async () => {
    try {
      const result = await dashboardApi.getTrends();
      const chartValues = result.data.pass_fail_trend.map((item: any) => item.passed + item.failed);
      setChartData(chartValues);
    } catch (error) {
      console.error('Failed to load trends:', error);
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
    
    try {
      await projectsApi.create(newProject);
      
      if ((window as any).addNotification) {
        (window as any).addNotification(
          'Project Created',
          `Project "${newProject.name}" has been created successfully`,
          'success'
        );
      }
      setNewProject({ name: '', description: '', status: 'active' });
      setIsCreateDialogOpen(false);
      loadData();
    } catch (error) {
      console.error('Failed to create project:', error);
      setError('Failed to create project');
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">QA Dashboard</h1>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white">Create New Project</DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Create a new project to organize your test cases and tickets.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div>
                <Label className="text-gray-900 dark:text-white">Project Name *</Label>
                <Input
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Enter project name"
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <Label className="text-gray-900 dark:text-white">Description *</Label>
                <Textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Enter project description"
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={4}
                />
              </div>

              <div>
                <Label className="text-gray-900 dark:text-white">Status</Label>
                <Select value={newProject.status} onValueChange={(value: 'active' | 'inactive') => setNewProject({ ...newProject, status: value })}>
                  <SelectTrigger className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Create Project
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
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
              {projects.length} total projects
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Section */}
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center">
            <FolderOpen className="h-5 w-5 mr-2 text-purple-600" />
            Recent Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">No projects created yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.slice(0, 6).map((project) => (
                <div key={project.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">{project.name}</h3>
                    <Badge className={`text-xs ${
                      project.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{project.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Created: {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center">
              <ActivityIcon className="h-5 w-5 mr-2 text-blue-600" />
              User Activity Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Active Users */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">Online Now</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mt-1">{userActivity.onlineUsers}</div>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Today Active</div>
                  <div className="text-2xl font-bold text-blue-600 mt-1">{userActivity.todayActive}</div>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-sm font-medium text-purple-700 dark:text-purple-300">This Week</div>
                  <div className="text-2xl font-bold text-purple-600 mt-1">{userActivity.weekActive}</div>
                </div>
              </div>

              {/* User Activities */}
              <div className="space-y-3">
                {userActivity.users.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No user activity data available
                  </div>
                ) : (
                  userActivity.users.map((user: any, index: number) => {
                    const colors = ['blue', 'green', 'purple', 'orange', 'red', 'indigo'];
                    const color = colors[index % colors.length];
                    return (
                      <div key={user.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <div className={`w-10 h-10 bg-${color}-600 rounded-full flex items-center justify-center text-white font-medium text-sm`}>
                          {user.initials}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                            <div className={`w-2 h-2 rounded-full ${
                              user.status === 'online' ? 'bg-green-500' : 
                              user.status === 'away' ? 'bg-orange-500' : 'bg-gray-400'
                            }`}></div>
                            <span className={`text-xs ${
                              user.status === 'online' ? 'text-green-600' : 
                              user.status === 'away' ? 'text-orange-600' : 'text-gray-500'
                            }`}>{user.status}</span>
                          </div>
                          <p className="text-xs text-gray-500">{user.activity} • Active: {user.active_time}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400">Last seen: {user.last_seen}</div>
                          <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1 mt-1">
                            <div className={`bg-${user.status === 'online' ? 'green' : user.status === 'away' ? 'orange' : 'gray'}-500 h-1 rounded-full`} style={{width: `${user.progress}%`}}></div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Activity Graph */}
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Activity Timeline (Last 5 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-2 text-center text-xs text-gray-500">
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
              </div>
              <div className="grid grid-cols-5 gap-2 h-32">
                {chartData.length > 0 ? chartData.map((value: number, index: number) => {
                  const colors = ['blue', 'green', 'purple', 'orange', 'red', 'indigo', 'teal'];
                  const maxValue = Math.max(...chartData, 1);
                  return (
                    <div key={index} className="flex flex-col justify-end space-y-1">
                      <div className={`bg-${colors[index]}-500 rounded-sm`} style={{height: `${(value / maxValue) * 100}%`}}></div>
                      <div className="text-xs text-center text-gray-500">{value}</div>
                    </div>
                  );
                }) : (
                  <div className="col-span-5 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    No trend data available
                  </div>
                )}
              </div>
              <div className="flex justify-center space-x-6 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Test Cases</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Tickets</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Documents</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
