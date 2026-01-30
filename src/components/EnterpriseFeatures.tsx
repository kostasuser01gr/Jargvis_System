import { useState } from 'react';
import { motion } from 'motion/react';
import { Building2, Users, Lock, FileText, Shield, Settings, UserPlus, Key, Clock, CheckCircle2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

interface Organization {
  id: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  members: number;
  createdAt: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  lastActive: Date;
  status: 'active' | 'inactive';
}

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  timestamp: Date;
  ipAddress: string;
}

export function EnterpriseFeatures() {
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      id: 'org-1',
      name: 'Acme Corporation',
      plan: 'enterprise',
      members: 25,
      createdAt: new Date(Date.now() - 86400000 * 30)
    }
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@acme.com',
      role: 'owner',
      lastActive: new Date(),
      status: 'active'
    },
    {
      id: 'user-2',
      name: 'Jane Smith',
      email: 'jane@acme.com',
      role: 'admin',
      lastActive: new Date(Date.now() - 3600000),
      status: 'active'
    },
    {
      id: 'user-3',
      name: 'Bob Johnson',
      email: 'bob@acme.com',
      role: 'member',
      lastActive: new Date(Date.now() - 86400000),
      status: 'active'
    }
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log-1',
      userId: 'user-1',
      userName: 'John Doe',
      action: 'created',
      resource: 'Model Training Pipeline',
      timestamp: new Date(Date.now() - 3600000),
      ipAddress: '192.168.1.100'
    },
    {
      id: 'log-2',
      userId: 'user-2',
      userName: 'Jane Smith',
      action: 'deleted',
      resource: 'Dataset v1.2',
      timestamp: new Date(Date.now() - 7200000),
      ipAddress: '192.168.1.101'
    },
    {
      id: 'log-3',
      userId: 'user-1',
      userName: 'John Doe',
      action: 'updated',
      resource: 'User Permissions',
      timestamp: new Date(Date.now() - 10800000),
      ipAddress: '192.168.1.100'
    }
  ]);

  const [ssoEnabled, setSsoEnabled] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(true);

  const inviteUser = (email: string, role: User['role']) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role,
      lastActive: new Date(),
      status: 'active'
    };
    setUsers([...users, newUser]);
    toast.success(`Invited ${email} as ${role}`);
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-500/20 border-purple-500/50 text-purple-400';
      case 'pro': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'admin': return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
      case 'member': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-slate-950/20 to-gray-950/20 border-slate-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-slate-400 flex items-center gap-2">
              <Building2 className="w-6 h-5" />
              Enterprise Features
            </h3>
            <p className="text-xs text-slate-600 mt-1">Multi-tenancy, SSO, audit logs, and team management</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Organizations', value: organizations.length, icon: Building2 },
            { label: 'Users', value: users.length, icon: Users },
            { label: 'SSO Enabled', value: ssoEnabled ? 'Yes' : 'No', icon: Key },
            { label: 'MFA Enabled', value: mfaEnabled ? 'Yes' : 'No', icon: Shield },
          ].map((stat, i) => (
            <Card key={i} className="bg-black/40 border-slate-500/30 p-3">
              <div className="flex items-center justify-between mb-1">
                <stat.icon className="w-4 h-4 text-slate-400" />
                <p className="text-lg text-slate-400 font-mono">{stat.value}</p>
              </div>
              <p className="text-xs text-slate-600">{stat.label}</p>
            </Card>
          ))}
        </div>
      </Card>

      <Tabs defaultValue="organizations" className="w-full">
        <TabsList className="bg-black/40 border-slate-500/30">
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="sso">SSO</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="organizations" className="mt-6">
          <Card className="bg-gradient-to-br from-slate-950/20 to-gray-950/20 border-slate-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-slate-400">Organizations</h4>
              <Button className="bg-slate-500/20 border-slate-500/50 text-slate-400 hover:bg-slate-500/30">
                <Building2 className="w-4 h-4 mr-2" />
                Create Organization
              </Button>
            </div>
            <div className="space-y-3">
              {organizations.map((org) => (
                <Card key={org.id} className="bg-black/40 border-slate-500/30 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-slate-400 mb-1">{org.name}</h5>
                      <div className="text-xs text-slate-600">
                        {org.members} members • Created {org.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                    <Badge className={getPlanColor(org.plan)}>
                      {org.plan}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card className="bg-gradient-to-br from-slate-950/20 to-gray-950/20 border-slate-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-slate-400">Team Members</h4>
              <Button className="bg-slate-500/20 border-slate-500/50 text-slate-400 hover:bg-slate-500/30">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite User
              </Button>
            </div>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {users.map((user) => (
                  <Card key={user.id} className="bg-black/40 border-slate-500/30 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-slate-400 mb-1">{user.name}</h5>
                        <div className="text-xs text-slate-600">
                          {user.email} • Last active: {user.lastActive.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                        <Badge className={
                          user.status === 'active' 
                            ? 'bg-green-500/20 border-green-500/50 text-green-400'
                            : 'bg-gray-500/20 border-gray-500/50 text-gray-400'
                        }>
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="sso" className="mt-6">
          <Card className="bg-gradient-to-br from-slate-950/20 to-gray-950/20 border-slate-500/30 p-6">
            <h4 className="text-slate-400 mb-4">Single Sign-On (SSO)</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/40 rounded border border-slate-500/30">
                <div>
                  <h5 className="text-slate-400 mb-1">SAML SSO</h5>
                  <p className="text-sm text-slate-600">Enable SAML-based single sign-on</p>
                </div>
                <input
                  type="checkbox"
                  checked={ssoEnabled}
                  onChange={(e) => {
                    setSsoEnabled(e.target.checked);
                    toast.success(`SSO ${e.target.checked ? 'enabled' : 'disabled'}`);
                  }}
                  className="w-5 h-5"
                />
              </div>

              {ssoEnabled && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-600 mb-2 block">SAML Entity ID</label>
                    <Input className="bg-black/60 border-slate-500/40 text-slate-100" placeholder="https://your-idp.com/saml" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 mb-2 block">SSO URL</label>
                    <Input className="bg-black/60 border-slate-500/40 text-slate-100" placeholder="https://your-idp.com/sso" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 mb-2 block">Certificate</label>
                    <Input type="file" className="bg-black/60 border-slate-500/40 text-slate-100" />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-black/40 rounded border border-slate-500/30">
                <div>
                  <h5 className="text-slate-400 mb-1">Multi-Factor Authentication (MFA)</h5>
                  <p className="text-sm text-slate-600">Require MFA for all users</p>
                </div>
                <input
                  type="checkbox"
                  checked={mfaEnabled}
                  onChange={(e) => {
                    setMfaEnabled(e.target.checked);
                    toast.success(`MFA ${e.target.checked ? 'enabled' : 'disabled'}`);
                  }}
                  className="w-5 h-5"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <Card className="bg-gradient-to-br from-slate-950/20 to-gray-950/20 border-slate-500/30 p-6">
            <h4 className="text-slate-400 mb-4">Audit Logs</h4>
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <Card key={log.id} className="bg-black/40 border-slate-500/30 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-slate-400 mb-1">
                          <span className="font-semibold">{log.userName}</span> {log.action} <span className="text-slate-300">{log.resource}</span>
                        </div>
                        <div className="text-xs text-slate-600">
                          {log.timestamp.toLocaleString()} • IP: {log.ipAddress}
                        </div>
                      </div>
                      <Badge className="bg-slate-500/20 border-slate-500/50 text-slate-400">
                        {log.action}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
