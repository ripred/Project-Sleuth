
"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, KeyRound, FolderOpen, Save, Trash2, PlusCircle, Edit3 } from 'lucide-react';
import type { AppSettings, ApiKeySetting, EditorSetting } from '@/lib/types';
import { mockSettings } from '@/lib/mock-data'; // Using mock data for now

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(mockSettings);
  const [newApiKeyName, setNewApiKeyName] = useState('');
  const [newApiKey, setNewApiKey] = useState('');
  const [newScanPath, setNewScanPath] = useState('');
  const [editorName, setEditorName] = useState(mockSettings.defaultEditor?.name || '');
  const [editorPath, setEditorPath] = useState(mockSettings.defaultEditor?.path || '');


  // Effect to load settings from localStorage or use mock if not available
  useEffect(() => {
    const storedSettings = localStorage.getItem('appSettings');
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);
      setSettings(parsedSettings);
      setEditorName(parsedSettings.defaultEditor?.name || '');
      setEditorPath(parsedSettings.defaultEditor?.path || '');
    } else {
      setSettings(mockSettings); // Initialize with mock if nothing in localStorage
      setEditorName(mockSettings.defaultEditor?.name || '');
      setEditorPath(mockSettings.defaultEditor?.path || '');
    }
  }, []);
  
  // Effect to save settings to localStorage whenever they change
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
      id: newApiKeyName.trim().toLowerCase().replace(/\s+/g, '-'), // Simple ID generation
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
  
  const handleDefaultEditorChange = () => {
    const newEditorSetting: EditorSetting = {
        name: editorName,
        path: editorPath,
    };
    setSettings(prev => ({
        ...prev,
        defaultEditor: newEditorSetting
    }));
  };


  const handleSaveChanges = () => {
    // Update default editor settings before saving all
    const updatedSettings = {
        ...settings,
        defaultEditor: {
            name: editorName,
            path: editorPath
        }
    };
    setSettings(updatedSettings); // This will trigger the useEffect to save to localStorage
    toast({ title: "Settings Saved", description: "Your application settings have been updated." });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center">
            <SettingsIcon className="mr-3 h-8 w-8 text-primary" />
            Application Settings
          </CardTitle>
          <CardDescription>Configure API keys, default scan paths, editor, and other application-wide settings.</CardDescription>
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
                <Button variant="ghost" size="icon" onClick={() => handleDeleteApiKey(apiKey.id)} aria-label={`Delete ${apiKey.name}`}>
                    <Trash2 className="h-4 w-4 text-destructive"/>
                </Button>
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
            <Button onClick={handleAddApiKey} variant="outline" className="mt-2">
                <PlusCircle className="mr-2 h-4 w-4" /> Add API Key
            </Button>
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
              <Button variant="ghost" size="icon" onClick={() => handleDeleteScanPath(index)} aria-label={`Delete path ${path}`}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
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
            <Button onClick={handleAddScanPath} variant="outline" className="mt-2">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Scan Path
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card id="editor-config"> {/* Added ID for anchoring */}
        <CardHeader>
          <CardTitle className="flex items-center"><Edit3 className="mr-2 h-5 w-5" /> Default Editor Configuration</CardTitle>
          <CardDescription>Set your preferred code editor for opening projects.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editorName">Editor Name</Label>
              <Input 
                  id="editorName" 
                  placeholder="e.g., Visual Studio Code" 
                  value={editorName} 
                  onChange={(e) => {
                    setEditorName(e.target.value);
                    handleDefaultEditorChange();
                  }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editorPath">Editor Path/Command (Optional)</Label>
              <Input 
                  id="editorPath" 
                  placeholder="e.g., code or /usr/bin/code" 
                  value={editorPath} 
                  onChange={(e) => {
                    setEditorPath(e.target.value);
                    handleDefaultEditorChange();
                  }}
              />
              <p className="text-xs text-muted-foreground">
                The command used to launch the editor (e.g., 'code' for VS Code, 'idea' for IntelliJ).
              </p>
            </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end pt-4">
        <Button size="lg" onClick={handleSaveChanges}>
          <Save className="mr-2 h-4 w-4" /> Save All Settings
        </Button>
      </div>
    </div>
  );
}
