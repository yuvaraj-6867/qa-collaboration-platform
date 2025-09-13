import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Plus } from 'lucide-react';

interface Project {
    id: number;
    name: string;
    description: string;
    status: 'active' | 'inactive';
    created_by: string;
    created_at: string;
    updated_at: string;
}

const Projects: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [error, setError] = useState('');

    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        status: 'active' as 'active' | 'inactive'
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/v1/projects');
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async () => {
        console.log('Create project clicked', newProject);
        
        if (!newProject.name.trim()) {
            setError('Project name is required');
            console.log('Validation failed - no name');
            return;
        }

        if (!newProject.description.trim()) {
            setError('Project description is required');
            console.log('Validation failed - no description - NO NETWORK CALL MADE');
            return; // No network call made
        }

        console.log('Making API call...');
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
                body: JSON.stringify({ project: newProject }),
            });

            console.log('API response:', response);

            if (response.ok) {
                const createdProject = await response.json();
                console.log('Project created successfully:', createdProject);
                setProjects([createdProject, ...projects]);
                setNewProject({ name: '', description: '', status: 'active' });
                setIsCreateDialogOpen(false);
            } else {
                const errorData = await response.json();
                console.log('API error:', errorData);
                setError(errorData.errors ? Object.values(errorData.errors).join(', ') : 'Failed to create project');
            }
        } catch (error) {
            console.error('Network error:', error);
            setError('Network error occurred');
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'active'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    };

    const filteredProjects = projects.filter((project) =>
        project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your project portfolio</p>
                </div>

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

            <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        type="text"
                        placeholder="Search projects..."
                        className="pl-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.length === 0 ? (
                    <Card className="col-span-full bg-white dark:bg-gray-800">
                        <CardContent className="flex items-center justify-center h-32">
                            <p className="text-gray-500 dark:text-gray-400">No projects found</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredProjects.map((project) => (
                        <Card key={project.id} className="hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg text-gray-900 dark:text-white">{project.name}</CardTitle>
                                        <CardDescription className="mt-1 text-gray-600 dark:text-gray-400">
                                            {project.description}
                                        </CardDescription>
                                    </div>
                                    <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                                        {project.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <div>
                                        <span className="font-medium">Created by:</span> {project.created_by || 'Unknown'}
                                    </div>
                                    <div>
                                        <span className="font-medium">Created:</span> {new Date(project.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default Projects;
