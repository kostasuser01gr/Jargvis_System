import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GitBranch, GitCommit, GitMerge, GitPullRequest, Star, Eye, GitFork, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar } from './ui/avatar';
import { toast } from 'sonner@2.0.3';

interface Commit {
  id: string;
  message: string;
  author: string;
  date: Date;
  hash: string;
}

interface PullRequest {
  id: number;
  title: string;
  status: 'open' | 'closed' | 'merged';
  author: string;
  created: Date;
  comments: number;
}

export function GitHubIntegration() {
  const [commits, setCommits] = useState<Commit[]>([
    {
      id: '1',
      message: 'feat: Add AI Terminal with cross-platform support',
      author: 'JARVIS',
      date: new Date(Date.now() - 3600000),
      hash: 'a3f2b1c'
    },
    {
      id: '2',
      message: 'feat: Implement Code Editor with syntax highlighting',
      author: 'JARVIS',
      date: new Date(Date.now() - 7200000),
      hash: 'b4e3c2d'
    },
    {
      id: '3',
      message: 'feat: Add GitHub integration and deployment tools',
      author: 'JARVIS',
      date: new Date(Date.now() - 10800000),
      hash: 'c5d4e3f'
    },
    {
      id: '4',
      message: 'refactor: Optimize quantum processor performance',
      author: 'JARVIS',
      date: new Date(Date.now() - 14400000),
      hash: 'd6e5f4a'
    }
  ]);

  const [pullRequests, setPullRequests] = useState<PullRequest[]>([
    {
      id: 1,
      title: 'Add biometric authentication system',
      status: 'merged',
      author: 'JARVIS',
      created: new Date(Date.now() - 86400000),
      comments: 3
    },
    {
      id: 2,
      title: 'Implement real-time threat detection',
      status: 'open',
      author: 'JARVIS',
      created: new Date(Date.now() - 172800000),
      comments: 7
    }
  ]);

  const [repoStats, setRepoStats] = useState({
    stars: 1247,
    forks: 89,
    watchers: 234,
    issues: 12,
    pullRequests: 2
  });

  const [commitMessage, setCommitMessage] = useState('');

  const handleCommit = () => {
    if (!commitMessage.trim()) {
      toast.error('Please enter a commit message');
      return;
    }

    const newCommit: Commit = {
      id: Date.now().toString(),
      message: commitMessage,
      author: 'JARVIS',
      date: new Date(),
      hash: Math.random().toString(36).substring(7)
    };

    setCommits(prev => [newCommit, ...prev]);
    setCommitMessage('');
    toast.success('Changes committed successfully!', {
      description: `Hash: ${newCommit.hash}`
    });
  };

  const handlePush = () => {
    toast.info('Pushing to origin/main...', {
      description: 'This may take a moment'
    });
    
    setTimeout(() => {
      toast.success('Successfully pushed to GitHub!', {
        description: `${commits.length} commits pushed`
      });
    }, 2000);
  };

  const handlePull = () => {
    toast.info('Pulling from origin/main...');
    setTimeout(() => {
      toast.success('Repository up to date!');
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'merged': return <CheckCircle2 className="w-4 h-4 text-purple-400" />;
      case 'open': return <Clock className="w-4 h-4 text-green-400" />;
      case 'closed': return <XCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'merged': return 'bg-purple-500/20 border-purple-500/50 text-purple-400';
      case 'open': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'closed': return 'bg-red-500/20 border-red-500/50 text-red-400';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Repository Overview */}
      <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-cyan-400 flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Repository Status
            </h3>
            <p className="text-xs text-cyan-600 mt-1">jarvis-ultimate-system</p>
          </div>
          <Badge className="bg-green-500/20 border-green-500/50 text-green-400">
            <GitBranch className="w-3 h-3 mr-1" />
            main
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-black/40 border border-cyan-500/20 rounded-lg p-4 text-center"
          >
            <Star className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl text-cyan-400 font-mono">{repoStats.stars}</div>
            <div className="text-xs text-cyan-600">Stars</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-black/40 border border-cyan-500/20 rounded-lg p-4 text-center"
          >
            <GitFork className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl text-cyan-400 font-mono">{repoStats.forks}</div>
            <div className="text-xs text-cyan-600">Forks</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-black/40 border border-cyan-500/20 rounded-lg p-4 text-center"
          >
            <Eye className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl text-cyan-400 font-mono">{repoStats.watchers}</div>
            <div className="text-xs text-cyan-600">Watchers</div>
          </motion.div>
        </div>

        {/* Commit Input */}
        <div className="space-y-3 mb-6">
          <label className="text-sm text-cyan-400">Commit Changes</label>
          <Input
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="feat: your commit message..."
            className="bg-black/60 border-cyan-500/40 text-cyan-100"
            onKeyPress={(e) => e.key === 'Enter' && handleCommit()}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleCommit}
              className="flex-1 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30"
            >
              <GitCommit className="w-4 h-4 mr-2" />
              Commit
            </Button>
            <Button
              onClick={handlePush}
              className="flex-1 bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30"
            >
              Push
            </Button>
            <Button
              onClick={handlePull}
              className="flex-1 bg-blue-500/20 border border-blue-500/50 text-blue-400 hover:bg-blue-500/30"
            >
              Pull
            </Button>
          </div>
        </div>

        {/* Recent Commits */}
        <div>
          <h4 className="text-sm text-cyan-400 mb-3 flex items-center gap-2">
            <GitCommit className="w-4 h-4" />
            Recent Commits
          </h4>
          <ScrollArea className="h-48">
            <div className="space-y-2">
              <AnimatePresence>
                {commits.slice(0, 5).map((commit) => (
                  <motion.div
                    key={commit.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-black/40 border border-cyan-500/20 rounded p-3 hover:border-cyan-500/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs">
                        J
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-cyan-400 mb-1">{commit.message}</div>
                        <div className="flex items-center gap-3 text-xs text-cyan-600">
                          <span>{commit.author}</span>
                          <span>•</span>
                          <span className="font-mono">{commit.hash}</span>
                          <span>•</span>
                          <span>{commit.date.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>
      </Card>

      {/* Pull Requests */}
      <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-cyan-400 flex items-center gap-2">
              <GitPullRequest className="w-5 h-5" />
              Pull Requests
            </h3>
            <p className="text-xs text-cyan-600 mt-1">{pullRequests.length} active</p>
          </div>
          <Button
            size="sm"
            className="bg-green-500/20 border border-green-500/50 text-green-400"
          >
            New PR
          </Button>
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            <AnimatePresence>
              {pullRequests.map((pr) => (
                <motion.div
                  key={pr.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/40 border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(pr.status)}
                      <span className="text-cyan-400">#{pr.id}</span>
                    </div>
                    <Badge className={getStatusColor(pr.status)}>
                      {pr.status}
                    </Badge>
                  </div>

                  <h4 className="text-sm text-cyan-300 mb-3">{pr.title}</h4>

                  <div className="flex items-center justify-between text-xs text-cyan-600">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs">
                        J
                      </div>
                      <span>{pr.author}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>{pr.comments} comments</span>
                      <span>•</span>
                      <span>{Math.floor((Date.now() - pr.created.getTime()) / 3600000)}h ago</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-cyan-500/20 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 border-cyan-500/30 text-cyan-400 text-xs">
                      Review
                    </Button>
                    {pr.status === 'open' && (
                      <Button size="sm" className="flex-1 bg-green-500/20 border border-green-500/50 text-green-400 text-xs">
                        <GitMerge className="w-3 h-3 mr-1" />
                        Merge
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
