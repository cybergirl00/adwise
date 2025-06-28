'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MOCK_APPS } from '@/lib/contants';
import { App } from '@/lib/types';
import { Plus, Code, Copy, Eye, DollarSign, TrendingUp, Calendar } from 'lucide-react';

const adCategories = [
  'Food & Drink',
  'Health & Fitness',
  'Shopping',
  'Entertainment',
  'Travel',
  'Education',
  'Finance',
  'Business',
  'Social',
  'Games'
];

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>(MOCK_APPS);
  const [showForm, setShowForm] = useState(false);
  const [appName, setAppName] = useState('');
  const [appCategory, setAppCategory] = useState('');

  const generateApiKey = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'ak_live_';
    for (let i = 0; i < 20; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleAddApp = () => {
    if (appName && appCategory) {
      const newApp: App = {
        id: Date.now().toString(),
        name: appName,
        category: appCategory,
        apiKey: generateApiKey(),
        earnings: 0,
        clicks: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setApps([...apps, newApp]);
      setAppName('');
      setAppCategory('');
      setShowForm(false);
    }
  };

  const copyApiKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
    // You could add a toast notification here
  };

  const totalEarnings = apps.reduce((sum, app) => sum + app.earnings, 0);
  const totalClicks = apps.reduce((sum, app) => sum + app.clicks, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Apps</h1>
          <p className="text-muted-foreground mt-2">Manage your applications and API keys</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New App
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Apps</p>
                <p className="text-2xl font-bold">{apps.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold text-primary">₦{totalEarnings.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                <p className="text-2xl font-bold">{totalClicks.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New App Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Application</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appName">App Name</Label>
                <Input
                  id="appName"
                  placeholder="Enter app name"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={appCategory} onValueChange={setAppCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {adCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddApp}
                disabled={!appName || !appCategory}
              >
                Generate API Key
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Apps List */}
      <div className="space-y-6">
        {apps.map((app) => (
          <Card key={app.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{app.name}</h3>
                    <Badge variant="secondary">{app.category}</Badge>
                  </div>
                  
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>Created on {new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <p className="text-sm text-muted-foreground">Earnings</p>
                    <p className="text-lg font-bold text-primary">₦{app.earnings.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Clicks</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{app.clicks.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">API Key</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={app.apiKey}
                      readOnly
                      className="font-mono text-sm bg-muted"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyApiKey(app.apiKey)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>Performance trending up</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    View Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {apps.length === 0 && !showForm && (
        <Card>
          <CardContent className="text-center py-12">
            <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No apps yet</h3>
            <p className="text-muted-foreground mb-4">Get started by adding your first application</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First App
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}