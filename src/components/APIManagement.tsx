import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Send, Clock, CheckCircle2, XCircle, Zap, Copy, Code } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';

interface APIRequest {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  status?: number;
  responseTime?: number;
  timestamp: Date;
  response?: any;
}

export function APIManagement() {
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'>('GET');
  const [url, setUrl] = useState('https://api.jarvis-ultimate.dev/v1/');
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer token"\n}');
  const [body, setBody] = useState('{\n  "query": "example"\n}');
  const [requests, setRequests] = useState<APIRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const methodColors = {
    GET: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
    POST: 'bg-green-500/20 border-green-500/50 text-green-400',
    PUT: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
    DELETE: 'bg-red-500/20 border-red-500/50 text-red-400',
    PATCH: 'bg-purple-500/20 border-purple-500/50 text-purple-400'
  };

  const executeRequest = async () => {
    setLoading(true);
    const startTime = Date.now();

    // Simulate API call
    setTimeout(() => {
      const responseTime = Date.now() - startTime;
      const mockResponse = {
        status: 200,
        data: {
          success: true,
          message: 'Request successful',
          timestamp: new Date().toISOString(),
          data: {
            quantum_processors: 8,
            neural_networks: 'active',
            threat_level: 'low',
            vehicles_monitored: 247
          }
        }
      };

      const newRequest: APIRequest = {
        id: Date.now().toString(),
        method,
        url,
        status: mockResponse.status,
        responseTime,
        timestamp: new Date(),
        response: mockResponse.data
      };

      setRequests(prev => [newRequest, ...prev]);
      setResponse(mockResponse.data);
      setLoading(false);

      toast.success('API request successful!', {
        description: `${method} ${url} - ${responseTime}ms`
      });
    }, 800);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Request Builder */}
      <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-cyan-400 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              API Request Builder
            </h3>
            <p className="text-xs text-cyan-600 mt-1">Test and manage API endpoints</p>
          </div>
          <Badge className="bg-green-500/20 border-green-500/50 text-green-400">
            <Zap className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        </div>

        {/* Method & URL */}
        <div className="space-y-4 mb-6">
          <div className="flex gap-3">
            <Select value={method} onValueChange={(v: any) => setMethod(v)}>
              <SelectTrigger className="w-32 bg-black/60 border-cyan-500/40 text-cyan-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/endpoint"
              className="flex-1 bg-black/60 border-cyan-500/40 text-cyan-100"
            />

            <Button
              onClick={executeRequest}
              disabled={loading}
              className={`${loading ? 'animate-pulse' : ''} bg-gradient-to-r from-cyan-500 to-blue-500 text-white`}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                  </motion.div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Tabs for Headers, Body, etc. */}
        <Tabs defaultValue="headers">
          <TabsList className="bg-black/40 border border-cyan-500/20">
            <TabsTrigger value="headers" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              Headers
            </TabsTrigger>
            <TabsTrigger value="body" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              Body
            </TabsTrigger>
            <TabsTrigger value="auth" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              Auth
            </TabsTrigger>
          </TabsList>

          <TabsContent value="headers" className="mt-4">
            <div className="relative">
              <Textarea
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                className="h-48 bg-black/60 border-cyan-500/40 text-cyan-300 font-mono text-sm"
                placeholder="Enter headers as JSON..."
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(headers)}
                className="absolute top-2 right-2 text-cyan-600 hover:text-cyan-400"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="body" className="mt-4">
            <div className="relative">
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="h-48 bg-black/60 border-cyan-500/40 text-cyan-300 font-mono text-sm"
                placeholder="Enter request body as JSON..."
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(body)}
                className="absolute top-2 right-2 text-cyan-600 hover:text-cyan-400"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="auth" className="mt-4">
            <div className="space-y-3">
              <Select>
                <SelectTrigger className="bg-black/60 border-cyan-500/40 text-cyan-400">
                  <SelectValue placeholder="Select auth type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bearer">Bearer Token</SelectItem>
                  <SelectItem value="basic">Basic Auth</SelectItem>
                  <SelectItem value="api-key">API Key</SelectItem>
                  <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Token / API Key"
                className="bg-black/60 border-cyan-500/40 text-cyan-100"
              />
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Response & History */}
      <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 p-6">
        <Tabs defaultValue="response">
          <TabsList className="bg-black/40 border border-cyan-500/20 mb-4">
            <TabsTrigger value="response" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              Response
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              History ({requests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="response">
            {response ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-green-500/20 border-green-500/50 text-green-400">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    200 OK
                  </Badge>
                  <div className="flex items-center gap-3 text-xs text-cyan-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {requests[0]?.responseTime}ms
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(JSON.stringify(response, null, 2))}
                      className="text-cyan-600 hover:text-cyan-400"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <ScrollArea className="h-[500px]">
                  <pre className="bg-black/60 border border-cyan-500/40 rounded-lg p-4 text-cyan-300 text-xs font-mono overflow-auto">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </ScrollArea>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[500px] text-cyan-600">
                <div className="text-center">
                  <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No response yet. Send a request to see results.</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                <AnimatePresence>
                  {requests.map((request) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-black/40 border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-500/40 transition-colors cursor-pointer"
                      onClick={() => setResponse(request.response)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={methodColors[request.method]}>
                            {request.method}
                          </Badge>
                          <code className="text-xs text-cyan-400">{request.url}</code>
                        </div>
                        <Badge className={
                          request.status === 200
                            ? 'bg-green-500/20 border-green-500/50 text-green-400'
                            : 'bg-red-500/20 border-red-500/50 text-red-400'
                        }>
                          {request.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-cyan-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {request.responseTime}ms
                        </span>
                        <span>•</span>
                        <span>{request.timestamp.toLocaleTimeString()}</span>
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
