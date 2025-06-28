'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, FileVideo, Image as ImageIcon, Sparkles, Calendar, Target } from 'lucide-react';

const adFormats = [
  { id: 'banner', name: 'Banner Ad', description: '320x50 display banner' },
  { id: 'square', name: 'Square Ad', description: '250x250 social media format' },
  { id: 'video', name: 'Video Ad', description: '16:9 video format' },
  { id: 'story', name: 'Story Ad', description: '9:16 vertical format' }
];

const targetAudiences = [
  'Young Adults (18-25)',
  'Adults (26-35)',
  'Middle-aged (36-50)',
  'Seniors (50+)',
  'Students',
  'Professionals',
  'Parents',
  'Tech Enthusiasts'
];

export default function UploadAdsPage() {
  const [adTitle, setAdTitle] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [adFormat, setAdFormat] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [budget, setBudget] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setIsUploading(false);
    setUploadProgress(0);
    
    // Reset form
    setAdTitle('');
    setAdDescription('');
    setAdFormat('');
    setTargetAudience('');
    setBudget('');
    setUseAI(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Upload New Ad Campaign</h1>
        <p className="text-muted-foreground mt-2">Create engaging advertisements to reach your target audience</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Campaign Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter campaign title"
                    value={adTitle}
                    onChange={(e) => setAdTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your campaign objectives and key message"
                    value={adDescription}
                    onChange={(e) => setAdDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ad Format</Label>
                    <Select value={adFormat} onValueChange={setAdFormat} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        {adFormats.map((format) => (
                          <SelectItem key={format.id} value={format.id}>
                            <div>
                              <div className="font-medium">{format.name}</div>
                              <div className="text-xs text-muted-foreground">{format.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Target Audience</Label>
                    <Select value={targetAudience} onValueChange={setTargetAudience} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        {targetAudiences.map((audience) => (
                          <SelectItem key={audience} value={audience}>
                            {audience}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Campaign Budget (₦)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="50000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    required
                  />
                </div>

                {/* AI Video Option */}
                <div className="border rounded-lg p-4 bg-gradient-to-r from-primary/5 to-primary/10">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="ai-video"
                      checked={useAI}
                      onCheckedChange={setUseAI}
                    />
                    <div className="flex-1">
                      <label htmlFor="ai-video" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Use AI to create my video (+₦2,000)
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Let our AI create a professional video advertisement based on your content
                      </p>
                    </div>
                  </div>
                  
                  {useAI && (
                    <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <Sparkles className="h-4 w-4" />
                        <span className="font-medium">AI Video Features:</span>
                      </div>
                      <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                        <li>• Professional voiceover in Nigerian English</li>
                        <li>• Custom animations and transitions</li>
                        <li>• Brand-appropriate music and sound effects</li>
                        <li>• Optimized for social media platforms</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label>Upload Creative Assets</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors border-muted-foreground/30">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drop your files here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      Supports: JPG, PNG, MP4, MOV (Max 50MB)
                    </p>
                    <Button variant="outline" className="mt-3">
                      Choose Files
                    </Button>
                  </div>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Uploading campaign...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" type="button">
                    Save as Draft
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUploading}
                  >
                    {isUploading ? 'Creating Campaign...' : 'Launch Campaign'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Campaign Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Campaign Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Estimated Reach</p>
                <p className="text-2xl font-bold text-primary">25K - 50K</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">7 days</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Cost per Click</p>
                <p className="font-medium">₦15 - ₦25</p>
              </div>

              {useAI && (
                <div className="border-t pt-4">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Enhanced
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-3">
                <ImageIcon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Use high-quality visuals</p>
                  <p className="text-muted-foreground">Images should be at least 1080px wide</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <FileVideo className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Keep videos under 30 seconds</p>
                  <p className="text-muted-foreground">Short content performs better on mobile</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Best posting times</p>
                  <p className="text-muted-foreground">Weekdays 9-11 AM and 7-9 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}