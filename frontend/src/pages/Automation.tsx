import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Play, FileText, Calendar } from 'lucide-react';
import { usersApi } from '@/lib/api';


interface AutomationProps {
  addNotification?: (message: string) => void;
}

const Automation: React.FC<AutomationProps> = ({ addNotification }) => {
  const [scripts, setScripts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [testCases, setTestCases] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTestCases, setSelectedTestCases] = useState<string[]>([]);
  const [selectedBrowsers, setSelectedBrowsers] = useState<string[]>([]);
  const [newScript, setNewScript] = useState({
    scriptName: '',
    description: '',
    module: '',
    scriptId: '',

    scriptType: 'UI',
    framework: 'Playwright',
    language: 'TypeScript',
    tags: [] as string[],

    linkedTestCases: [] as string[],
    requirementId: '',

    environment: 'QA',
    browsers: [] as string[],
    dataSource: 'Static',
    preConditions: '',
    postConditions: '',

    scriptPath: '',
    repositoryUrl: '',
    branchName: 'main',

    schedule: '',
    retryCount: 2,
    timeout: 120,

    author: '',
    reviewer: '',
    status: 'Draft'
  });

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const modules = ['Login', 'Enquiry', 'Orders', 'Payment', 'Profile', 'Dashboard'];
  const scriptTypes = ['UI', 'API', 'Performance', 'Database'];
  const frameworks = ['Playwright', 'Selenium', 'Cypress', 'Postman', 'JMeter'];
  const languages = ['TypeScript', 'JavaScript', 'Python', 'Java', 'C#'];
  const availableTags = ['Smoke', 'Regression', 'Sanity', 'Critical', 'High', 'Medium', 'Low'];
  const environments = ['QA', 'UAT', 'Staging', 'Prod'];
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
  const dataSources = ['Static', 'Dynamic', 'Database', 'API'];
  const scriptStatuses = ['Draft', 'In Review', 'Approved', 'Active', 'Deprecated'];

  useEffect(() => {
    const savedScripts = localStorage.getItem('automationScripts');
    if (savedScripts) {
      setScripts(JSON.parse(savedScripts));
    }
    generateScriptId();
  }, []);

  useEffect(() => {
    if (isCreateDialogOpen) {
      fetchUsers();
      fetchTestCases();
    }
  }, [isCreateDialogOpen]);

  const fetchUsers = async () => {
    try {
      const response = await usersApi.getAll();
      setUsers(response.data);
    } catch (error) {
      setUsers([]);
    }
  };


  const fetchTestCases = async () => {
    const mockTestCases = [
      { id: 'TC-Login-01', title: 'Valid Login Test' },
      { id: 'TC-Login-02', title: 'Invalid Login Test' },
      { id: 'TC-Order-01', title: 'Create Order Test' },
      { id: 'TC-Payment-01', title: 'Payment Process Test' }
    ];
    setTestCases(mockTestCases);
  };

  const generateScriptId = () => {
    const id = `SCR-${String(Date.now()).slice(-4)}`;
    setNewScript(prev => ({ ...prev, scriptId: id }));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleTestCase = (testCase: string) => {
    setSelectedTestCases(prev =>
      prev.includes(testCase) ? prev.filter(tc => tc !== testCase) : [...prev, testCase]
    );
  };

  const toggleBrowser = (browser: string) => {
    setSelectedBrowsers(prev =>
      prev.includes(browser) ? prev.filter(b => b !== browser) : [...prev, browser]
    );
  };

  const handleCreateScript = () => {
    if (!newScript.scriptName.trim()) {
      alert('Script Name is required');
      return;
    }

    const script = {
      id: Date.now(),
      ...newScript,
      tags: selectedTags,
      linkedTestCases: selectedTestCases,
      browsers: selectedBrowsers,
      author: newScript.author || `${currentUser.first_name} ${currentUser.last_name}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const updatedScripts = [...scripts, script];
    setScripts(updatedScripts);
    localStorage.setItem('automationScripts', JSON.stringify(updatedScripts));

    setIsCreateDialogOpen(false);
    addNotification?.(`🤖 Automation script "${newScript.scriptName}" created successfully!`);
    addNotification?.(`🔧 Framework: ${newScript.framework} (${newScript.language})`);
    if (selectedTestCases.length > 0) {
      addNotification?.(`🔗 Linked to ${selectedTestCases.length} test case(s)`);
    }
    if (selectedBrowsers.length > 0) {
      addNotification?.(`🌐 Configured for: ${selectedBrowsers.join(', ')}`);
    }
    setSelectedTags([]);
    setSelectedTestCases([]);
    setSelectedBrowsers([]);
    setNewScript({
      scriptName: '',
      description: '',
      module: '',
      scriptId: '',
      scriptType: 'UI',
      framework: 'Playwright',
      language: 'TypeScript',
      tags: [],
      linkedTestCases: [],
      requirementId: '',
      environment: 'QA',
      browsers: [],
      dataSource: 'Static',
      preConditions: '',
      postConditions: '',
      scriptPath: '',
      repositoryUrl: '',
      branchName: 'main',
      schedule: '',
      retryCount: 2,
      timeout: 120,
      author: '',
      reviewer: '',
      status: 'Draft'
    });
    generateScriptId();
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Draft': 'bg-gray-100 text-gray-800',
      'In Review': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Active': 'bg-blue-100 text-blue-800',
      'Deprecated': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredScripts = scripts.filter(script =>
    script.scriptName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    script.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white"> Automation Scripts</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Script
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Automation Script</DialogTitle>
              <DialogDescription className="text-gray-600">
                Create a comprehensive automation script with execution details and test case linkage.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🔹 1. Basic Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Script Name / Title *</Label>
                    <Input
                      value={newScript.scriptName}
                      onChange={(e) => setNewScript({ ...newScript, scriptName: e.target.value })}
                      placeholder="Login_Page_ValidUser"
                    />
                  </div>
                  <div>
                    <Label>Script ID / Reference</Label>
                    <Input
                      value={newScript.scriptId}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newScript.description}
                    onChange={(e) => setNewScript({ ...newScript, description: e.target.value })}
                    placeholder="Valid login flow with correct credentials"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Module / Feature</Label>
                  <Select value={newScript.module} onValueChange={(value) => setNewScript({ ...newScript, module: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select module" />
                    </SelectTrigger>
                    <SelectContent>
                      {modules.map(module => (
                        <SelectItem key={module} value={module}>{module}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Script Type & Metadata */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🔹 2. Script Type & Metadata</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Script Type</Label>
                    <Select value={newScript.scriptType} onValueChange={(value) => setNewScript({ ...newScript, scriptType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {scriptTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tool / Framework</Label>
                    <Select value={newScript.framework} onValueChange={(value) => setNewScript({ ...newScript, framework: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {frameworks.map(framework => (
                          <SelectItem key={framework} value={framework}>{framework}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Programming Language</Label>
                    <Select value={newScript.language} onValueChange={(value) => setNewScript({ ...newScript, language: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map(lang => (
                          <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Tags / Labels</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableTags.map(tag => (
                      <Badge
                        key={tag}
                        className={`cursor-pointer ${selectedTags.includes(tag)
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Test Case Linkage */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🔹 3. Test Case Linkage</h3>
                <div>
                  <Label>Linked Test Case(s)</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {testCases.map(tc => (
                      <Badge
                        key={tc.id}
                        className={`cursor-pointer ${selectedTestCases.includes(tc.id)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        onClick={() => toggleTestCase(tc.id)}
                      >
                        {tc.id}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Requirement / User Story ID</Label>
                  <Input
                    value={newScript.requirementId}
                    onChange={(e) => setNewScript({ ...newScript, requirementId: e.target.value })}
                    placeholder="REQ-1234"
                  />
                </div>
              </div>

              {/* Execution Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🔹 4. Execution Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Environment</Label>
                    <Select value={newScript.environment} onValueChange={(value) => setNewScript({ ...newScript, environment: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {environments.map(env => (
                          <SelectItem key={env} value={env}>{env}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Data Source</Label>
                    <Select value={newScript.dataSource} onValueChange={(value) => setNewScript({ ...newScript, dataSource: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {dataSources.map(source => (
                          <SelectItem key={source} value={source}>{source}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Browser / Platform</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {browsers.map(browser => (
                      <Badge
                        key={browser}
                        className={`cursor-pointer ${selectedBrowsers.includes(browser)
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        onClick={() => toggleBrowser(browser)}
                      >
                        {browser}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Pre-conditions</Label>
                    <Textarea
                      value={newScript.preConditions}
                      onChange={(e) => setNewScript({ ...newScript, preConditions: e.target.value })}
                      placeholder="User exists in DB"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Post-conditions</Label>
                    <Textarea
                      value={newScript.postConditions}
                      onChange={(e) => setNewScript({ ...newScript, postConditions: e.target.value })}
                      placeholder="Session cleared"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Script File & Repository */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🔹 5. Script File & Repository</h3>
                <div>
                  <Label>Script Path</Label>
                  <Input
                    value={newScript.scriptPath}
                    onChange={(e) => setNewScript({ ...newScript, scriptPath: e.target.value })}
                    placeholder="scripts/login_test.spec.ts"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Repository URL</Label>
                    <Input
                      value={newScript.repositoryUrl}
                      onChange={(e) => setNewScript({ ...newScript, repositoryUrl: e.target.value })}
                      placeholder="https://gitlab.com/project/scripts"
                    />
                  </div>
                  <div>
                    <Label>Branch Name</Label>
                    <Input
                      value={newScript.branchName}
                      onChange={(e) => setNewScript({ ...newScript, branchName: e.target.value })}
                      placeholder="main"
                    />
                  </div>
                </div>
              </div>

              {/* Execution Controls */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🔹 6. Execution Controls</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Schedule / Run Frequency</Label>
                    <Input
                      value={newScript.schedule}
                      onChange={(e) => setNewScript({ ...newScript, schedule: e.target.value })}
                      placeholder="Daily 10 AM"
                    />
                  </div>
                  <div>
                    <Label>Retry Count</Label>
                    <Input
                      type="number"
                      value={newScript.retryCount}
                      onChange={(e) => setNewScript({ ...newScript, retryCount: parseInt(e.target.value) || 0 })}
                      placeholder="2"
                    />
                  </div>
                  <div>
                    <Label>Timeout (sec)</Label>
                    <Input
                      type="number"
                      value={newScript.timeout}
                      onChange={(e) => setNewScript({ ...newScript, timeout: parseInt(e.target.value) || 0 })}
                      placeholder="120"
                    />
                  </div>
                </div>
              </div>

              {/* Ownership & Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🔹 7. Ownership & Status</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Author / Owner</Label>
                    <Select value={newScript.author} onValueChange={(value) => setNewScript({ ...newScript, author: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select author" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map(user => (
                          <SelectItem key={user.id} value={`${user.first_name} ${user.last_name}`}>
                            {user.first_name} {user.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Reviewer / Approver</Label>
                    <Select value={newScript.reviewer} onValueChange={(value) => setNewScript({ ...newScript, reviewer: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reviewer" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map(user => (
                          <SelectItem key={user.id} value={`${user.first_name} ${user.last_name}`}>
                            {user.first_name} {user.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Script Status</Label>
                    <Select value={newScript.status} onValueChange={(value) => setNewScript({ ...newScript, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {scriptStatuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateScript}>
                  Create Script
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search scripts..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScripts.map(script => (
          <Card key={script.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{script.scriptName}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{script.scriptId}</p>
                </div>
                <Badge className={getStatusColor(script.status)}>
                  {script.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2">{script.description}</p>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{script.framework}</span>
                  <span>•</span>
                  <span>{script.language}</span>
                  <span>•</span>
                  <span>{script.environment}</span>
                </div>

                {script.tags && script.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {script.tags.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {script.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{script.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(script.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Play className="h-3 w-3 mr-1" />
                      Run
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredScripts.length === 0 && (
        <div className="h-[calc(100vh-300px)] flex items-center justify-center col-span-full">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-xl mb-2">No scripts found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Create your first automation script to get started.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Automation;
