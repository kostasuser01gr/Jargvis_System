import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Video, Mic, MessageSquare, MousePointer2, Share2, Lock, Unlock, UserPlus, Settings, Monitor, Phone, PhoneOff } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  cursor: { x: number; y: number };
  color: string;
  isActive: boolean;
  isTyping: boolean;
  lastSeen: Date;
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'system' | 'mention';
}

interface Session {
  id: string;
  name: string;
  participants: Collaborator[];
  isLocked: boolean;
  createdAt: Date;
}

export function RealTimeCollaborationEnhanced() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: '1',
      name: 'You',
      email: 'you@example.com',
      role: 'owner',
      cursor: { x: 0, y: 0 },
      color: '#22d3ee',
      isActive: true,
      isTyping: false,
      lastSeen: new Date()
    },
    {
      id: '2',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'editor',
      cursor: { x: 150, y: 200 },
      color: '#a855f7',
      isActive: true,
      isTyping: true,
      lastSeen: new Date()
    },
    {
      id: '3',
      name: 'Bob Smith',
      email: 'bob@example.com',
      role: 'viewer',
      cursor: { x: 300, y: 100 },
      color: '#10b981',
      isActive: false,
      isTyping: false,
      lastSeen: new Date(Date.now() - 60000)
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [cursorPositions, setCursorPositions] = useState<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    // Simulate cursor movement
    const interval = setInterval(() => {
      setCollaborators(prev => prev.map(collab => {
        if (collab.id !== '1' && collab.isActive) {
          return {
            ...collab,
            cursor: {
              x: collab.cursor.x + (Math.random() - 0.5) * 10,
              y: collab.cursor.y + (Math.random() - 0.5) * 10
            }
          };
        }
        return collab;
      }));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      userId: '1',
      userName: 'You',
      message: newMessage,
      timestamp: new Date(),
      type: 'message'
    };

    setMessages([...messages, message]);
    setNewMessage('');
    toast.success('Message sent');
  };

  const inviteUser = (email: string) => {
    const newCollaborator: Collaborator = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: 'viewer',
      cursor: { x: 0, y: 0 },
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      isActive: true,
      isTyping: false,
      lastSeen: new Date()
    };

    setCollaborators([...collaborators, newCollaborator]);
    toast.success(`Invited ${email}`);
  };

  const updateCursor = (x: number, y: number) => {
    setCursorPositions(prev => ({ ...prev, '1': { x, y } }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-blue-950/20 to-indigo-950/20 border-blue-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-blue-400 flex items-center gap-2">
              <Users className="w-6 h-5" />
              Real-Time Collaboration Enhanced
            </h3>
            <p className="text-xs text-blue-600 mt-1">Live editing, video calls, and real-time collaboration</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsVideoCallActive(!isVideoCallActive)}
              className={isVideoCallActive ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-blue-500/20 border-blue-500/50 text-blue-400'}
            >
              {isVideoCallActive ? <PhoneOff className="w-4 h-4 mr-2" /> : <Video className="w-4 h-4 mr-2" />}
              {isVideoCallActive ? 'End Call' : 'Start Video'}
            </Button>
            <Button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              variant="outline"
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
            >
              <Monitor className="w-4 h-4 mr-2" />
              {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Active Users', value: collaborators.filter(c => c.isActive).length, icon: Users },
            { label: 'Messages', value: messages.length, icon: MessageSquare },
            { label: 'Video Call', value: isVideoCallActive ? 'Active' : 'Inactive', icon: Video },
            { label: 'Screen Share', value: isScreenSharing ? 'Active' : 'Inactive', icon: Monitor },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Collaboration Area */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-blue-950/20 to-indigo-950/20 border-blue-500/30 p-6">
          <h4 className="text-blue-400 mb-4">Collaborative Workspace</h4>
          <div
            ref={canvasRef}
            className="bg-black/40 rounded-lg border border-blue-500/20 p-4 relative"
            style={{ height: '600px', minHeight: '600px' }}
            onMouseMove={(e) => {
              const rect = canvasRef.current?.getBoundingClientRect();
              if (rect) {
                updateCursor(e.clientX - rect.left, e.clientY - rect.top);
              }
            }}
          >
            {/* Live Cursors */}
            {collaborators.map((collab) => {
              if (collab.id === '1') return null;
              const pos = collab.cursor;
              return (
                <motion.div
                  key={collab.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: pos.x,
                    top: pos.y,
                    color: collab.color
                  }}
                  animate={{ x: 0, y: 0 }}
                >
                  <div className="flex items-center gap-2">
                    <MousePointer2 className="w-5 h-5" style={{ color: collab.color }} />
                    <div
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{ backgroundColor: collab.color + '20', color: collab.color }}
                    >
                      {collab.name}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Video Call Overlay */}
            {isVideoCallActive && (
              <div className="absolute bottom-4 right-4 w-64 h-48 bg-black/80 rounded-lg border border-blue-500/50 p-2">
                <div className="text-xs text-blue-400 mb-2">Video Call</div>
                <div className="grid grid-cols-2 gap-2">
                  {collaborators.slice(0, 4).map((collab) => (
                    <div key={collab.id} className="bg-blue-500/20 rounded p-2">
                      <Avatar className="w-full h-full">
                        <AvatarFallback className="bg-blue-500/20 text-blue-400">
                          {collab.name[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center text-blue-600 mt-20">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Collaborative workspace</p>
              <p className="text-xs mt-1">Live cursors and real-time editing</p>
            </div>
          </div>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Collaborators */}
          <Card className="bg-gradient-to-br from-blue-950/20 to-indigo-950/20 border-blue-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-blue-400">Collaborators</h4>
              <Button
                size="sm"
                variant="outline"
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                onClick={() => {
                  const email = prompt('Enter email to invite:');
                  if (email) inviteUser(email);
                }}
              >
                <UserPlus className="w-4 h-4" />
              </Button>
            </div>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {collaborators.map((collab) => (
                  <div
                    key={collab.id}
                    className="flex items-center gap-3 p-2 bg-black/40 rounded border border-blue-500/20"
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback className="bg-blue-500/20 text-blue-400">
                          {collab.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      {collab.isActive && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-black" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-blue-300">{collab.name}</div>
                      <div className="text-xs text-blue-600">{collab.role}</div>
                    </div>
                    {collab.isTyping && (
                      <Badge className="bg-blue-500/20 text-blue-400 text-[10px]">
                        typing...
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Chat */}
          <Card className="bg-gradient-to-br from-blue-950/20 to-indigo-950/20 border-blue-500/30 p-6">
            <h4 className="text-blue-400 mb-4">Team Chat</h4>
            <ScrollArea className="h-[300px] mb-4">
              <div className="space-y-2">
                {messages.map((msg) => (
                  <div key={msg.id} className="p-2 bg-black/40 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-blue-400 font-semibold">{msg.userName}</span>
                      <span className="text-xs text-blue-600">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-blue-300">{msg.message}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="bg-black/60 border-blue-500/40 text-blue-100"
              />
              <Button
                onClick={sendMessage}
                className="bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30"
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
