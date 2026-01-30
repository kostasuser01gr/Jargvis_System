import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Table, Search, Plus, Trash2, Edit, Play, Download } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';

interface TableData {
  name: string;
  rows: number;
  size: string;
}

interface QueryResult {
  id: string;
  query: string;
  result: any[];
  executionTime: number;
  timestamp: Date;
}

const SAMPLE_TABLES: TableData[] = [
  { name: 'vehicles', rows: 247, size: '2.4 MB' },
  { name: 'missions', rows: 89, size: '856 KB' },
  { name: 'threat_logs', rows: 1523, size: '5.1 MB' },
  { name: 'users', rows: 456, size: '1.8 MB' },
  { name: 'analytics', rows: 3421, size: '12.3 MB' }
];

const SAMPLE_DATA = [
  { id: 1, model: 'Tesla Model S', status: 'active', battery: 87, location: 'Downtown LA' },
  { id: 2, model: 'Audi e-tron', status: 'idle', battery: 62, location: 'Beverly Hills' },
  { id: 3, model: 'BMW iX', status: 'charging', battery: 34, location: 'Santa Monica' },
  { id: 4, model: 'Mercedes EQS', status: 'active', battery: 91, location: 'Hollywood' }
];

export function DatabaseManager() {
  const [query, setQuery] = useState('SELECT * FROM vehicles WHERE status = \'active\' LIMIT 10');
  const [queryHistory, setQueryHistory] = useState<QueryResult[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>('vehicles');
  const [searchTerm, setSearchTerm] = useState('');
  const [executing, setExecuting] = useState(false);

  const executeQuery = () => {
    if (!query.trim()) {
      toast.error('Please enter a query');
      return;
    }

    setExecuting(true);
    toast.info('Executing query...');

    setTimeout(() => {
      const result: QueryResult = {
        id: Date.now().toString(),
        query: query,
        result: SAMPLE_DATA,
        executionTime: Math.random() * 100 + 50,
        timestamp: new Date()
      };

      setQueryHistory(prev => [result, ...prev]);
      setExecuting(false);
      
      toast.success('Query executed successfully!', {
        description: `${result.result.length} rows returned in ${result.executionTime.toFixed(2)}ms`
      });
    }, 1500);
  };

  const filteredTables = SAMPLE_TABLES.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Tables List */}
      <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
        <div className="mb-4">
          <h3 className="text-cyan-400 flex items-center gap-2 mb-3">
            <Database className="w-5 h-5" />
            Database Tables
          </h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-600" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tables..."
              className="pl-10 bg-black/60 border-cyan-500/40 text-cyan-100"
            />
          </div>
        </div>

        <ScrollArea className="h-[500px]">
          <div className="space-y-2">
            <AnimatePresence>
              {filteredTables.map((table) => (
                <motion.div
                  key={table.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  onClick={() => setSelectedTable(table.name)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedTable === table.name
                      ? 'bg-cyan-500/20 border-cyan-500/50'
                      : 'bg-black/40 border-cyan-500/20 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Table className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-400 font-mono">{table.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-cyan-600">
                    <span>{table.rows.toLocaleString()} rows</span>
                    <span>{table.size}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>

        <div className="mt-4 pt-4 border-t border-cyan-500/20">
          <Button
            size="sm"
            className="w-full bg-green-500/20 border border-green-500/50 text-green-400"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Table
          </Button>
        </div>
      </Card>

      {/* Query Editor & Results */}
      <Card className="lg:col-span-2 bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 flex flex-col">
        <div className="border-b border-cyan-500/30 p-4 flex items-center justify-between bg-gradient-to-r from-black/60 to-cyan-950/20">
          <div>
            <h3 className="text-cyan-400">Query Editor</h3>
            <p className="text-xs text-cyan-600">SQL & NoSQL supported</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/20 border-cyan-500/50 text-cyan-400">
              {selectedTable || 'No table selected'}
            </Badge>
            <Button
              size="sm"
              onClick={executeQuery}
              disabled={executing}
              className={`${executing ? 'bg-green-500/20 border-green-500 animate-pulse' : 'bg-green-500/20 border-green-500/50'} border text-green-400`}
            >
              <Play className="w-4 h-4 mr-2" />
              {executing ? 'Executing...' : 'Execute'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="editor" className="flex-1 flex flex-col">
          <TabsList className="border-b border-cyan-500/20 bg-black/40 rounded-none justify-start p-0">
            <TabsTrigger value="editor" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 rounded-none">
              Query
            </TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 rounded-none">
              Results ({queryHistory.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 rounded-none">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="flex-1 p-4">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-32 bg-black/60 border border-cyan-500/40 rounded-lg p-4 text-cyan-300 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              placeholder="Enter your SQL query..."
            />
            <div className="mt-4 text-xs text-cyan-600 flex items-center gap-4">
              <span>Ctrl+Enter to execute</span>
              <span>•</span>
              <span>Tab for autocomplete</span>
            </div>
          </TabsContent>

          <TabsContent value="results" className="flex-1 p-0">
            {queryHistory.length > 0 ? (
              <ScrollArea className="h-full">
                <div className="p-4">
                  <div className="bg-black/60 border border-cyan-500/40 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-cyan-500/10 border-b border-cyan-500/30">
                        <tr>
                          <th className="text-left p-3 text-cyan-400">ID</th>
                          <th className="text-left p-3 text-cyan-400">Model</th>
                          <th className="text-left p-3 text-cyan-400">Status</th>
                          <th className="text-left p-3 text-cyan-400">Battery</th>
                          <th className="text-left p-3 text-cyan-400">Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {queryHistory[0]?.result.map((row, i) => (
                          <tr key={i} className="border-b border-cyan-500/20 hover:bg-cyan-500/10 transition-colors">
                            <td className="p-3 text-cyan-300 font-mono">{row.id}</td>
                            <td className="p-3 text-cyan-300">{row.model}</td>
                            <td className="p-3">
                              <Badge className={
                                row.status === 'active' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                                row.status === 'charging' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' :
                                'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                              }>
                                {row.status}
                              </Badge>
                            </td>
                            <td className="p-3 text-cyan-300 font-mono">{row.battery}%</td>
                            <td className="p-3 text-cyan-300">{row.location}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {queryHistory[0] && (
                    <div className="mt-4 p-3 bg-black/40 border border-cyan-500/20 rounded-lg text-xs text-cyan-600">
                      <div className="flex items-center justify-between">
                        <span>{queryHistory[0].result.length} rows returned</span>
                        <span>Execution time: {queryHistory[0].executionTime.toFixed(2)}ms</span>
                        <span>{queryHistory[0].timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-full text-cyan-600">
                No results yet. Execute a query to see data.
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="flex-1">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                <AnimatePresence>
                  {queryHistory.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-black/40 border border-cyan-500/20 rounded-lg p-3 hover:border-cyan-500/40 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <code className="text-xs text-cyan-400 font-mono">{item.query}</code>
                        <Button size="sm" variant="ghost" className="h-6 text-cyan-600">
                          <Play className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-cyan-600">
                        <span>{item.result.length} rows</span>
                        <span>•</span>
                        <span>{item.executionTime.toFixed(2)}ms</span>
                        <span>•</span>
                        <span>{item.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
