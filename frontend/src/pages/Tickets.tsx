import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, X, MoreHorizontal, Play, FileText, Edit, Copy, ExternalLink, Settings, Table, Columns } from 'lucide-react';
import { usersApi, projectsApi } from '@/lib/api';
import { useGlobalSnackbar } from '@/components/SnackbarProvider';

interface TicketsProps {
  addNotification?: (message: string) => void;
}

const Tickets: React.FC<TicketsProps> = ({ addNotification }) => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingTicket, setViewingTicket] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('write');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [showLabelDropdown, setShowLabelDropdown] = useState(false);
  const [showIssueTypeDropdown, setShowIssueTypeDropdown] = useState(false);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showViewAssigneeDropdown, setShowViewAssigneeDropdown] = useState(false);
  const [showViewLabelDropdown, setShowViewLabelDropdown] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [comment, setComment] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showViewStatusDropdown, setShowViewStatusDropdown] = useState(false);
  const [isLoadingTicket, setIsLoadingTicket] = useState(false);
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');
  const { showError } = useGlobalSnackbar();
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'medium',
    issueType: 'Bug',
    assignee: '',
    labels: '',
    milestone: '',
    project: '',
    attachments: [] as any[]
  });

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const availableLabels = [
    'bug', 'dev-task', 'documentation', 'duplicate',
    'enhancement', 'good first issue', 'help wanted',
    'invalid', 'qa-task', 'question', 'wontfix'
  ];

  const issueTypes = ['bug', 'feature', 'task'];

  const columns = [
    { id: 'To Do', title: 'To Do', color: 'bg-gray-100 dark:bg-gray-800' },
    { id: 'In Progress', title: 'In Progress', color: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { id: 'In Review', title: 'In Review', color: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'QA Ready', title: 'QA Ready', color: 'bg-purple-50 dark:bg-purple-900/20' },
    { id: 'Done', title: 'Done', color: 'bg-green-50 dark:bg-green-900/20' }
  ];

  useEffect(() => {
    const savedTickets = localStorage.getItem('tickets');
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    }
    fetchUsers();
    fetchProjects();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await usersApi.getAll();
      setUsers(response.data);
    } catch (error) {
      setUsers([]);
    }
  };


  const fetchProjects = async () => {
    try {
      const response = await projectsApi.getAll();
      setProjects(response.data);
    } catch (error) {
      setProjects([]);
    }
  };



  const addActivity = (ticket: any, type: string, oldValue?: string, newValue?: string) => {
    const activity = {
      id: Math.floor(Math.random() * 900000) + 100000,
      type,
      user: `${currentUser.first_name} ${currentUser.last_name}`,
      oldValue,
      newValue,
      timestamp: new Date().toISOString()
    };

    return {
      ...ticket,
      activities: [...(ticket.activities || []), activity],
      participants: Array.from(new Set([
        ...(ticket.participants || []),
        `${currentUser.first_name} ${currentUser.last_name}`
      ]))
    };
  };

  const handleCreateIssue = async () => {
    if (!newIssue.title.trim()) {
      showError('Title is required');
      return;
    }

    try {
      const initialParticipants = [`${currentUser.first_name} ${currentUser.last_name}`];
      if (selectedAssignee && selectedAssignee !== `${currentUser.first_name} ${currentUser.last_name}`) {
        initialParticipants.push(selectedAssignee);
      }

      const mockTicket = {
        id: Math.floor(Math.random() * 900000) + 100000,
        title: newIssue.title.trim(),
        description: newIssue.description || '',
        status: newIssue.status,
        priority: newIssue.priority,
        issueType: newIssue.issueType,
        assignee: selectedAssignee,
        labels: selectedLabels,
        project: selectedProject,
        attachments: newIssue.attachments,
        reporter: `${currentUser.first_name} ${currentUser.last_name}`,
        created_by: currentUser.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        comments: [],
        activities: [{
          id: Math.floor(Math.random() * 900000) + 100000,
          type: 'created',
          user: `${currentUser.first_name} ${currentUser.last_name}`,
          timestamp: new Date().toISOString()
        }],
        participants: initialParticipants
      };

      const updatedTickets = [...tickets, mockTicket];
      setTickets(updatedTickets);
      localStorage.setItem('tickets', JSON.stringify(updatedTickets));

      // Add ticket creation notification
      if ((window as any).addNotification) {
        (window as any).addNotification(
          'Ticket Created',
          `Ticket "${mockTicket.title}" has been created successfully`,
          'success'
        );
      }

      setIsCreateDialogOpen(false);
      setSelectedLabels([]);
      setSelectedAssignee('');
      setSelectedProject('');
      addNotification?.(` Ticket "${newIssue.title}" created successfully!`);
      if (selectedAssignee) {
        addNotification?.(` Assigned to: ${selectedAssignee}`);
      }
      if (selectedProject) {
        addNotification?.(` Added to project: ${selectedProject}`);
      }
      if (selectedLabels.length > 0) {
        addNotification?.(` Labels added: ${selectedLabels.join(', ')}`);
      }
      setNewIssue({
        title: '',
        description: '',
        status: 'To Do',
        priority: 'medium',
        issueType: 'Bug',
        assignee: '',
        labels: '',
        milestone: '',
        project: '',
        attachments: []
      });
    } catch (error: any) {
    }
  };

  const handleStatusChange = async (ticketId: number, newStatus: string) => {
    try {
      const updatedTickets = tickets.map(ticket => {
        if (ticket.id === ticketId) {
          const updatedTicket = addActivity(ticket, 'moved', ticket.status, newStatus);
          return { ...updatedTicket, status: newStatus };
        }
        return ticket;
      });

      setTickets(updatedTickets);
      localStorage.setItem('tickets', JSON.stringify(updatedTickets));

      if (viewingTicket && viewingTicket.id === ticketId) {
        const updatedViewingTicket = updatedTickets.find(t => t.id === ticketId);
        setViewingTicket(updatedViewingTicket);
      }

      addNotification?.(` Ticket moved from "${tickets.find(t => t.id === ticketId)?.status}" to "${newStatus}"`);
      if (newStatus === 'Done') {
        addNotification?.(` Ticket completed successfully!`);
      }
    } catch (error) {
    }
  };

  const handleAssigneeChange = (ticketId: number, newAssignee: string) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        const updatedTicket = addActivity(ticket, 'assigned', ticket.assignee, newAssignee);
        const updatedParticipants = Array.from(new Set([
          ...(ticket.participants || []),
          ...(newAssignee ? [newAssignee] : [])
        ]));
        return {
          ...updatedTicket,
          assignee: newAssignee,
          participants: updatedParticipants
        };
      }
      return ticket;
    });

    setTickets(updatedTickets);
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));

    if (viewingTicket && viewingTicket.id === ticketId) {
      const updatedViewingTicket = updatedTickets.find(t => t.id === ticketId);
      setViewingTicket(updatedViewingTicket);
    }
    setShowViewAssigneeDropdown(false);

    if (newAssignee) {
      addNotification?.(` Ticket assigned to: ${newAssignee}`);
    } else {
      addNotification?.(` Ticket unassigned`);
    }
  };

  const handleLabelChange = (ticketId: number, label: string) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        const currentLabels = ticket.labels || [];
        const newLabels = currentLabels.includes(label)
          ? currentLabels.filter((l: string) => l !== label)
          : [...currentLabels, label];
        return { ...ticket, labels: newLabels };
      }
      return ticket;
    });

    setTickets(updatedTickets);
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));

    if (viewingTicket && viewingTicket.id === ticketId) {
      const updatedViewingTicket = updatedTickets.find(t => t.id === ticketId);
      setViewingTicket(updatedViewingTicket);
    }
  };

  const handleTitleEdit = () => {
    if (!editTitle.trim()) return;

    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === viewingTicket.id) {
        return { ...ticket, title: editTitle.trim() };
      }
      return ticket;
    });

    setTickets(updatedTickets);
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));

    const updatedViewingTicket = updatedTickets.find(t => t.id === viewingTicket.id);
    setViewingTicket(updatedViewingTicket);
    setIsEditingTitle(false);
  };

  const handleDescriptionEdit = () => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === viewingTicket.id) {
        return { ...ticket, description: editDescription };
      }
      return ticket;
    });

    setTickets(updatedTickets);
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));

    const updatedViewingTicket = updatedTickets.find(t => t.id === viewingTicket.id);
    setViewingTicket(updatedViewingTicket);
    setIsEditingDescription(false);
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;

    const newComment = {
      id: Math.floor(Math.random() * 900000) + 100000,
      text: comment,
      author: `${currentUser.first_name} ${currentUser.last_name}`,
      created_at: new Date().toISOString()
    };

    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === viewingTicket.id) {
        return {
          ...ticket,
          comments: [...(ticket.comments || []), newComment],
          participants: Array.from(new Set([
            ...(ticket.participants || []),
            `${currentUser.first_name} ${currentUser.last_name}`
          ]))
        };
      }
      return ticket;
    });

    setTickets(updatedTickets);
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));

    const updatedViewingTicket = updatedTickets.find(t => t.id === viewingTicket.id);
    setViewingTicket(updatedViewingTicket);
    setComment('');

    addNotification?.(`💬 Comment added to ticket`);
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const processedFiles = await Promise.all(
        fileArray.map(async (file) => {
          const base64 = await convertFileToBase64(file);
          return {
            name: file.name,
            type: file.type,
            size: file.size,
            base64: base64,
            lastModified: file.lastModified
          };
        })
      );
      setNewIssue({ ...newIssue, attachments: [...newIssue.attachments, ...processedFiles] });
    }
  };

  const handleViewMedia = (file: any, isVideo: boolean = false) => {
    const existingDialogs = document.querySelectorAll('[data-media-viewer]');
    existingDialogs.forEach(dialog => {
      if (document.body.contains(dialog)) {
        document.body.removeChild(dialog);
      }
    });

    const dialog = document.createElement('div');
    dialog.setAttribute('data-media-viewer', 'true');
    dialog.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.9); display: flex; align-items: center;
      justify-content: center; z-index: 10000; cursor: pointer;
    `;

    const container = document.createElement('div');
    container.style.cssText = `
      position: relative; max-width: 95%; max-height: 95%;
      background: black; border-radius: 8px; overflow: visible;
      cursor: default;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
      position: absolute; top: -15px; right: -15px; z-index: 10002;
      width: 40px; height: 40px; border: none; border-radius: 50%;
      background: rgba(255,255,255,0.95); color: black; cursor: pointer;
      font-size: 18px; display: flex; align-items: center; justify-content: center;
      font-weight: bold; box-shadow: 0 2px 15px rgba(0,0,0,0.5);
      transition: all 0.2s ease;
    `;

    const cleanup = () => {
      if (document.body.contains(dialog)) {
        document.body.removeChild(dialog);
      }
    };

    if (isVideo) {
      const video = document.createElement('video');
      video.controls = true;
      video.setAttribute('controlsList', 'nodownload');
      video.style.cssText = `
        width: 100%; height: auto; max-width: 90vw; max-height: 80vh;
        display: block; border-radius: 8px; outline: none;
      `;

      if (file.base64) {
        video.src = file.base64;
      } else {
        const videoUrl = URL.createObjectURL(file);
        video.src = videoUrl;
      }

      const videoCleanup = () => {
        video.pause();
        video.src = '';
        if (!file.base64) {
          URL.revokeObjectURL(video.src);
        }
        cleanup();
      };

      // Keyboard controls
      const handleKeydown = (e: KeyboardEvent) => {
        e.stopPropagation();
        switch (e.key) {
          case 'Escape':
            videoCleanup();
            break;
          case ' ':
            e.preventDefault();
            video.paused ? video.play() : video.pause();
            break;
          case 'f':
          case 'F':
            if (video.requestFullscreen) {
              video.requestFullscreen();
            }
            break;
        }
      };

      document.addEventListener('keydown', handleKeydown);

      closeBtn.onclick = (e) => {
        e.stopPropagation();
        document.removeEventListener('keydown', handleKeydown);
        videoCleanup();
      };

      closeBtn.onmouseenter = () => {
        closeBtn.style.background = 'rgba(255,255,255,1)';
        closeBtn.style.transform = 'scale(1.1)';
      };

      closeBtn.onmouseleave = () => {
        closeBtn.style.background = 'rgba(255,255,255,0.95)';
        closeBtn.style.transform = 'scale(1)';
      };

      dialog.onclick = (e) => {
        if (e.target === dialog) {
          document.removeEventListener('keydown', handleKeydown);
          videoCleanup();
        }
      };

      container.onclick = (e) => {
        e.stopPropagation();
      };

      video.onclick = (e) => {
        e.stopPropagation();
      };

      container.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.style.cssText = `
        max-width: 90vw; max-height: 80vh; display: block;
        object-fit: contain; border-radius: 8px; cursor: zoom-in;
      `;

      if (file.base64) {
        img.src = file.base64;
      } else {
        const imageUrl = URL.createObjectURL(file);
        img.src = imageUrl;
      }

      const imageCleanup = () => {
        if (!file.base64) {
          URL.revokeObjectURL(img.src);
        }
        cleanup();
      };

      closeBtn.onclick = (e) => {
        e.stopPropagation();
        imageCleanup();
      };

      dialog.onclick = (e) => {
        if (e.target === dialog) {
          imageCleanup();
        }
      };

      container.onclick = (e) => {
        e.stopPropagation();
      };

      container.appendChild(img);
    }

    container.appendChild(closeBtn);
    dialog.appendChild(container);
    document.body.appendChild(dialog);

    dialog.focus();
  };

  const removeFile = (index: number) => {
    const updatedFiles = newIssue.attachments.filter((_, i) => i !== index);
    setNewIssue({ ...newIssue, attachments: updatedFiles });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P0': return 'bg-red-500 text-white';
      case 'P1': return 'bg-orange-500 text-white';
      case 'P2': return 'bg-yellow-500 text-black';
      case 'P3': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Bug': return '';
      case 'Feature Request': return '';
      case 'Task': return '';
      case 'Documentation': return '';
      case 'Improvement': return '';
      default: return '';
    }
  };

  const getCombinedTimeline = (ticket: any) => {
    const activities = (ticket.activities || []).slice(1);
    const comments = (ticket.comments || []).map((comment: any) => ({
      ...comment,
      type: 'comment',
      timestamp: comment.created_at,
      user: comment.author
    }));

    return [...activities, ...comments].sort((a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  };

  const filteredTickets = tickets.filter((ticket: any) =>
    ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen overflow-hidden relative">
      {isLoadingTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-900 dark:text-white font-medium">Opening ticket...</span>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Project Board</h1>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-gray-200">
            <DialogHeader className="border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  Create new Tickets
                </DialogTitle>
              </div>
              <DialogDescription className="text-gray-600">
                Create a new ticket to track issues, bugs, or feature requests.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label className="text-sm font-medium text-gray-900">
                  Add a title <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={newIssue.title}
                  onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                  placeholder="Title"
                  className="mt-1 bg-white border-gray-300 text-gray-900"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-900">Add a description</Label>
                <div className="mt-1 border border-gray-300 rounded-md bg-white overflow-hidden">
                  <div className="flex border-b border-gray-200 bg-gray-50">
                    <button
                      className={`px-3 py-2 text-sm ${activeTab === 'write' ? 'bg-white border-b-2 border-blue-500 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                      onClick={() => setActiveTab('write')}
                    >
                      Write
                    </button>
                    <button
                      className={`px-3 py-2 text-sm ${activeTab === 'preview' ? 'bg-white border-b-2 border-blue-500 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                      onClick={() => setActiveTab('preview')}
                    >
                      Preview
                    </button>
                  </div>

                  {activeTab === 'write' && (
                    <>
                      <div className="relative">
                        <Textarea
                          value={newIssue.description}
                          onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                          placeholder="Type your description here..."
                          className="border-0 resize-none min-h-[200px] focus:ring-0"
                        />

                        {newIssue.attachments.length > 0 && (
                          <div className="absolute bottom-3 left-3 right-3">
                            <div className="grid grid-cols-4 gap-2">
                              {newIssue.attachments.map((file, index) => (
                                <div key={index} className="relative group">
                                  {file.type.startsWith('image/') ? (
                                    <img
                                      src={file.base64 || URL.createObjectURL(file)}
                                      alt={file.name}
                                      className="w-full h-20 object-cover rounded border cursor-pointer hover:opacity-80"
                                      onClick={() => handleViewMedia(file, false)}
                                    />
                                  ) : file.type.startsWith('video/') ? (
                                    <div
                                      className="w-full h-20 bg-gray-900 rounded border cursor-pointer hover:opacity-80 flex items-center justify-center"
                                      onClick={() => handleViewMedia(file, true)}
                                    >
                                      <Play className="h-6 w-6 text-white" />
                                    </div>
                                  ) : (
                                    <div className="w-full h-20 bg-gray-100 rounded border flex items-center justify-center">
                                      <FileText className="h-4 w-4 text-gray-600" />
                                    </div>
                                  )}
                                  <button
                                    onClick={() => removeFile(index)}
                                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept="image/*,video/*,.pdf,.txt,.log"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer hover:text-gray-800">
                    📎 Paste, drop, or click to add files
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-sm"
                    onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                  >
                    Assignees
                  </Button>
                  {showAssigneeDropdown && (
                    <div className="absolute top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 min-w-[200px] max-h-48 overflow-y-auto">
                      {users.map(user => (
                        <div
                          key={user.id}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSelectedAssignee(`${user.first_name} ${user.last_name}`);
                            setShowAssigneeDropdown(false);
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                              {user.first_name[0]}{user.last_name[0]}
                            </div>
                            <span>{user.first_name} {user.last_name}</span>
                            <span className="text-xs text-gray-500">({user.role})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-sm"
                    onClick={() => setShowLabelDropdown(!showLabelDropdown)}
                  >
                    Labels
                  </Button>
                  {showLabelDropdown && (
                    <div className="absolute top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 min-w-[200px]">
                      {availableLabels.map(label => (
                        <div
                          key={label}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => {
                            if (selectedLabels.includes(label)) {
                              setSelectedLabels(selectedLabels.filter(l => l !== label));
                            } else {
                              setSelectedLabels([...selectedLabels, label]);
                            }
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedLabels.includes(label)}
                            onChange={() => { }}
                            className="mr-2"
                          />
                          {label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-sm"
                    onClick={() => setShowIssueTypeDropdown(!showIssueTypeDropdown)}
                  >
                    Issue Type
                  </Button>
                  {showIssueTypeDropdown && (
                    <div className="absolute top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 min-w-[150px]">
                      {issueTypes.map(type => (
                        <div
                          key={type}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setNewIssue({ ...newIssue, issueType: type });
                            setShowIssueTypeDropdown(false);
                          }}
                        >
                          {type}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-sm"
                    onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                  >
                    Project
                  </Button>
                  {showProjectDropdown && (
                    <div className="absolute top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 min-w-[200px]">
                      {projects.length > 0 ? (
                        projects.map(project => (
                          <div
                            key={project.id}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setSelectedProject(project.name);
                              setShowProjectDropdown(false);
                            }}
                          >
                            {project.name}
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-gray-500 text-sm">
                          No projects available
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {selectedAssignee && (
                  <Badge variant="outline" className="text-sm bg-blue-50">
                    Assignee {selectedAssignee}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => setSelectedAssignee('')}
                    />
                  </Badge>
                )}

                {selectedLabels.map(label => (
                  <Badge key={label} variant="outline" className="text-sm bg-green-50">
                    Label {label}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => setSelectedLabels(selectedLabels.filter(l => l !== label))}
                    />
                  </Badge>
                ))}

                {newIssue.issueType !== 'Bug' && (
                  <Badge variant="outline" className="text-sm bg-purple-50">
                    Issue Type {newIssue.issueType}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => setNewIssue({ ...newIssue, issueType: 'Bug' })}
                    />
                  </Badge>
                )}

                {selectedProject && (
                  <Badge variant="outline" className="text-sm bg-orange-50">
                    Project {selectedProject}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => setSelectedProject('')}
                    />
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <label className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="mr-2" />
                Create more
              </label>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateIssue} className="bg-green-600 hover:bg-green-700">
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Filter items"
            className="pl-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'board' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('board')}
          >
            <Columns className="h-4 w-4 mr-2" />
            Board
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <Table className="h-4 w-4 mr-2" />
            Table
          </Button>
        </div>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="h-[calc(100vh-300px)] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-xl mb-2">No tickets found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Create your first ticket to get started
            </p>
          </div>
        </div>
      ) : viewMode === 'board' ? (
        <div className="grid grid-cols-5 gap-4 h-[calc(100vh-200px)]">
          {columns.map((column) => {
            const columnTickets = filteredTickets.filter(ticket => ticket.status === column.id);

            return (
              <div key={column.id} className="flex flex-col">
                <div
                  className={`${column.color} rounded-t-lg p-3 border-b border-gray-200 dark:border-gray-600`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.backgroundColor = '#e0f2fe';
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.backgroundColor = '';
                    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                    if (data.currentStatus !== column.id) {
                      handleStatusChange(data.ticketId, column.id);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{column.title}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {columnTickets.length}
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div
                  className="flex-1 bg-white dark:bg-gray-800 rounded-b-lg border-l border-r border-b border-gray-200 dark:border-gray-600 p-2 overflow-y-auto"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.backgroundColor = '#f0f9ff';
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.backgroundColor = '';
                    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                    if (data.currentStatus !== column.id) {
                      handleStatusChange(data.ticketId, column.id);
                    }
                  }}
                >
                  <div className="space-y-2">
                    {columnTickets.map((ticket) => (
                      <Card
                        key={ticket.id}
                        className="group cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 active:scale-[0.98] active:shadow-md select-none"
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', JSON.stringify({
                            ticketId: ticket.id,
                            currentStatus: ticket.status
                          }));
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                          if (data.ticketId !== ticket.id) {
                            handleStatusChange(data.ticketId, column.id);
                          }
                        }}
                        onClick={async (e) => {
                          if (e.ctrlKey || e.metaKey) {
                            const currentIndex = columns.findIndex(col => col.id === ticket.status);
                            const nextIndex = (currentIndex + 1) % columns.length;
                            handleStatusChange(ticket.id, columns[nextIndex].id);
                          } else {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsLoadingTicket(true);
                            setTimeout(() => {
                              setViewingTicket(ticket);
                              setIsViewDialogOpen(true);
                              setIsLoadingTicket(false);
                            }, 150);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsLoadingTicket(true);
                            setTimeout(() => {
                              setViewingTicket(ticket);
                              setIsViewDialogOpen(true);
                              setIsLoadingTicket(false);
                            }, 150);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`Open ticket: ${ticket.title}`}
                      >
                        <CardContent className="p-3 group-hover:bg-gray-50 dark:group-hover:bg-gray-600 transition-colors">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-lg group-hover:scale-110 transition-transform">{getTypeIcon(ticket.issueType || ticket.issue_type)}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">#{ticket.id}</span>
                            </div>

                            <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {ticket.title}
                            </h4>

                            {ticket.project && (
                              <div className="text-xs text-gray-600 bg-orange-50 px-2 py-1 rounded">
                                {ticket.project}
                              </div>
                            )}

                            {ticket.labels && ticket.labels.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {ticket.labels.slice(0, 2).map((label: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                                    {label}
                                  </Badge>
                                ))}
                                {ticket.labels.length > 2 && (
                                  <Badge variant="outline" className="text-xs px-1 py-0">
                                    +{ticket.labels.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-1">
                              <Badge className={`text-xs px-1 py-0 ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority}
                              </Badge>
                              {ticket.assignee && (
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                  {ticket.assignee.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      onClick={() => {
                        setNewIssue({ ...newIssue, status: column.id });
                        setIsCreateDialogOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add item
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          {columns.map((column) => {
            const columnTickets = filteredTickets.filter(ticket => ticket.status === column.id);

            if (columnTickets.length === 0) return null;

            return (
              <div key={column.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className={`${column.color} p-4 rounded-t-lg border-b border-gray-200 dark:border-gray-600`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{column.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {columnTickets.length}
                    </Badge>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assignee</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Labels</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                      {columnTickets.map((ticket) => (
                        <tr
                          key={ticket.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => {
                            setIsLoadingTicket(true);
                            setTimeout(() => {
                              setViewingTicket(ticket);
                              setIsViewDialogOpen(true);
                              setIsLoadingTicket(false);
                            }, 150);
                          }}
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-500 dark:text-gray-400">
                            #{ticket.id}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-lg mr-2">{getTypeIcon(ticket.issueType || ticket.issue_type)}</span>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {ticket.title}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {ticket.issueType || ticket.issue_type || 'Bug'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <Badge className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {ticket.assignee ? (
                              <div className="flex items-center">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium mr-2">
                                  {ticket.assignee.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                </div>
                                <span className="text-sm text-gray-900 dark:text-white">{ticket.assignee}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500 dark:text-gray-400">Unassigned</span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {ticket.project ? (
                              <Badge variant="outline" className="text-xs bg-orange-50">
                                {ticket.project}
                              </Badge>
                            ) : (
                              <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {ticket.labels && ticket.labels.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {ticket.labels.slice(0, 2).map((label: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {label}
                                  </Badge>
                                ))}
                                {ticket.labels.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{ticket.labels.length - 2}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-white border-gray-200 p-0">
          {viewingTicket && (
            <div className="flex h-full">
              <div className="flex-1 flex flex-col">
                <div className="border-b border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        🟢 Open
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {viewingTicket.reporter} opened this issue • {new Date(viewingTicket.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {isEditingTitle ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="text-2xl font-bold"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleTitleEdit();
                          if (e.key === 'Escape') setIsEditingTitle(false);
                        }}
                      />
                      <Button size="sm" onClick={handleTitleEdit}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setIsEditingTitle(false)}>Cancel</Button>
                    </div>
                  ) : (
                    <h1
                      className="text-2xl font-bold text-gray-900 mb-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                      onClick={() => {
                        setEditTitle(viewingTicket.title);
                        setIsEditingTitle(true);
                      }}
                    >

                      {viewingTicket.title} <span className="text-gray-500">#{viewingTicket.id}</span>
                    </h1>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div className="mb-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {viewingTicket.reporter?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="bg-white border border-gray-200 rounded-lg">
                          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 rounded-t-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">{viewingTicket.reporter}</span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(viewingTicket.created_at).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            {isEditingDescription ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={editDescription}
                                  onChange={(e) => setEditDescription(e.target.value)}
                                  className="min-h-[100px]"
                                />
                                <div className="flex space-x-2">
                                  <Button size="sm" onClick={handleDescriptionEdit}>Save</Button>
                                  <Button size="sm" variant="outline" onClick={() => setIsEditingDescription(false)}>Cancel</Button>
                                </div>
                              </div>
                            ) : (
                              <div
                                className="prose max-w-none text-gray-900 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                onClick={() => {
                                  setEditDescription(viewingTicket.description || '');
                                  setIsEditingDescription(true);
                                }}
                              >
                                {viewingTicket.description}
                              </div>
                            )}

                            {viewingTicket.attachments && viewingTicket.attachments.length > 0 && (
                              <div className="mt-4 space-y-4">
                                <h4 className="font-medium text-gray-900 flex items-center">
                                  📎 Attachments ({viewingTicket.attachments.length})
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  {viewingTicket.attachments.map((file: any, index: number) => {
                                    const isImage = file.type?.startsWith('image/');
                                    const isVideo = file.type?.startsWith('video/');

                                    return (
                                      <div key={`${file.name}-${index}`} className="space-y-2">
                                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                                          {isImage ? (
                                            <img
                                              src={file.base64 || URL.createObjectURL(file)}
                                              alt={file.name}
                                              className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                                              onClick={() => handleViewMedia(file, false)}
                                            />
                                          ) : isVideo ? (
                                            <div
                                              className="w-full h-full bg-gray-900 flex items-center justify-center cursor-pointer hover:opacity-80 relative"
                                              onClick={() => handleViewMedia(file, true)}
                                            >
                                              <video
                                                src={file.base64 || URL.createObjectURL(file)}
                                                className="w-full h-full object-cover"
                                                muted
                                                preload="metadata"
                                              />
                                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                                <Play className="h-12 w-12 text-white bg-black bg-opacity-70 rounded-full p-2" />
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                              <FileText className="h-8 w-8 text-gray-600" />
                                            </div>
                                          )}
                                        </div>
                                        <div className="text-xs text-gray-600 truncate">{file.name}</div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {getCombinedTimeline(viewingTicket).length > 0 && (
                    <div className="space-y-4 mb-6">
                      {getCombinedTimeline(viewingTicket).map((item: any) => (
                        <div key={item.id} className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {(item.user || item.author)?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                          </div>
                          <div className="flex-1">
                            {item.type === 'comment' ? (
                              <div className="bg-white border border-gray-200 rounded-lg">
                                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 rounded-t-lg">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-gray-900">{item.author}</span>
                                    <span className="text-sm text-gray-500">
                                      {new Date(item.created_at).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                                <div className="p-4">
                                  <div className="prose max-w-none text-gray-900">
                                    {item.text}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="pt-1">
                                <div className="text-sm text-gray-700">
                                  <span className="font-medium">{item.user}</span>{' '}
                                  {item.type === 'moved' && `moved this from ${item.oldValue} to ${item.newValue}`}
                                  {item.type === 'assigned' && item.newValue && `assigned ${item.newValue}`}
                                  {item.type === 'assigned' && !item.newValue && `unassigned ${item.oldValue}`}
                                  {item.type === 'created' && 'opened this issue'}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {new Date(item.timestamp).toLocaleString()}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {currentUser.first_name?.[0]}{currentUser.last_name?.[0]}
                      </div>
                      <div className="flex-1">
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                          <div className="flex border-b border-gray-200 bg-gray-50">
                            <button className="px-3 py-2 text-sm bg-white border-b-2 border-blue-500 text-gray-900 font-medium">
                              Write
                            </button>
                            <button className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                              Preview
                            </button>
                          </div>
                          <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="border-0 resize-none min-h-[100px] focus:ring-0 bg-white"
                          />
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <div className="text-sm text-gray-600">
                            📎 Paste, drop, or click to add files
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Close issue
                            </Button>
                            <Button
                              onClick={handleAddComment}
                              className="bg-green-600 hover:bg-green-700 text-white"
                              size="sm"
                            >
                              Comment
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-80 border-l border-gray-200 bg-gray-50 p-6 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center justify-between">
                      Assignees
                    </h3>
                    <div className="relative">
                      <button
                        onClick={() => setShowViewAssigneeDropdown(!showViewAssigneeDropdown)}
                        className="w-full text-left text-sm text-gray-600 hover:text-gray-900 p-2 border border-gray-200 rounded bg-white"
                      >
                        {viewingTicket.assignee ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                              {viewingTicket.assignee.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                            </div>
                            <span>{viewingTicket.assignee}</span>
                          </div>
                        ) : (
                          'No one assigned'
                        )}
                      </button>
                      {showViewAssigneeDropdown && (
                        <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                          <div
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => handleAssigneeChange(viewingTicket.id, '')}
                          >
                            Unassigned
                          </div>
                          {users.map(user => (
                            <div
                              key={user.id}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleAssigneeChange(viewingTicket.id, `${user.first_name} ${user.last_name}`)}
                            >
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                                  {user.first_name[0]}{user.last_name[0]}
                                </div>
                                <span className="text-sm">{user.first_name} {user.last_name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Labels</h3>
                    <div className="relative">
                      <button
                        onClick={() => setShowViewLabelDropdown(!showViewLabelDropdown)}
                        className="w-full text-left text-sm text-gray-600 hover:text-gray-900 p-2 border border-gray-200 rounded bg-white"
                      >
                        {viewingTicket.labels && viewingTicket.labels.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {viewingTicket.labels.slice(0, 3).map((label: string, index: number) => (
                              <Badge key={index} className="bg-red-100 text-red-800 text-xs px-2 py-1">
                                {label}
                              </Badge>
                            ))}
                            {viewingTicket.labels.length > 3 && (
                              <span className="text-xs text-gray-500">+{viewingTicket.labels.length - 3} more</span>
                            )}
                          </div>
                        ) : (
                          'None yet'
                        )}
                      </button>
                      {showViewLabelDropdown && (
                        <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 min-w-[200px] max-h-48 overflow-y-auto">
                          {availableLabels.map(label => (
                            <div
                              key={label}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                              onClick={() => handleLabelChange(viewingTicket.id, label)}
                            >
                              <input
                                type="checkbox"
                                checked={viewingTicket.labels?.includes(label) || false}
                                onChange={() => { }}
                                className="mr-2"
                              />
                              {label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Status</h3>
                    <div className="relative">
                      <button
                        onClick={() => setShowViewStatusDropdown(!showViewStatusDropdown)}
                        className="w-full text-left text-sm text-gray-600 hover:text-gray-900 p-2 border border-gray-200 rounded bg-white"
                      >
                        {viewingTicket.status}
                      </button>
                      {showViewStatusDropdown && (
                        <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                          {columns.map(col => (
                            <div
                              key={col.id}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                handleStatusChange(viewingTicket.id, col.id);
                                setShowViewStatusDropdown(false);
                              }}
                            >
                              {col.title}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {viewingTicket.project && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Project</h3>
                      <div className="text-sm text-gray-600 bg-orange-50 px-3 py-2 rounded border">
                        {viewingTicket.project}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Participants</h3>
                    <div className="flex flex-wrap gap-1">
                      {viewingTicket.participants?.map((participant: string, index: number) => (
                        <div
                          key={index}
                          className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium"
                          title={participant}
                        >
                          {participant.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tickets;
