
"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, KeyRound, FolderOpen, Save, Trash2, PlusCircle, Edit3, Star, HelpCircle } from 'lucide-react';
import type { AppSettings, ApiKeySetting, EditorSetting } from '@/lib/types';
import { mockSettings } from '@/lib/mock-data'; 
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(mockSettings);
  const [newApiKeyName, setNewApiKeyName] = useState('');
  const [newApiKey, setNewApiKey] = useState('');
  const [newScanPath, setNewScanPath] = useState('');
  
  const [newEditorName, setNewEditorName] = useState('');
  const [newEditorPath, setNewEditorPath] = useState('');


  useEffect(() => {
    const storedSettings = localStorage.getItem('appSettings');
    if (storedSettings) {
      const parsedSettings: AppSettings = JSON.parse(storedSettings);
      // Ensure editors array exists
      if (!parsedSettings.editors) {
        parsedSettings.editors = [];
      }
      setSettings(parsedSettings);
    } else {
      // Initialize with mock if nothing in localStorage, ensuring editors array
      setSettings({ ...mockSettings, editors: mockSettings.editors || [] });
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);


  const handleApiKeyChange = (id: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      apiKeys: prev.apiKeys.map(ak => ak.id === id ? { ...ak, key: value } : ak)
    }));
  };

  const handleAddApiKey = () => {
    if (!newApiKeyName.trim() || !newApiKey.trim()) {
      toast({ title: "Error", description: "API Key Name and Key value cannot be empty.", variant: "destructive" });
      return;
    }
    const newKeyEntry: ApiKeySetting = {
      id: `apikey-${Date.now()}`, 
      name: newApiKeyName.trim(),
      key: newApiKey.trim()
    };
    setSettings(prev => ({
      ...prev,
      apiKeys: [...prev.apiKeys, newKeyEntry]
    }));
    setNewApiKeyName('');
    setNewApiKey('');
    toast({ title: "API Key Added", description: `Successfully added ${newKeyEntry.name}.` });
  };
  
  const handleDeleteApiKey = (id: string) => {
    setSettings(prev => ({
      ...prev,
      apiKeys: prev.apiKeys.filter(ak => ak.id !== id)
    }));
    toast({ title: "API Key Deleted", description: "API Key has been removed." });
  };

  const handleScanPathChange = (index: number, value: string) => {
    setSettings(prev => {
      const updatedPaths = [...prev.defaultScanPaths];
      updatedPaths[index] = value;
      return { ...prev, defaultScanPaths: updatedPaths };
    });
  };

  const handleAddScanPath = () => {
    if (!newScanPath.trim()) {
      toast({ title: "Error", description: "Scan path cannot be empty.", variant: "destructive" });
      return;
    }
    setSettings(prev => ({
      ...prev,
      defaultScanPaths: [...prev.defaultScanPaths, newScanPath.trim()]
    }));
    setNewScanPath('');
    toast({ title: "Scan Path Added", description: "New scan path added." });
  };
  
  const handleDeleteScanPath = (index: number) => {
    setSettings(prev => ({
      ...prev,
      defaultScanPaths: prev.defaultScanPaths.filter((_, i) => i !== index)
    }));
    toast({ title: "Scan Path Deleted", description: "Scan path removed." });
  };

  const handleEditorDetailChange = (id: string, field: 'name' | 'path', value: string) => {
    setSettings(prev => ({
      ...prev,
      editors: prev.editors.map(editor => 
        editor.id === id ? { ...editor, [field]: value } : editor
      )
    }));
  };

  const handleAddEditor = () => {
    if (!newEditorName.trim()) {
      toast({ title: "Error", description: "Editor name cannot be empty.", variant: "destructive" });
      return;
    }
    const newEditor: EditorSetting = {
      id: `editor-${Date.now()}`,
      name: newEditorName.trim(),
      path: newEditorPath.trim() || undefined,
    };
    setSettings(prev => ({
      ...prev,
      editors: [...(prev.editors || []), newEditor]
    }));
    setNewEditorName('');
    setNewEditorPath('');
    toast({ title: "Editor Added", description: `Successfully added ${newEditor.name}.` });
  };

  const handleDeleteEditor = (id: string) => {
    setSettings(prev => ({
      ...prev,
      editors: (prev.editors || []).filter(editor => editor.id !== id),
      defaultEditorId: prev.defaultEditorId === id ? undefined : prev.defaultEditorId
    }));
    toast({ title: "Editor Deleted", description: "Editor has been removed." });
  };

  const handleSetDefaultEditor = (id: string) => {
    setSettings(prev => ({
      ...prev,
      defaultEditorId: id
    }));
    const editor = settings.editors.find(e => e.id === id);
    toast({ title: "Default Editor Set", description: `${editor?.name || 'Editor'} set as default.` });
  };
  
  const handleSaveChanges = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    toast({ title: "Settings Saved", description: "Your application settings have been updated." });
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center">
              <SettingsIcon className="mr-3 h-8 w-8 text-primary" />
              Application Settings
            </CardTitle>
            <CardDescription>Configure API keys, default scan paths, project editors, and other application-wide settings.</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><KeyRound className="mr-2 h-5 w-5" /> API Key Configuration</CardTitle>
            <CardDescription>Manage API keys for remote AI services and other integrations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="space-y-2 p-4 border rounded-md">
                <Label htmlFor={apiKey.id} className="text-base font-medium">{apiKey.name}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id={apiKey.id}
                    type="password"
                    placeholder={`Enter ${apiKey.name}`}
                    value={apiKey.key}
                    onChange={(e) => handleApiKeyChange(apiKey.id, e.target.value)}
                    className="flex-grow"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteApiKey(apiKey.id)} aria-label={`Delete ${apiKey.name}`}>
                          <Trash2 className="h-4 w-4 text-destructive"/>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete {apiKey.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))}
            <Separator />
            <div className="space-y-2 p-4 border border-dashed rounded-md">
              <h3 className="text-lg font-semibold">Add New API Key</h3>
              <Label htmlFor="newApiKeyName">Service Name</Label>
              <Input 
                  id="newApiKeyName" 
                  placeholder="e.g., Custom Analysis Service" 
                  value={newApiKeyName} 
                  onChange={(e) => setNewApiKeyName(e.target.value)} 
              />
              <Label htmlFor="newApiKey">API Key Value</Label>
              <Input 
                  id="newApiKey" 
                  type="password"
                  placeholder="Enter API Key" 
                  value={newApiKey} 
                  onChange={(e) => setNewApiKey(e.target.value)} 
              />
              <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={handleAddApiKey} variant="outline" className="mt-2">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add API Key
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Save this new API key configuration.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><FolderOpen className="mr-2 h-5 w-5" /> Default Scan Paths</CardTitle>
            <CardDescription>
              Specify default directories for project discovery. This is a placeholder as local file system scanning is limited in web apps.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.defaultScanPaths.map((path, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="text"
                  value={path}
                  onChange={(e) => handleScanPathChange(index, e.target.value)}
                  placeholder="/path/to/your/projects"
                  className="flex-grow"
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteScanPath(index)} aria-label={`Delete path ${path}`}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete this scan path</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}
            <Separator />
            <div className="space-y-2 pt-2">
              <Label htmlFor="newScanPath">Add New Scan Path</Label>
              <Input 
                  id="newScanPath" 
                  placeholder="/another/path/to/projects" 
                  value={newScanPath} 
                  onChange={(e) => setNewScanPath(e.target.value)} 
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleAddScanPath} variant="outline" className="mt-2">
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Scan Path
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Add this new scan path to the list.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        <Card id="editor-config">
          <CardHeader>
            <CardTitle className="flex items-center"><Edit3 className="mr-2 h-5 w-5" /> Project Editors</CardTitle>
            <CardDescription>Manage your code editors and set a default for opening projects.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={settings.defaultEditorId || ""} onValueChange={handleSetDefaultEditor}>
              {(settings.editors || []).map((editor) => (
                <div key={editor.id} className="p-4 border rounded-md space-y-3">
                  <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                          <RadioGroupItem value={editor.id} id={editor.id} />
                          <Label htmlFor={editor.id} className="text-base font-medium cursor-pointer flex items-center">
                              {editor.name}
                              {editor.id === settings.defaultEditorId && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Star className="ml-2 h-4 w-4 text-yellow-500 fill-yellow-500 cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>This is the default editor. Click another editor's radio button to change.</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                          </Label>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteEditor(editor.id)} aria-label={`Delete ${editor.name}`}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete {editor.name}</p>
                        </TooltipContent>
                      </Tooltip>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`editorName-${editor.id}`}>Editor Name</Label>
                    <Input
                      id={`editorName-${editor.id}`}
                      value={editor.name}
                      onChange={(e) => handleEditorDetailChange(editor.id, 'name', e.target.value)}
                      placeholder="e.g., Visual Studio Code"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`editorPath-${editor.id}`} className="flex items-center">
                      Path/Command (Optional)
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The command or full path to the editor executable.<br/>Example: 'code' for VS Code, or '/usr/bin/nvim' for Neovim.</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id={`editorPath-${editor.id}`}
                      value={editor.path || ''}
                      onChange={(e) => handleEditorDetailChange(editor.id, 'path', e.target.value)}
                      placeholder="e.g., code or /usr/bin/code"
                    />
                  </div>
                </div>
              ))}
            </RadioGroup>

            {(settings.editors || []).length === 0 && (
              <p className="text-muted-foreground">No editors configured yet. Add one below.</p>
            )}

            <Separator />
            <div className="space-y-3 p-4 border border-dashed rounded-md">
              <h3 className="text-lg font-semibold">Add New Editor</h3>
              <div className="space-y-1">
                  <Label htmlFor="newEditorName">Editor Name</Label>
                  <Input 
                      id="newEditorName" 
                      placeholder="e.g., Sublime Text" 
                      value={newEditorName} 
                      onChange={(e) => setNewEditorName(e.target.value)} 
                  />
              </div>
              <div className="space-y-1">
                  <Label htmlFor="newEditorPath" className="flex items-center">
                    Path/Command (Optional)
                    <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The command or full path to the editor executable.<br/>Example: 'subl' for Sublime Text.</p>
                        </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Input 
                      id="newEditorPath" 
                      placeholder="e.g., subl" 
                      value={newEditorPath} 
                      onChange={(e) => setNewEditorPath(e.target.value)} 
                  />
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleAddEditor} variant="outline" className="mt-2">
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Editor
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Save this new editor configuration.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end pt-4">
          <Tooltip>
            <TooltipTrigger asChild>
                <Button size="lg" onClick={handleSaveChanges}>
                <Save className="mr-2 h-4 w-4" /> Save All Settings
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Persist all changes made on this page to local storage.</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}

