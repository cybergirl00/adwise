'use client';

import { z } from "zod"

import { useEffect, useState } from 'react';
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
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { getMedia } from "@/actions/ad.actions";
import { useUser } from "@clerk/nextjs";
import { createCampaign } from "@/actions/campaign.actions";

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
  'Tech Enthusiasts',
  'Others'
];
const formSchema = z.object({
  username: z.string().min(2).max(50),
})
export default function UploadAdsPage() {
  const [adTitle, setAdTitle] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [adFormat, setAdFormat] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [budget, setBudget] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
   const [medias, setMedias] = useState<MediaProps[]>([]);
   const [mediaId, setMediaId] = useState('')

   const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const create = await createCampaign({
        title: adTitle,
        description: adDescription,
        format: adFormat,
        clerkId: user?.id ?? "",
        mediaId: mediaId,
        budget: Number(budget),
        audience: targetAudience
      });

      if(create?.status === 201) {
         setIsUploading(false);
           setUploadProgress(0);
        // Reset form
    setAdTitle('');
    setAdDescription('');
    setAdFormat('');
    setTargetAudience('');
    setBudget('');
    setUseAI(false);
      }
    } catch (error) {
      console.log(error);
       setIsUploading(false);
           setUploadProgress(0);
    } finally {
       setIsUploading(false);
           setUploadProgress(0);
    }
    
  };

   useEffect(() => {
  
      const handlegetMedia = async () => {
        try {
          const data = await getMedia({
            ownerId: user?.id ?? ""
          });

          // console.log(data?.data.data)
  
          setMedias(data?.data.data)
  
  
        } catch (error) {
          console.log(error)
        }
      }
  
      handlegetMedia();
    }, [])

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
                      <SelectTrigger className="w-full">
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
                      <SelectTrigger className="w-full">
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

                 <div className="space-y-2">
                    <Label>Media</Label>
                    <Select value={mediaId} onValueChange={setMediaId} required>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select campaign media" />
                      </SelectTrigger>
                      <SelectContent>
                        {medias && medias.map((media) => (
                          <SelectItem key={media._id} value={media.title}>
                            <div>
                              <div className="font-medium">{media.title}</div>
                              <div className="text-xs text-muted-foreground">{media.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

               

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