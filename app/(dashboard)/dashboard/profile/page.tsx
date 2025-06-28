'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth-context';
import { Camera, Plus, X, Save, Star } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

export default function ProfilePage() {
  const { user } = useUser();
  const fullName = user?.firstName + ' ' + user?.lastName
  const [name, setName] = useState(fullName || '');
  const [bio, setBio] = useState('Passionate content creator with 5+ years of experience in video production and storytelling.');
  const [rate, setRate] = useState('25000');
  const [specialties, setSpecialties] = useState(['Video Production', 'Animation', 'Brand Stories']);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [portfolio, setPortfolio] = useState([
    'https://images.pexels.com/photos/7234292/pexels-photo-7234292.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    'https://images.pexels.com/photos/3585089/pexels-photo-3585089.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  ]);

  const addSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter(s => s !== specialty));
  };

  const handleSave = () => {
    // Save profile changes
    console.log('Saving profile changes...');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your profile and showcase your work</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback className="text-xl">
                    {fullName?.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" className="mb-2">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Upload a professional photo to build trust with clients
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Hourly Rate (₦)</Label>
                  <Input
                    id="rate"
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  placeholder="Tell clients about your experience and what makes you unique..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Specialties */}
          <Card>
            <CardHeader>
              <CardTitle>Specialties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {specialty}
                    <button
                      onClick={() => removeSpecialty(specialty)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add a specialty..."
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSpecialty()}
                />
                <Button onClick={addSpecialty} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {portfolio.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={image}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Portfolio Item
              </Button>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Profile Preview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Profile Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback className="text-xl">
                    {name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <h3 className="text-xl font-semibold">{name}</h3>
                
                <div className="flex items-center justify-center gap-1 text-yellow-500 mt-2">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">4.9</span>
                  <span className="text-sm text-muted-foreground">(12 reviews)</span>
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm leading-relaxed">{bio}</p>
              
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
              
              <div className="text-center pt-4 border-t">
                <span className="text-sm text-muted-foreground">Starting from</span>
                <p className="text-lg font-bold text-primary">
                  ₦{parseInt(rate).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Profile Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Profile Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Profile Views</span>
                <span className="font-medium">234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Projects Completed</span>
                <span className="font-medium">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Response Rate</span>
                <span className="font-medium">95%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">On-time Delivery</span>
                <span className="font-medium">100%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}