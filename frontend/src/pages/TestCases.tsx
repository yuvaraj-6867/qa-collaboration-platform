import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TestCase } from '@/types';
import { Search, Filter, Plus, XCircle, FolderOpen, Folder } from 'lucide-react';

const TestCases: React.FC = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingTestCase, setViewingTestCase] = useState<TestCase | null>(null);

  const [user] = useState(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });

  const [newTestCase, setNewTestCase] = useState({
    title: '',
    description: '',
    preconditions: '',
    steps: [''],
    expected_results: '',
    test_data: '',
    priority: 1,
    status: 'draft' as TestCase['status'],
    assigned_user: '',
    created_by: user ? `${user.first_name} ${user.last_name}` : 'Unknown User',
    folder: 'General',
    automated: false,
    project_id: ''
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/v1/projects');
        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setProjects([]);
      }
    };
    fetchProjects();
    setTestCases([]);
    setLoading(false);
  }, []);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-red-500 text-white';
      case 2: return 'bg-orange-500 text-white';
      case 3: return 'bg-yellow-500 text-black';
      case 4: return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  useEffect(() => {
    const savedTestCases = localStorage.getItem('testCases');
    if (savedTestCases) {
      setTestCases(JSON.parse(savedTestCases));
    }
    setLoading(false);
  }, []);

  const handleCreateTestCase = async () => {
    try {
      const mockTestCase = {
        id: Date.now(),
        ...newTestCase,
        created_by: user ? `${user.first_name} ${user.last_name}` : 'Unknown User',
        pass_rate: 0,
        comments_count: 0,
        automation_scripts_count: 0,
        latest_run: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const updatedTestCases = [...testCases, mockTestCase];
      setTestCases(updatedTestCases);
      localStorage.setItem('testCases', JSON.stringify(updatedTestCases));

      setNewTestCase({
        title: '',
        description: '',
        preconditions: '',
        steps: [''],
        expected_results: '',
        test_data: '',
        priority: 1,
        status: 'draft' as TestCase['status'],
        assigned_user: '',
        created_by: user ? `${user.first_name} ${user.last_name}` : '',
        folder: '',
        automated: false,
        project_id: ''
      });

      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Failed to create test case:', error);
    }
  };

  const addStep = () => {
    setNewTestCase({
      ...newTestCase,
      steps: [...newTestCase.steps, '']
    });
  };

  const updateStep = (index: number, value: string) => {
    const updatedSteps = [...newTestCase.steps];
    updatedSteps[index] = value;
    setNewTestCase({
      ...newTestCase,
      steps: updatedSteps
    });
  };

  const removeStep = (index: number) => {
    if (newTestCase.steps.length > 1) {
      const updatedSteps = newTestCase.steps.filter((_, i) => i !== index);
      setNewTestCase({
        ...newTestCase,
        steps: updatedSteps
      });
    }
  };

  const folders = ['All', 'General', 'Test Cases', 'Requirements', 'Reports', 'Automation'];
  
  const filteredTestCases = testCases.filter((testCase: any) => {
    const matchesSearch = testCase.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testCase.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = selectedFolder === 'All' || testCase.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const getTestCasesByFolder = () => {
    const grouped = testCases.reduce((acc: any, testCase: any) => {
      const folder = testCase.folder || 'General';
      if (!acc[folder]) acc[folder] = [];
      acc[folder].push(testCase);
      return acc;
    }, {});
    return grouped;
  };

  const testCasesByFolder = getTestCasesByFolder();

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Test Cases</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your test case library</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Test Case
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white">Create New Test Case</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-900 dark:text-white">Title</Label>
                <Input
                  value={newTestCase.title}
                  onChange={(e) => setNewTestCase({ ...newTestCase, title: e.target.value })}
                  placeholder="Enter test case title"
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <Label className="text-gray-900 dark:text-white">Description</Label>
                <Textarea
                  value={newTestCase.description}
                  onChange={(e) => setNewTestCase({ ...newTestCase, description: e.target.value })}
                  placeholder="Enter test case description"
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <Label className="text-gray-900 dark:text-white">Created By</Label>
                <Input
                  value={user ? `${user.first_name} ${user.last_name}` : 'Unknown User'}
                  readOnly
                  className="bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-900 dark:text-white">Project</Label>
                  <Select value={newTestCase.project_id} onValueChange={(value) => setNewTestCase({ ...newTestCase, project_id: value })}>
                    <SelectTrigger className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-900 dark:text-white">Folder</Label>
                  <Select value={newTestCase.folder} onValueChange={(value) => setNewTestCase({ ...newTestCase, folder: value })}>
                    <SelectTrigger className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Select folder" />
                    </SelectTrigger>
                    <SelectContent>
                      {folders.filter(f => f !== 'All').map((folder) => (
                        <SelectItem key={folder} value={folder}>
                          {folder}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="automated"
                  checked={newTestCase.automated}
                  onChange={(e) => setNewTestCase({ ...newTestCase, automated: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="automated" className="text-gray-900 dark:text-white">
                  Automated Test Case
                </Label>
              </div>

              <div>
                <Label className="text-gray-900 dark:text-white">Preconditions</Label>
                <Textarea
                  value={newTestCase.preconditions}
                  onChange={(e) => setNewTestCase({ ...newTestCase, preconditions: e.target.value })}
                  placeholder="Enter preconditions"
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <Label className="text-gray-900 dark:text-white">Test Steps</Label>
                {newTestCase.steps.map((step, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={step}
                      onChange={(e) => updateStep(index, e.target.value)}
                      placeholder={`Step ${index + 1}`}
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    {newTestCase.steps.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeStep(index)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addStep}
                  className="mt-2"
                >
                  Add Step
                </Button>
              </div>

              <div>
                <Label className="text-gray-900 dark:text-white">Expected Results</Label>
                <Textarea
                  value={newTestCase.expected_results}
                  onChange={(e) => setNewTestCase({ ...newTestCase, expected_results: e.target.value })}
                  placeholder="Enter expected results"
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-900 dark:text-white">Priority</Label>
                  <Select value={newTestCase.priority.toString()} onValueChange={(value) => setNewTestCase({ ...newTestCase, priority: parseInt(value) })}>
                    <SelectTrigger className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      <SelectItem value="1">Critical</SelectItem>
                      <SelectItem value="2">High</SelectItem>
                      <SelectItem value="3">Medium</SelectItem>
                      <SelectItem value="4">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-900 dark:text-white">Status</Label>
                  <Select value={newTestCase.status} onValueChange={(value: TestCase['status']) => setNewTestCase({ ...newTestCase, status: value })}>
                    <SelectTrigger className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTestCase} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Create Test Case
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search test cases..."
            className="pl-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedFolder} onValueChange={setSelectedFolder}>
          <SelectTrigger className="w-48">
            <FolderOpen className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {folders.map((folder) => (
              <SelectItem key={folder} value={folder}>
                <div className="flex items-center">
                  <Folder className="h-4 w-4 mr-2" />
                  {folder} {folder !== 'All' && testCasesByFolder[folder] ? `(${testCasesByFolder[folder].length})` : ''}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTestCases.length === 0 ? (
          <Card className="col-span-full bg-white dark:bg-gray-800">
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-gray-500 dark:text-gray-400">No test cases found</p>
            </CardContent>
          </Card>
        ) : (
          filteredTestCases.map((testCase: any) => (
            <Card key={testCase.id} className="hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-gray-900 dark:text-white">{testCase.title}</CardTitle>
                    <CardDescription className="mt-1 text-gray-600 dark:text-gray-400">
                      {testCase.description}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Badge className={`text-xs ${getPriorityColor(testCase.priority)}`}>
                      P{testCase.priority}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(testCase.status)}`}>
                      {testCase.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <span className="font-medium">Pass Rate:</span> {testCase.pass_rate || 0}%
                  </div>
                  <div>
                    <span className="font-medium">Automated:</span> {testCase.automated ? 'Yes' : 'No'}
                  </div>
                  <div>
                    <span className="font-medium">Created by:</span> {testCase.created_by || 'Unknown'}
                  </div>
                  {testCase.folder && (
                    <div>
                      <span className="font-medium">Folder:</span> {testCase.folder}
                    </div>
                  )}
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setViewingTestCase(testCase);
                      setIsViewDialogOpen(true);
                    }}
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Test Case Details</DialogTitle>
          </DialogHeader>
          {viewingTestCase && (
            <div className="space-y-6">
              <div>
                <Label className="font-semibold text-gray-900 dark:text-white">Title</Label>
                <p className="mt-1 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded text-gray-900 dark:text-white">
                  {viewingTestCase.title}
                </p>
              </div>

              <div>
                <Label className="font-semibold text-gray-900 dark:text-white">Description</Label>
                <p className="mt-1 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded text-gray-900 dark:text-white">
                  {viewingTestCase.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold text-gray-900 dark:text-white">Created By</Label>
                  <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-white">
                    {viewingTestCase.created_by || 'Unknown'}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold text-gray-900 dark:text-white">Automated</Label>
                  <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-white">
                    {viewingTestCase.automated ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>

              {viewingTestCase.preconditions && (
                <div>
                  <Label className="font-semibold text-gray-900 dark:text-white">Preconditions</Label>
                  <p className="mt-1 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded text-gray-900 dark:text-white">
                    {viewingTestCase.preconditions}
                  </p>
                </div>
              )}

              <div>
                <Label className="font-semibold text-gray-900 dark:text-white">Test Steps</Label>
                <div className="mt-1 space-y-2">
                  {viewingTestCase.steps?.map((step: string, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-white">
                      <span className="font-medium">Step {index + 1}:</span> {step}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="font-semibold text-gray-900 dark:text-white">Expected Results</Label>
                <p className="mt-1 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded text-gray-900 dark:text-white">
                  {viewingTestCase.expected_results}
                </p>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestCases;
