import { useState } from 'react';
import { motion } from 'motion/react';
import { Users, MessageSquare, Share2, CheckCircle2, Clock, UserPlus, Settings, Folder, Star, Eye } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';

interface Workspace {
  id: string;
  name: string;
  description: string;
  members: number;
  models: number;
  createdAt: Date;
  role: 'owner' | 'admin' | 'member';
}

interface SharedModel {
  id: string;
  name: string;
  owner: string;
  sharedBy: string;
  accessLevel: 'read' | 'write' | 'admin';
  sharedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
}

interface Review {
  id: string;
  model: string;
  reviewer: string;
  status: 'pending' | 'approved' | 'changes-requested';
  comments: string;
  submittedAt: Date;
}

export function TeamCollaboration() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: '1',
      name: 'AI Research Team',
      description: 'Main workspace for AI research projects',
      members: 12,
      models: 8,
      createdAt: new Date(Date.now() - 259200000),
      role: 'owner'
    },
    {
      id: '2',
      name: 'Product Development',
      description: 'Workspace for product-related models',
      members: 6,
      models: 4,
      createdAt: new Date(Date.now() - 172800000),
      role: 'admin'
    }
  ]);

  const [sharedModels, setSharedModels] = useState<SharedModel[]>([
    {
      id: '1',
      name: 'JARVIS-CodeGen-Pro',
      owner: 'You',
      sharedBy: 'John Doe',
      accessLevel: 'read',
      sharedAt: new Date(Date.now() - 86400000),
      status: 'approved'
    },
    {
      id: '2',
      name: 'Text-Analyzer-Base',
      owner: 'Jane Smith',
      sharedBy: 'Jane Smith',
      accessLevel: 'write',
      sharedAt: new Date(Date.now() - 3600000),
      status: 'pending'
    }
  ]);

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      model: 'Vision-Detector-Ultra',
      reviewer: 'John Doe',
      status: 'pending',
      comments: 'Please add more documentation before approval.',
      submittedAt: new Date(Date.now() - 3600000)
    },
    {
      id: '2',
      model: 'TimeSeries-Neural',
      reviewer: 'Jane Smith',
      status: 'approved',
      comments: 'Looks good! Approved for production.',
      submittedAt: new Date(Date.now() - 86400000)
    }
  ]);

  const [newWorkspaceName, setNewWorkspaceName] = useState('');

  const createWorkspace = () => {
    if (!newWorkspaceName) {
      toast.error('Please enter a workspace name');
      return;
    }

    const newWorkspace: Workspace = {
      id: `workspace-${Date.now()}`,
      name: newWorkspaceName,
      description: 'New workspace',
      members: 1,
      models: 0,
      createdAt: new Date(),
      role: 'owner'
    };

    setWorkspaces([...workspaces, newWorkspace]);
    setNewWorkspaceName('');
    toast.success('Workspace created!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'pending': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'rejected': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'changes-requested': return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  const getAccessColor = (level: string) => {
    switch (level) {
      case 'admin': return 'bg-purple-500/20 border-purple-500/50 text-purple-400';
      case 'write': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      default: return 'bg-green-500/20 border-green-500/50 text-green-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-blue-950/20 to-indigo-950/20 border-blue-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-blue-400 flex items-center gap-2">
              <Users className="w-6 h-5" />
              Team Collaboration
            </h3>
            <p className="text-xs text-blue-600 mt-1">Workspaces, model sharing, and review workflows</p>
          </div>
          <div className="flex gap-2">
            <Input
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              placeholder="Workspace name"
              className="bg-black/60 border-blue-500/40 text-blue-100 w-48"
            />
            <Button
              onClick={createWorkspace}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Create Workspace
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Workspaces', value: workspaces.length, icon: Folder },
            { label: 'Shared Models', value: sharedModels.length, icon: Share2 },
            { label: 'Pending Reviews', value: reviews.filter(r => r.status === 'pending').length, icon: Clock },
            { label: 'Team Members', value: workspaces.reduce((sum, w) => sum + w.members, 0), icon: Users },
          ].map((stat, i) => (
            <Card key={i} className="bg-black/40 border-blue-500/30 p-3">
              <div className="flex items-center justify-between mb-1">
                <stat.icon className="w-4 h-4 text-blue-400" />
                <p className="text-lg text-blue-400 font-mono">{stat.value}</p>
              </div>
              <p className="text-xs text-blue-600">{stat.label}</p>
            </Card>
          ))}
        </div>
      </Card>

      <Tabs defaultValue="workspaces" className="w-full">
        <TabsList className="bg-black/40 border-blue-500/30">
          <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
          <TabsTrigger value="sharing">Model Sharing</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="workspaces" className="mt-6">
          <Card className="bg-gradient-to-br from-blue-950/20 to-indigo-950/20 border-blue-500/30 p-6">
            <h4 className="text-blue-400 mb-4">Your Workspaces</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workspaces.map((workspace) => (
                <Card key={workspace.id} className="bg-black/40 border-blue-500/30 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="text-blue-400">{workspace.name}</h5>
                        <Badge className={
                          workspace.role === 'owner' ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' :
                          workspace.role === 'admin' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' :
                          'bg-green-500/20 border-green-500/50 text-green-400'
                        }>
                          {workspace.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-blue-300 mb-2">{workspace.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-blue-600 mb-3">
                    <span>{workspace.members} members</span>
                    <span>{workspace.models} models</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                    >
                      <Eye className="w-3 h-3 mr-2" />
                      Open
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                    >
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sharing" className="mt-6">
          <Card className="bg-gradient-to-br from-blue-950/20 to-indigo-950/20 border-blue-500/30 p-6">
            <h4 className="text-blue-400 mb-4">Shared Models</h4>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {sharedModels.map((model) => (
                  <Card key={model.id} className="bg-black/40 border-blue-500/30 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="text-blue-400">{model.name}</h5>
                          <Badge className={getAccessColor(model.accessLevel)}>
                            {model.accessLevel}
                          </Badge>
                          <Badge className={getStatusColor(model.status)}>
                            {model.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-blue-600">
                          Owner: {model.owner} • Shared by: {model.sharedBy}
                        </p>
                        <p className="text-xs text-blue-600">
                          {model.sharedAt.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {model.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500/30 text-green-400 hover:bg-green-500/20"
                        >
                          <CheckCircle2 className="w-3 h-3 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card className="bg-gradient-to-br from-blue-950/20 to-indigo-950/20 border-blue-500/30 p-6">
            <h4 className="text-blue-400 mb-4">Model Reviews</h4>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {reviews.map((review) => (
                  <Card key={review.id} className="bg-black/40 border-blue-500/30 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="text-blue-400">{review.model}</h5>
                          <Badge className={getStatusColor(review.status)}>
                            {review.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-blue-600 mb-2">
                          Reviewer: {review.reviewer} • {review.submittedAt.toLocaleString()}
                        </p>
                        <p className="text-sm text-blue-300">{review.comments}</p>
                      </div>
                    </div>
                    {review.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500/30 text-green-400 hover:bg-green-500/20"
                        >
                          <CheckCircle2 className="w-3 h-3 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
                        >
                          Request Changes
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card className="bg-gradient-to-br from-blue-950/20 to-indigo-950/20 border-blue-500/30 p-6">
            <h4 className="text-blue-400 mb-4">Collaboration Settings</h4>
            <div className="space-y-4">
              <Card className="bg-black/40 border-blue-500/30 p-4">
                <h5 className="text-blue-400 mb-3">Sharing Permissions</h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-300">Allow model sharing</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-300">Require approval for sharing</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-300">Enable public workspaces</span>
                    <input type="checkbox" className="w-4 h-4" />
                  </div>
                </div>
              </Card>

              <Card className="bg-black/40 border-blue-500/30 p-4">
                <h5 className="text-blue-400 mb-3">Review Workflow</h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-300">Require review before deployment</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-300">Minimum reviewers required</span>
                    <Input type="number" defaultValue={2} className="w-20 bg-black/60 border-blue-500/40 text-blue-100" />
                  </div>
                </div>
              </Card>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
