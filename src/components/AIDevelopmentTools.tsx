import { useState } from 'react';
import { motion } from 'motion/react';
import { Code2, CheckCircle2, TestTube, Bug, FileText, RefreshCw, Search, Sparkles, AlertCircle, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { toast } from 'sonner';

interface CodeReview {
  id: string;
  file: string;
  line: number;
  severity: 'error' | 'warning' | 'info' | 'suggestion';
  message: string;
  suggestion: string;
  category: string;
}

interface TestCase {
  id: string;
  name: string;
  description: string;
  code: string;
  status: 'generated' | 'passed' | 'failed';
}

interface Refactoring {
  id: string;
  type: 'extract' | 'rename' | 'simplify' | 'optimize';
  description: string;
  before: string;
  after: string;
  confidence: number;
}

export function AIDevelopmentTools() {
  const [codeReviews, setCodeReviews] = useState<CodeReview[]>([
    {
      id: '1',
      file: 'src/utils/api.ts',
      line: 45,
      severity: 'warning',
      message: 'Potential null pointer exception',
      suggestion: 'Add null check before accessing property',
      category: 'Safety'
    },
    {
      id: '2',
      file: 'src/components/Button.tsx',
      line: 23,
      severity: 'suggestion',
      message: 'Consider using useMemo for expensive computation',
      suggestion: 'Wrap calculation in useMemo hook',
      category: 'Performance'
    },
    {
      id: '3',
      file: 'src/hooks/useAuth.ts',
      line: 12,
      severity: 'error',
      message: 'Missing error handling',
      suggestion: 'Add try-catch block around async operation',
      category: 'Error Handling'
    }
  ]);

  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [refactorings, setRefactorings] = useState<Refactoring[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const runCodeReview = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          toast.success('Code review completed! Found 3 issues.');
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const generateTests = () => {
    const newTests: TestCase[] = [
      {
        id: 'test-1',
        name: 'test_user_authentication',
        description: 'Tests user authentication flow',
        code: `describe('User Authentication', () => {
  it('should authenticate valid user', async () => {
    const result = await authenticate('user@example.com', 'password');
    expect(result.success).toBe(true);
  });
});`,
        status: 'generated'
      },
      {
        id: 'test-2',
        name: 'test_api_error_handling',
        description: 'Tests API error handling',
        code: `describe('API Error Handling', () => {
  it('should handle network errors', async () => {
    await expect(fetchData('/invalid')).rejects.toThrow();
  });
});`,
        status: 'generated'
      }
    ];
    
    setTestCases(newTests);
    toast.success('Generated 2 test cases!');
  };

  const suggestRefactoring = () => {
    const newRefactorings: Refactoring[] = [
      {
        id: 'refactor-1',
        type: 'extract',
        description: 'Extract repeated logic into utility function',
        before: 'const result = data.map(x => x.value * 2).filter(x => x > 10);',
        after: 'const doubleAndFilter = (data) => data.map(x => x.value * 2).filter(x => x > 10);\nconst result = doubleAndFilter(data);',
        confidence: 0.92
      },
      {
        id: 'refactor-2',
        type: 'optimize',
        description: 'Optimize nested loops',
        before: 'for (let i = 0; i < arr.length; i++) { for (let j = 0; j < arr[i].length; j++) { ... } }',
        after: 'arr.flat().forEach(item => { ... });',
        confidence: 0.88
      }
    ];
    
    setRefactorings(newRefactorings);
    toast.success('Found 2 refactoring opportunities!');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'warning': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'info': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      default: return 'bg-green-500/20 border-green-500/50 text-green-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-slate-950/20 to-gray-950/20 border-slate-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-slate-400 flex items-center gap-2">
              <Code2 className="w-6 h-5" />
              AI-Powered Development Tools
            </h3>
            <p className="text-xs text-slate-600 mt-1">Automated code review, test generation, and refactoring</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={runCodeReview}
              disabled={isAnalyzing}
              className="bg-slate-500/20 border-slate-500/50 text-slate-400 hover:bg-slate-500/30"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Run Code Review'}
            </Button>
            <Button
              onClick={generateTests}
              className="bg-slate-500/20 border-slate-500/50 text-slate-400 hover:bg-slate-500/30"
            >
              <TestTube className="w-4 h-4 mr-2" />
              Generate Tests
            </Button>
            <Button
              onClick={suggestRefactoring}
              className="bg-slate-500/20 border-slate-500/50 text-slate-400 hover:bg-slate-500/30"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Suggest Refactoring
            </Button>
          </div>
        </div>

        {/* Progress */}
        {isAnalyzing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Analyzing code...</span>
              <span className="text-slate-400 font-mono">{analysisProgress}%</span>
            </div>
            <Progress value={analysisProgress} className="h-2" />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          {[
            { label: 'Issues Found', value: codeReviews.length, icon: AlertCircle },
            { label: 'Tests Generated', value: testCases.length, icon: TestTube },
            { label: 'Refactorings', value: refactorings.length, icon: RefreshCw },
            { label: 'Code Quality', value: '87%', icon: TrendingUp },
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

      <Tabs defaultValue="review" className="w-full">
        <TabsList className="bg-black/40 border-slate-500/30">
          <TabsTrigger value="review">Code Review</TabsTrigger>
          <TabsTrigger value="tests">Test Generation</TabsTrigger>
          <TabsTrigger value="refactoring">Refactoring</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="review" className="mt-6">
          <Card className="bg-gradient-to-br from-slate-950/20 to-gray-950/20 border-slate-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-slate-400">Code Review Results</h4>
              <Badge className="bg-slate-500/20 border-slate-500/50 text-slate-400">
                {codeReviews.length} issues
              </Badge>
            </div>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {codeReviews.map((review) => (
                  <Card key={review.id} className="bg-black/40 border-slate-500/30 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3">
                        <Badge className={getSeverityColor(review.severity)}>
                          {review.severity}
                        </Badge>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-slate-400 font-mono text-sm">{review.file}</span>
                            <span className="text-slate-600">Line {review.line}</span>
                          </div>
                          <p className="text-sm text-slate-300 mb-1">{review.message}</p>
                          <Badge className="bg-slate-500/10 text-slate-400 text-[10px]">
                            {review.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-black/60 rounded border border-slate-500/30">
                      <p className="text-xs text-slate-600 mb-1">Suggestion:</p>
                      <p className="text-sm text-slate-300">{review.suggestion}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3 border-slate-500/30 text-slate-400 hover:bg-slate-500/20"
                    >
                      <Sparkles className="w-3 h-3 mr-2" />
                      Apply Fix
                    </Button>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="mt-6">
          <Card className="bg-gradient-to-br from-slate-950/20 to-gray-950/20 border-slate-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-slate-400">Generated Test Cases</h4>
              <Button
                onClick={generateTests}
                className="bg-slate-500/20 border-slate-500/50 text-slate-400 hover:bg-slate-500/30"
              >
                <TestTube className="w-4 h-4 mr-2" />
                Generate More
              </Button>
            </div>
            <ScrollArea className="h-[500px]">
              {testCases.length === 0 ? (
                <div className="text-center text-slate-600 py-8">
                  <TestTube className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No tests generated yet</p>
                  <p className="text-xs mt-1">Click "Generate Tests" to create test cases</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {testCases.map((test) => (
                    <Card key={test.id} className="bg-black/40 border-slate-500/30 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="text-slate-400 mb-1">{test.name}</h5>
                          <p className="text-xs text-slate-600">{test.description}</p>
                        </div>
                        <Badge className={
                          test.status === 'passed' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                          test.status === 'failed' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                          'bg-blue-500/20 border-blue-500/50 text-blue-400'
                        }>
                          {test.status}
                        </Badge>
                      </div>
                      <pre className="text-xs text-slate-300 bg-black/60 p-3 rounded overflow-auto">
                        {test.code}
                      </pre>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500/30 text-green-400 hover:bg-green-500/20"
                        >
                          Run Test
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-500/30 text-slate-400 hover:bg-slate-500/20"
                        >
                          Edit
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="refactoring" className="mt-6">
          <Card className="bg-gradient-to-br from-slate-950/20 to-gray-950/20 border-slate-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-slate-400">Refactoring Suggestions</h4>
              <Button
                onClick={suggestRefactoring}
                className="bg-slate-500/20 border-slate-500/50 text-slate-400 hover:bg-slate-500/30"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Analyze
              </Button>
            </div>
            <ScrollArea className="h-[500px]">
              {refactorings.length === 0 ? (
                <div className="text-center text-slate-600 py-8">
                  <RefreshCw className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No refactoring suggestions yet</p>
                  <p className="text-xs mt-1">Click "Analyze" to find refactoring opportunities</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {refactorings.map((refactor) => (
                    <Card key={refactor.id} className="bg-black/40 border-slate-500/30 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <Badge className="bg-purple-500/20 border-purple-500/50 text-purple-400">
                            {refactor.type}
                          </Badge>
                          <p className="text-sm text-slate-300 mt-2">{refactor.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-400 font-mono">{(refactor.confidence * 100).toFixed(0)}%</div>
                          <div className="text-xs text-slate-600">Confidence</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Before:</p>
                          <pre className="text-xs text-red-300 bg-black/60 p-2 rounded overflow-auto">
                            {refactor.before}
                          </pre>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1">After:</p>
                          <pre className="text-xs text-green-300 bg-black/60 p-2 rounded overflow-auto">
                            {refactor.after}
                          </pre>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-3 border-green-500/30 text-green-400 hover:bg-green-500/20"
                      >
                        <RefreshCw className="w-3 h-3 mr-2" />
                        Apply Refactoring
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="mt-6">
          <Card className="bg-gradient-to-br from-slate-950/20 to-gray-950/20 border-slate-500/30 p-6">
            <h4 className="text-slate-400 mb-4">Auto-Generated Documentation</h4>
            <div className="space-y-4">
              <Button
                className="w-full bg-slate-500/20 border-slate-500/50 text-slate-400 hover:bg-slate-500/30"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate API Documentation
              </Button>
              <Button
                className="w-full bg-slate-500/20 border-slate-500/50 text-slate-400 hover:bg-slate-500/30"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Code Comments
              </Button>
              <Button
                className="w-full bg-slate-500/20 border-slate-500/50 text-slate-400 hover:bg-slate-500/30"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate README
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
