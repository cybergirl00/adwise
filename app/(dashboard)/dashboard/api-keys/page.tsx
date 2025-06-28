'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Key, Copy, Eye, EyeOff, Plus, Trash2, AlertTriangle } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  status: 'active' | 'inactive';
  permissions: string[];
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production Key',
      key: 'ak_live_abc123def456ghi789jkl012',
      created: '2024-01-15',
      lastUsed: '2 hours ago',
      status: 'active',
      permissions: ['read:ads', 'write:analytics']
    },
    {
      id: '2',
      name: 'Development Key',
      key: 'ak_test_xyz789uvw456rst123mno890',
      created: '2024-01-10',
      lastUsed: '1 day ago',
      status: 'active',
      permissions: ['read:ads']
    }
  ]);

  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  const [newKeyName, setNewKeyName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const generateApiKey = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'ak_live_';
    for (let i = 0; i < 20; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const createNewKey = () => {
    if (newKeyName.trim()) {
      const newKey: ApiKey = {
        id: Date.now().toString(),
        name: newKeyName,
        key: generateApiKey(),
        created: new Date().toISOString().split('T')[0],
        lastUsed: 'Never',
        status: 'active',
        permissions: ['read:ads']
      };
      
      setApiKeys([...apiKeys, newKey]);
      setNewKeyName('');
      setShowCreateForm(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const deleteKey = (keyId: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== keyId));
  };

  const maskKey = (key: string) => {
    return key.substring(0, 12) + '....' + key.substring(key.length - 4);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Keys</h1>
          <p className="text-muted-foreground mt-2">Manage your application programming interface keys</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Key
        </Button>
      </div>

      {/* Security Notice */}
      <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Security Best Practices</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Keep your API keys secure. Never share them publicly or commit them to version control.
                Use different keys for development and production environments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create New Key Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New API Key</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keyName">Key Name</Label>
              <Input
                id="keyName"
                placeholder="e.g., Production App, Testing Environment"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button
                onClick={createNewKey}
                disabled={!newKeyName.trim()}
              >
                Generate Key
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <Card key={apiKey.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{apiKey.name}</h3>
                    <Badge
                      variant={apiKey.status === 'active' ? 'default' : 'secondary'}
                      className={
                        apiKey.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                          : 'bg-muted text-muted-foreground'
                      }
                    >
                      {apiKey.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Created: {new Date(apiKey.created).toLocaleDateString()}</span>
                    <span>Last used: {apiKey.lastUsed}</span>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteKey(apiKey.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">API Key</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                      readOnly
                      className="font-mono text-sm bg-muted"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                    >
                      {showKeys[apiKey.id] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(apiKey.key)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Permissions</Label>
                  <div className="flex gap-2 mt-1">
                    {apiKey.permissions.map((permission, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {apiKeys.length === 0 && !showCreateForm && (
        <Card>
          <CardContent className="text-center py-12">
            <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No API keys yet</h3>
            <p className="text-muted-foreground mb-4">Create your first API key to start integrating with Adwise</p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First API Key
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">1. Authentication</h4>
            <div className="bg-muted rounded-lg p-4 text-sm">
              <code className="text-primary">
                curl -H "Authorization: Bearer YOUR_API_KEY" \<br />
                &nbsp;&nbsp;&nbsp;&nbsp;https://api.adwise.ng/v1/ads
              </code>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">2. Making Requests</h4>
            <p className="text-sm text-muted-foreground">
              Include your API key in the Authorization header for all requests to the Adwise API.
              Full documentation is available at{' '}
              <a href="#" className="text-primary hover:underline">
                docs.adwise.ng
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}