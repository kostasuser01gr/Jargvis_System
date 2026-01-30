import { useState } from 'react';
import { motion } from 'motion/react';
import { Code, Play, Save, Download, Upload, GitBranch, Folder, File, Settings } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';

const SAMPLE_CODE = {
  typescript: `// JARVIS AI System - Main Controller
import { AICore } from './core/ai';
import { QuantumProcessor } from './processors/quantum';

class JARVISSystem {
  private ai: AICore;
  private quantum: QuantumProcessor;
  
  constructor() {
    this.ai = new AICore({
      model: 'neural-v3',
      layers: 128,
      accuracy: 0.974
    });
    
    this.quantum = new QuantumProcessor({
      qubits: 8,
      entanglement: true
    });
  }
  
  async processCommand(cmd: string): Promise<string> {
    const analysis = await this.ai.analyze(cmd);
    const result = await this.quantum.compute(analysis);
    return this.formatResponse(result);
  }
  
  private formatResponse(data: any): string {
    return \`Processing complete: \${data.output}\`;
  }
}

export default JARVISSystem;`,
  
  python: `# JARVIS Neural Network Training
import numpy as np
import tensorflow as tf
from quantum_core import QuantumLayer

class JARVISNeuralNet:
    def __init__(self, layers=128):
        self.model = self.build_model(layers)
        self.quantum_layer = QuantumLayer(qubits=8)
    
    def build_model(self, layers):
        model = tf.keras.Sequential([
            tf.keras.layers.Dense(layers, activation='relu'),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(layers // 2, activation='relu'),
            tf.keras.layers.Dense(1, activation='sigmoid')
        ])
        return model
    
    def train(self, X, y, epochs=100):
        self.model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
        
        history = self.model.fit(
            X, y,
            epochs=epochs,
            validation_split=0.2,
            verbose=1
        )
        
        return history
    
    def predict_with_quantum(self, input_data):
        classical_output = self.model.predict(input_data)
        quantum_enhanced = self.quantum_layer.enhance(classical_output)
        return quantum_enhanced

# Initialize JARVIS
jarvis = JARVISNeuralNet(layers=256)
print("JARVIS Neural Network initialized successfully")`,

  sql: `-- JARVIS Database Schema
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    model VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'idle',
    battery_level INTEGER CHECK (battery_level >= 0 AND battery_level <= 100),
    location POINT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS missions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS threat_logs (
    id SERIAL PRIMARY KEY,
    threat_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    location POINT,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT FALSE
);

-- Indexes for performance
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_missions_status ON missions(status);
CREATE INDEX idx_threats_severity ON threat_logs(severity);

-- Insert sample data
INSERT INTO vehicles (model, status, battery_level, location) VALUES
('Tesla Model S', 'active', 87, POINT(34.0522, -118.2437)),
('Audi e-tron', 'idle', 62, POINT(34.0689, -118.4452)),
('BMW iX', 'charging', 34, POINT(34.0195, -118.4912));`
};

export function CodeEditor() {
  const [activeTab, setActiveTab] = useState('typescript');
  const [code, setCode] = useState(SAMPLE_CODE.typescript);
  const [lineCount, setLineCount] = useState(0);
  const [executing, setExecuting] = useState(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCode(SAMPLE_CODE[value as keyof typeof SAMPLE_CODE]);
  };

  const handleExecute = () => {
    setExecuting(true);
    toast.info('Executing code...');
    
    setTimeout(() => {
      setExecuting(false);
      toast.success('Code executed successfully! ✓', {
        description: 'Output: All systems operational'
      });
    }, 2000);
  };

  const handleSave = () => {
    toast.success('File saved successfully!', {
      description: `Saved ${activeTab} file to workspace`
    });
  };

  const handleExport = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jarvis-${activeTab}.${activeTab === 'sql' ? 'sql' : activeTab}`;
    a.click();
    toast.success('Code exported!');
  };

  return (
    <Card className="bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border-cyan-500/30 h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-cyan-500/30 p-4 flex items-center justify-between bg-gradient-to-r from-black/60 to-cyan-950/20">
        <div className="flex items-center gap-3">
          <Code className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-cyan-400">JARVIS Code Editor</h3>
            <p className="text-xs text-cyan-600">Quantum-enhanced IDE</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className="bg-cyan-500/20 border-cyan-500/50 text-cyan-400">
            <GitBranch className="w-3 h-3 mr-1" />
            main
          </Badge>
          <Button
            size="sm"
            variant="outline"
            className="border-cyan-500/30 text-cyan-400"
            onClick={handleSave}
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-cyan-500/30 text-cyan-400"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            size="sm"
            className={`${executing ? 'bg-green-500/20 border-green-500 animate-pulse' : 'bg-green-500/20 border-green-500/50'} border text-green-400`}
            onClick={handleExecute}
            disabled={executing}
          >
            <Play className="w-4 h-4 mr-2" />
            {executing ? 'Running...' : 'Run'}
          </Button>
        </div>
      </div>

      {/* File Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
        <TabsList className="border-b border-cyan-500/20 bg-black/40 rounded-none justify-start p-0">
          <TabsTrigger 
            value="typescript" 
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-400"
          >
            <File className="w-3 h-3 mr-2" />
            main.ts
          </TabsTrigger>
          <TabsTrigger 
            value="python" 
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-400"
          >
            <File className="w-3 h-3 mr-2" />
            neural.py
          </TabsTrigger>
          <TabsTrigger 
            value="sql" 
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-400"
          >
            <File className="w-3 h-3 mr-2" />
            schema.sql
          </TabsTrigger>
        </TabsList>

        {/* Code Area */}
        <div className="flex-1 flex">
          {/* Line Numbers */}
          <div className="bg-black/40 border-r border-cyan-500/20 p-4 text-cyan-600 text-sm font-mono text-right select-none">
            {code.split('\n').map((_, i) => (
              <div key={i} className="leading-6">{i + 1}</div>
            ))}
          </div>

          {/* Editor */}
          <TabsContent value={activeTab} className="flex-1 m-0 p-0">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-full bg-black/60 border-none text-cyan-300 font-mono text-sm resize-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none leading-6"
              style={{ 
                tabSize: 2,
                whiteSpace: 'pre',
                overflowWrap: 'normal',
                overflowX: 'auto'
              }}
            />
          </TabsContent>
        </div>
      </Tabs>

      {/* Footer Status Bar */}
      <div className="border-t border-cyan-500/30 p-2 bg-black/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4 text-cyan-600">
          <span>UTF-8</span>
          <span>LF</span>
          <span className="capitalize">{activeTab}</span>
          <span>Ln {code.split('\n').length}, Col 1</span>
        </div>
        <div className="flex items-center gap-4 text-cyan-600">
          <span>Spaces: 2</span>
          <span>AI Assist: ON</span>
          <Button size="sm" variant="ghost" className="h-6 text-cyan-600 hover:text-cyan-400">
            <Settings className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
