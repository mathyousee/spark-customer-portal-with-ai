import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Robot, FileText, Image, Upload, SpinnerGap, Warning } from '@phosphor-icons/react';
import { Separator } from '@/components/ui/separator';
import { generateDocumentSummary, summarizeWithAzureOpenAI } from '@/lib/azure-openai';
import { azureConfig, updateAzureConfig, isConfigValid } from '@/lib/azure-config';

// Define an interface for summary history items
interface SummaryItem {
  id: string;
  type: 'document' | 'image';
  fileName: string;
  summary: string;
  date: string;
  fileSize?: string;
}

interface AzureOpenAIConfig {
  endpoint: string;
  apiKey: string;
  deploymentName: string;
}

export function AITools() {
  // State for file upload
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSummary, setCurrentSummary] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [textToSummarize, setTextToSummarize] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState<boolean>(true); // Assume configured by default
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [configValues, setConfigValues] = useState<AzureOpenAIConfig>({
    endpoint: azureConfig.endpoint,
    apiKey: azureConfig.apiKey,
    deploymentName: azureConfig.deploymentName
  });
  
  // Use persisted state for summary history
  const [summaryHistory, setSummaryHistory] = useKV<SummaryItem[]>('summary-history', []);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Summarize text input
  const summarizeText = async () => {
    if (!textToSummarize.trim()) {
      toast.error('Please enter text to summarize');
      return;
    }
    
    if (!isConfigured) {
      toast.error('Azure OpenAI is not properly configured');
      setShowConfig(true);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Call the Azure OpenAI service with the text content
      const result = await summarizeWithAzureOpenAI(textToSummarize);
      
      setCurrentSummary(result.summary);
      
      // Add to history
      const newHistoryItem: SummaryItem = {
        id: Date.now().toString(),
        type: 'document',
        fileName: 'Text Summary',
        summary: result.summary,
        date: new Date().toLocaleString(),
        fileSize: `${textToSummarize.length} characters`
      };
      
      setSummaryHistory((prevHistory = []) => [newHistoryItem, ...prevHistory]);
      
      toast.success('Summary generated successfully');
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error(`Failed to generate summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle configuration update
  const handleConfigUpdate = () => {
    // Update the configuration through our config utility
    updateAzureConfig({
      endpoint: configValues.endpoint,
      apiKey: configValues.apiKey,
      deploymentName: configValues.deploymentName
    });
    
    // Check if the configuration is now valid
    setIsConfigured(isConfigValid());
    
    if (isConfigValid()) {
      toast.success('Configuration updated successfully');
      setShowConfig(false);
    } else {
      toast.warning('Configuration saved but appears to be incomplete');
    }
  };

  // Check if Azure OpenAI is configured
  useEffect(() => {
    // Use our validation helper
    setIsConfigured(isConfigValid());
  }, []);
  
  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Reset the summary when a new file is selected
      setCurrentSummary('');
    }
  };
  
  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Simulate document summary generation with Azure OpenAI
  const generateSummary = async () => {
    if (!file) {
      toast.error('Please select a file to summarize');
      return;
    }
    
    if (!isConfigured) {
      toast.error('Azure OpenAI is not properly configured');
      setShowConfig(true);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Call our Azure OpenAI wrapper
      const result = await generateDocumentSummary(file);
      
      // Update current summary with the result
      setCurrentSummary(result.summary);
      
      // Add to history
      const newHistoryItem: SummaryItem = {
        id: Date.now().toString(),
        type: file.type.startsWith('image/') ? 'image' : 'document',
        fileName: file.name,
        summary: result.summary,
        date: new Date().toLocaleString(),
        fileSize: formatFileSize(file.size)
      };
      
      setSummaryHistory((prevHistory = []) => [newHistoryItem, ...prevHistory]);
      
      toast.success('Summary generated successfully');
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error(`Failed to generate summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Trigger file input click
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Clear current file and summary
  const handleClear = () => {
    setFile(null);
    setCurrentSummary('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Delete a history item
  const deleteHistoryItem = (id: string) => {
    setSummaryHistory((prevHistory = []) => prevHistory.filter(item => item.id !== id));
    toast.success('Item removed from history');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Robot size={28} className="text-primary mr-2" />
        <h1 className="text-2xl font-bold">AI Document Summarization</h1>
      </div>
      
      <p className="text-muted-foreground">
        Upload documents or images to generate concise summaries using Azure OpenAI.
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload & Summarize</TabsTrigger>
          <TabsTrigger value="text">Text Summarization</TabsTrigger>
          <TabsTrigger value="history">Summary History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-4 mt-4">
          {!isConfigured ? (
            <Card className="bg-destructive/10 border-destructive/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Warning size={20} className="text-destructive" />
                  <CardTitle>Azure OpenAI Not Configured</CardTitle>
                </div>
                <CardDescription>
                  The Azure OpenAI service needs to be configured to use this feature
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  To use the document summarization feature, please configure your Azure OpenAI service credentials.
                  Contact your system administrator to set up the required API keys and endpoint information.
                </p>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => toast.info('Please contact IT support for Azure OpenAI configuration')}>
                    Contact Support
                  </Button>
                  <Button onClick={() => setShowConfig(true)}>
                    Configure Now
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Upload Document or Image</CardTitle>
                <CardDescription>
                  Select a file to summarize using Azure OpenAI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary/50 transition-colors" onClick={triggerFileUpload}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,image/*"
                  />
                  
                  <Upload size={40} className="text-muted-foreground mb-2" />
                  
                  {file ? (
                    <div className="text-center">
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="font-medium text-foreground">Click to upload or drag and drop</p>
                      <p className="text-sm text-muted-foreground">PDF, DOC, TXT, CSV, Excel, or image files</p>
                    </div>
                  )}
                </div>
                
                {file && (
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleClear}>
                      Clear
                    </Button>
                    <Button onClick={generateSummary} disabled={isProcessing}>
                      {isProcessing ? (
                        <>
                          <SpinnerGap size={16} className="mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Summarize
                        </>
                      )}
                    </Button>
                  </div>
                )}
                
                {currentSummary && (
                  <div className="mt-4">
                    <Label htmlFor="summary">AI Summary</Label>
                    <Textarea 
                      id="summary" 
                      className="min-h-[200px] mt-2" 
                      value={currentSummary} 
                      readOnly 
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="text" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Text Summarization</CardTitle>
              <CardDescription>
                Paste text content to generate an AI summary
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-input">Text to Summarize</Label>
                <Textarea
                  id="text-input"
                  placeholder="Paste or type the text you want to summarize..."
                  className="min-h-[200px] resize-none"
                  value={textToSummarize}
                  onChange={(e) => setTextToSummarize(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setTextToSummarize('')}
                  disabled={!textToSummarize || isProcessing}
                >
                  Clear
                </Button>
                <Button 
                  onClick={summarizeText}
                  disabled={!textToSummarize || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <SpinnerGap size={16} className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Summarize'
                  )}
                </Button>
              </div>
              
              {currentSummary && activeTab === 'text' && (
                <div className="mt-4">
                  <Label htmlFor="text-summary">AI Summary</Label>
                  <Textarea 
                    id="text-summary" 
                    className="min-h-[150px] mt-2" 
                    value={currentSummary} 
                    readOnly 
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Summary History</CardTitle>
              <CardDescription>
                View your previously generated summaries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(summaryHistory || []).length > 0 ? (
                <div className="space-y-4">
                  {(summaryHistory || []).map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardHeader className="bg-muted/30 py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {item.type === 'image' ? (
                              <Image size={18} className="mr-2" />
                            ) : (
                              <FileText size={18} className="mr-2" />
                            )}
                            <span className="font-medium truncate max-w-[300px]">
                              {item.fileName}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.date}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="py-3">
                        <div className="text-sm whitespace-pre-line">
                          {item.summary}
                        </div>
                      </CardContent>
                      <CardFooter className="bg-muted/30 py-2 flex justify-between">
                        <div className="text-xs text-muted-foreground">
                          {item.fileSize}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-auto p-1 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteHistoryItem(item.id)}
                        >
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText size={32} className="mx-auto mb-2" />
                  <p>No summary history yet</p>
                  <p className="text-sm">Summarized documents will appear here</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab('upload')}
                  >
                    Go to Summarize
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle>About Azure OpenAI Summarization</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            This feature uses Azure OpenAI Service to generate concise summaries of documents and images. 
            The service extracts key information from your files, saving you time and helping you quickly understand document contents.
          </p>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Supported File Types</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• PDF documents (with text extraction)</li>
                <li>• Word documents (.doc, .docx)</li>
                <li>• Excel files (.xlsx, .xls)</li>
                <li>• CSV files</li>
                <li>• Text files (.txt)</li>
                <li>• Images (.jpg, .png, .gif)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Best Practices</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Upload clear, high-quality documents</li>
                <li>• Text is automatically extracted from PDFs and Word docs</li>
                <li>• For spreadsheets, data from all sheets is included</li>
                <li>• Keep files under 10MB for best performance</li>
                <li>• Images require manual description for now</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Azure OpenAI Configuration Dialog */}
      {showConfig && (
        <Card className="border-primary/20">
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Robot size={20} />
              Azure OpenAI Configuration
            </CardTitle>
            <CardDescription>
              Configure your Azure OpenAI service credentials to enable document summarization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="azure-endpoint">Azure OpenAI Endpoint</Label>
              <Input
                id="azure-endpoint"
                placeholder="https://your-resource-name.openai.azure.com"
                value={configValues.endpoint}
                onChange={(e) => setConfigValues({...configValues, endpoint: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">
                The endpoint URL for your Azure OpenAI resource
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="azure-api-key">API Key</Label>
              <Input
                id="azure-api-key"
                type="password"
                placeholder="Enter your API key"
                value={configValues.apiKey}
                onChange={(e) => setConfigValues({...configValues, apiKey: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">
                Your Azure OpenAI API key from the Azure portal
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="azure-deployment">Deployment Name</Label>
              <Input
                id="azure-deployment"
                placeholder="gpt-35-turbo"
                value={configValues.deploymentName}
                onChange={(e) => setConfigValues({...configValues, deploymentName: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">
                The name of your Azure OpenAI model deployment
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowConfig(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfigUpdate}>
              Save Configuration
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}