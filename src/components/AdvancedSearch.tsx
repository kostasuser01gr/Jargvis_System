import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, SortAsc, Clock, Star, File, Code, Database, Globe } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface SearchResult {
  id: string;
  title: string;
  type: 'file' | 'code' | 'api' | 'data' | 'command';
  content: string;
  path: string;
  score: number;
  timestamp: Date;
}

const MOCK_RESULTS: SearchResult[] = [
  {
    id: '1',
    title: 'AITerminal.tsx',
    type: 'file',
    content: 'Cross-platform terminal with AI-powered commands',
    path: '/components/AITerminal.tsx',
    score: 95,
    timestamp: new Date()
  },
  {
    id: '2',
    title: 'deploy function',
    type: 'code',
    content: 'const deploy = async () => { ... }',
    path: '/components/DeploymentCenter.tsx:45',
    score: 88,
    timestamp: new Date()
  },
  {
    id: '3',
    title: 'vehicles table',
    type: 'data',
    content: '247 records in cluster database',
    path: '/database/vehicles',
    score: 82,
    timestamp: new Date()
  },
  {
    id: '4',
    title: 'GET /api/cluster/status',
    type: 'api',
    content: 'Fetch real-time cluster status',
    path: '/api/cluster/status',
    score: 76,
    timestamp: new Date()
  }
];

export function AdvancedSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [filters, setFilters] = useState({
    files: true,
    code: true,
    api: true,
    data: true,
    commands: true
  });

  const handleSearch = () => {
    if (!query.trim()) return;

    setSearching(true);
    
    setTimeout(() => {
      const filtered = MOCK_RESULTS.filter(result => {
        const matchesQuery = result.title.toLowerCase().includes(query.toLowerCase()) ||
                           result.content.toLowerCase().includes(query.toLowerCase());
        const matchesFilter = filters[result.type === 'command' ? 'commands' : result.type + 's' as keyof typeof filters];
        return matchesQuery && matchesFilter;
      });

      setResults(filtered);
      setSearching(false);
    }, 500);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'file': return <File className="w-4 h-4 text-cyan-400" />;
      case 'code': return <Code className="w-4 h-4 text-green-400" />;
      case 'api': return <Globe className="w-4 h-4 text-blue-400" />;
      case 'data': return <Database className="w-4 h-4 text-purple-400" />;
      default: return <Star className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'file': return 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400';
      case 'code': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'api': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      case 'data': return 'bg-purple-500/20 border-purple-500/50 text-purple-400';
      default: return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Search className="w-6 h-6 text-cyan-400" />
        <div className="flex-1">
          <h3 className="text-cyan-400">Advanced Search</h3>
          <p className="text-xs text-cyan-600">Search across files, code, APIs, and data</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex gap-3 mb-6">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search anything in JARVIS..."
          className="flex-1 bg-black/60 border-cyan-500/40 text-cyan-100 text-lg h-12"
        />
        <Button
          onClick={handleSearch}
          disabled={searching}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white h-12 px-8"
        >
          {searching ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Search className="w-5 h-5" />
            </motion.div>
          ) : (
            <>
              <Search className="w-5 h-5 mr-2" />
              Search
            </>
          )}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-cyan-500/20">
        <Filter className="w-4 h-4 text-cyan-600" />
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => (
            <Button
              key={key}
              size="sm"
              variant="outline"
              onClick={() => setFilters(prev => ({ ...prev, [key]: !value }))}
              className={`${
                value
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                  : 'border-cyan-500/30 text-cyan-600'
              } transition-all capitalize`}
            >
              {key}
            </Button>
          ))}
        </div>
      </div>

      {/* Results */}
      <ScrollArea className="h-[500px]">
        {results.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-cyan-600">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </span>
              <Button size="sm" variant="ghost" className="text-cyan-600 hover:text-cyan-400">
                <SortAsc className="w-3 h-3 mr-2" />
                Sort by relevance
              </Button>
            </div>

            <AnimatePresence>
              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="bg-black/40 border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                      {getTypeIcon(result.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-cyan-400 font-mono">{result.title}</h4>
                        <Badge className={getTypeColor(result.type)}>
                          {result.type}
                        </Badge>
                        <div className="ml-auto flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-cyan-950/50 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-cyan-400"
                              style={{ width: `${result.score}%` }}
                            />
                          </div>
                          <span className="text-xs text-cyan-600 font-mono">{result.score}%</span>
                        </div>
                      </div>

                      <p className="text-sm text-cyan-300 mb-2">{result.content}</p>

                      <div className="flex items-center gap-3 text-xs text-cyan-600">
                        <span className="flex items-center gap-1">
                          <File className="w-3 h-3" />
                          {result.path}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {result.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Actions */}
                  <div className="mt-3 pt-3 border-t border-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 border-cyan-500/30 text-cyan-400 text-xs">
                      Open
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 border-cyan-500/30 text-cyan-400 text-xs">
                      View Details
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : query && !searching ? (
          <div className="flex items-center justify-center h-full text-cyan-600">
            <div className="text-center">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No results found for "{query}"</p>
              <p className="text-xs mt-2">Try adjusting your search or filters</p>
            </div>
          </div>
        ) : !query ? (
          <div className="flex items-center justify-center h-full text-cyan-600">
            <div className="text-center">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Enter a search query to begin</p>
              <p className="text-xs mt-2">Search across all JARVIS systems</p>
            </div>
          </div>
        ) : null}
      </ScrollArea>
    </Card>
  );
}
