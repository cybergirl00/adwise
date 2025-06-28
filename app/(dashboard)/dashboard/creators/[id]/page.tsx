'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { MOCK_CREATORS } from '@/lib/contants';
import { Star, MapPin, Calendar, MessageCircle, Award, ArrowLeft } from 'lucide-react';

export default function CreatorDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const creatorId = params.id as string;
  
  const creator = MOCK_CREATORS.find(c => c.id === creatorId);

  if (!creator) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Creator not found</h2>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const handleHire = () => {
    router.push('/dashboard/chat?creator=' + creator.id);
  };

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Creators
      </Button>

      {/* Creator Profile Header */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <Avatar className="h-32 w-32">
                <AvatarImage src={creator.avatar} />
                <AvatarFallback className="text-2xl">
                  {creator.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold">{creator.name}</h1>
                <p className="text-lg text-muted-foreground mt-2">{creator.bio}</p>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="font-semibold">{creator.rating}</span>
                  <span className="text-muted-foreground">({creator.reviews.length} reviews)</span>
                </div>
                
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Lagos, Nigeria</span>
                </div>
                
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Member since 2023</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {creator.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex-shrink-0 text-right space-y-4">
              <div>
                <span className="text-sm text-muted-foreground">Starting from</span>
                <p className="text-3xl font-bold text-primary">
                  ₦{creator.rate.toLocaleString()}
                </p>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={handleHire}
                  className="w-full"
                  size="lg"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Hire Creator
                </Button>
                <Button variant="outline" className="w-full">
                  Save to Favorites
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Portfolio */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {creator.portfolio.map((image, index) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={image}
                      alt={`Portfolio ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {creator.reviews.map((review) => (
                <div key={review.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'text-yellow-500 fill-current'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                  
                  <p className="leading-relaxed">{review.comment}</p>
                  
                  <p className="text-sm font-medium text-muted-foreground">— {review.author}</p>
                  
                  {review !== creator.reviews[creator.reviews.length - 1] && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}