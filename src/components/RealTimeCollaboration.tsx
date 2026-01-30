import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, MessageSquare, Video, Share2, UserPlus, Crown, Mic, MicOff } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar: string;
  status: 'active' | 'idle' | 'away';
  cursor: { x: number; y: number };
  color: string;
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
}

export function RealTimeCollaboration() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Tony Stark',
      role: 'admin',
      avatar: 'TS',
      status: 'active',
      cursor: { x: 0, y: 0 },
      color: '#ef4444'
    },
    {
      id: '2',
      name: 'Bruce Banner',
      role: 'editor',
      avatar: 'BB',
      status: 'active',
      cursor: { x: 0, y: 0 },
      color: '#10b981'
    },
    {
      id: '3',
      name: 'Natasha Romanoff',
      role: 'editor',
      avatar: 'NR',
      status: 'idle',
      cursor: { x: 0, y: 0 },
      color: '#8b5cf6'
    },
    {
      id: '4',
      name: 'Steve Rogers',
      role: 'viewer',
      avatar: 'SR',
      status: 'active',
      cursor: { x: 0, y: 0 },
      color: '#3b82f6'
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Tony Stark',
      text: 'JARVIS systems are looking good!',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: '2',
      userId: '2',
      userName: 'Bruce Banner',
      text: 'Quantum computing module is impressive.',
      timestamp: new Date(Date.now() - 120000)
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isVideoCall, setIsVideoCall] = useState(false);

  useEffect(() => {
    // Simulate cursor movement
    const interval = setInterval(() => {
      setUsers(prev => prev.map(user => ({
        ...user,
        cursor: {
          x: Math.random() * 100,
          y: Math.random() * 100
        }
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: '1',
      userName: 'Tony Stark',
      text: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    toast.success('Message sent');
  };

  const inviteUser = () => {
    toast.success('Invitation link copied to clipboard!');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'editor': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      case 'viewer': return 'bg-green-500/20 border-green-500/50 text-green-400';
      default: return 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-400';
      case 'idle': return 'bg-yellow-400';
      case 'away': return 'bg-gray-400';
      default: return 'bg-cyan-400';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Collaboration Area */}
      <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6 lg:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-cyan-400 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Real-Time Collaboration
            </h3>
            <p className="text-xs text-cyan-600 mt-1">{users.length} active users</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setIsVideoCall(!isVideoCall)}
              className={isVideoCall ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'}
            >
              <Video className="w-4 h-4 mr-2" />
              {isVideoCall ? 'End Call' : 'Video Call'}
            </Button>
            <Button
              size="sm"
              onClick={inviteUser}
              className="bg-blue-500/20 border-blue-500/50 text-blue-400"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite
            </Button>
          </div>
        </div>

        {/* Collaborative Canvas with Cursors */}
        <div className="relative bg-black/40 border border-cyan-500/20 rounded-lg h-[400px] mb-6 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-cyan-600">
            <div className="text-center">
              <Share2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Collaborative Workspace</p>
              <p className="text-xs mt-2">Real-time cursor tracking active</p>
            </div>
          </div>

          {/* Live Cursors */}
          <AnimatePresence>
            {users.map((user) => (
              <motion.div
                key={user.id}
                className="absolute pointer-events-none"
                animate={{
                  left: `${user.cursor.x}%`,
                  top: `${user.cursor.y}%`
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={user.color}>
                    <path d="M5.65376 12.3673L0 0L22 22L9.63237 16.3461L5.65376 12.3673Z" />
                  </svg>
                  <div 
                    className="absolute left-6 top-0 px-2 py-1 rounded text-xs whitespace-nowrap"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.name}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Chat Messages */}
        <Card className="bg-black/40 border-cyan-500/20 p-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <h4 className="text-cyan-400">Team Chat</h4>
          </div>

          <ScrollArea className="h-[200px] mb-4">
            <div className="space-y-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-cyan-500/5 border border-cyan-500/10 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-cyan-400 text-sm">{message.userName}</span>
                    <span className="text-cyan-700 text-xs">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-cyan-300 text-sm">{message.text}</p>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="bg-black/60 border-cyan-500/40 text-cyan-100"
            />
            <Button onClick={sendMessage} className="bg-cyan-500/20 border-cyan-500/50 text-cyan-400">
              Send
            </Button>
          </div>
        </Card>
      </Card>

      {/* Users Panel */}
      <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
        <h4 className="text-cyan-400 mb-4">Active Users</h4>

        <ScrollArea className="h-[700px]">
          <div className="space-y-3">
            {users.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-black/40 border border-cyan-500/20 rounded-lg p-3 hover:border-cyan-500/50 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="border-2" style={{ borderColor: user.color }}>
                      <AvatarFallback className="text-xs" style={{ backgroundColor: `${user.color}30` }}>
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-black`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-cyan-400 text-sm truncate">{user.name}</span>
                      {user.role === 'admin' && (
                        <Crown className="w-3 h-3 text-yellow-400" />
                      )}
                    </div>
                    <Badge className={`${getRoleColor(user.role)} text-xs`}>
                      {user.role}
                    </Badge>
                  </div>
                </div>

                {/* User Actions */}
                {isVideoCall && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-cyan-500/20">
                    <Button size="sm" variant="outline" className="flex-1 text-xs border-cyan-500/30 text-cyan-400">
                      <Mic className="w-3 h-3 mr-1" />
                      Mute
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-xs border-cyan-500/30 text-cyan-400">
                      <Video className="w-3 h-3 mr-1" />
                      Pin
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        {/* Session Info */}
        <div className="mt-6 pt-6 border-t border-cyan-500/20">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-cyan-600">Session ID</span>
              <span className="text-cyan-400 font-mono">A7X-92K</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyan-600">Duration</span>
              <span className="text-cyan-400 font-mono">1h 24m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyan-600">Quality</span>
              <span className="text-green-400">Excellent</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
