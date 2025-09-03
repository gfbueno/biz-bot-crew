import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Settings, Brain, Code, Zap, Globe } from "lucide-react";

interface LLMConfig {
  department: string;
  currentModel: string;
  availableModels: {
    local: string[];
    cloud: string[];
  };
}

const llmConfigs: LLMConfig[] = [
  {
    department: "Análise de Negócio",
    currentModel: "gemini-pro",
    availableModels: {
      local: ["phi3", "llama2"],
      cloud: ["gemini-pro", "gemini-flash"]
    }
  },
  {
    department: "Desenvolvimento",
    currentModel: "codellama",
    availableModels: {
      local: ["codellama", "deepseek-coder", "starcoder"],
      cloud: ["gemini-pro", "gemini-flash"]
    }
  },
  {
    department: "Arquitetura",
    currentModel: "codellama",
    availableModels: {
      local: ["codellama", "phi3", "llama2"],
      cloud: ["gemini-pro", "gemini-flash"]
    }
  }
];

interface ConfigurationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ConfigurationModal({ open, onOpenChange }: ConfigurationModalProps) {
  const [configs, setConfigs] = useState(llmConfigs);

  const updateModel = (departmentIndex: number, newModel: string) => {
    const updatedConfigs = [...configs];
    updatedConfigs[departmentIndex].currentModel = newModel;
    setConfigs(updatedConfigs);
  };

  const getModelIcon = (model: string) => {
    if (model.includes('code') || model.includes('coder')) {
      return <Code className="w-4 h-4" />;
    }
    if (model.includes('gemini')) {
      return <Globe className="w-4 h-4" />;
    }
    return <Brain className="w-4 h-4" />;
  };

  const getModelType = (model: string, availableModels: LLMConfig['availableModels']) => {
    if (availableModels.local.includes(model)) return 'local';
    if (availableModels.cloud.includes(model)) return 'cloud';
    return 'unknown';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuração de LLMs
          </DialogTitle>
          <DialogDescription>
            Configure qual modelo de IA cada departamento deve usar. Modelos locais são gratuitos 
            mas requerem mais recursos, enquanto modelos na nuvem são mais rápidos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status dos Serviços</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 p-3 bg-success/10 rounded-lg border border-success/20">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm">Ollama: Online</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-success/10 rounded-lg border border-success/20">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm">Gemini API: Conectada</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-lg border border-warning/20">
                  <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                  <span className="text-sm">ChromaDB: Sincronizando</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* LLM Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configuração por Departamento</h3>
            
            {configs.map((config, index) => (
              <Card key={config.department} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {getModelIcon(config.currentModel)}
                    </div>
                    <div>
                      <h4 className="font-medium">{config.department}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={getModelType(config.currentModel, config.availableModels) === 'local' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {getModelType(config.currentModel, config.availableModels) === 'local' ? (
                            <>
                              <Zap className="w-3 h-3 mr-1" />
                              Local
                            </>
                          ) : (
                            <>
                              <Globe className="w-3 h-3 mr-1" />
                              Nuvem
                            </>
                          )}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{config.currentModel}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Select 
                    value={config.currentModel} 
                    onValueChange={(value) => updateModel(index, value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                        Modelos Locais (Ollama)
                      </div>
                      {config.availableModels.local.map((model) => (
                        <SelectItem key={model} value={model} className="pl-4">
                          <div className="flex items-center gap-2">
                            <Zap className="w-3 h-3" />
                            {model}
                          </div>
                        </SelectItem>
                      ))}
                      <div className="px-2 py-1 text-xs font-medium text-muted-foreground mt-2">
                        Modelos na Nuvem
                      </div>
                      {config.availableModels.cloud.map((model) => (
                        <SelectItem key={model} value={model} className="pl-4">
                          <div className="flex items-center gap-2">
                            <Globe className="w-3 h-3" />
                            {model}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button className="bg-gradient-to-r from-primary to-accent">
              Salvar Configurações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}