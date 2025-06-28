'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Clock, DollarSign, Calendar, MessageCircle, Check, X } from 'lucide-react';

const mockRequests = [
  {
    id: '1',
    client: {
      name: 'TechCorp Nigeria',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      rating: 4.8
    },
    title: 'Product Launch Video',
    description: 'We need a 60-second promotional video for our new mobile app launch. The video should be engaging, professional, and highlight key features.',
    budget: 45000,
    deadline: '2024-02-15',
    status: 'pending',
    createdAt: '2024-01-20',
    requirements: [
      '60-second duration',
      'Professional voiceover',
      'Mobile app focus',
      'Brand guidelines provided'
    ]
  },
  {
    id: '2',
    client: {
      name: 'Lagos Fashion Week',
      avatar: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      rating: 4.9
    },
    title: 'Event Highlight Reel',
    description: 'Create a dynamic highlight reel from our fashion week event. We have raw footage and need it edited into a compelling 3-minute video.',
    budget: 35000,
    deadline: '2024-02-10',
    status: 'pending',
    createdAt: '2024-01-18',
    requirements: [
      '3-minute highlight reel',
      'Raw footage provided',
      'Music licensing included',
      'Social media formats'
    ]
  },
  {
    id: '3',
    client: {
      name: 'Nollywood Productions',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      rating: 4.7
    },
    title: 'Movie Trailer',
    description: 'Edit a compelling 2-minute trailer for our upcoming Nollywood film. Experience with movie trailers preferred.',
    budget: 55000,
    deadline: '2024-02-20',
    status: 'accepted',
    createdAt: '2024-01-15',
    requirements: [
      '2-minute trailer',
      'Dramatic editing style',
      'Sound design',
      'Multiple format delivery'
    ]
  }
];

export default function RequestsPage() {
  const [requests, setRequests] = useState(mockRequests);

  const handleAccept = (requestId: string) => {
    setRequests(requests.map(req => 
      req.id === requestId ? { ...req, status: 'accepted' } : req
    ));
  };

  const handleDecline = (requestId: string) => {
    setRequests(requests.map(req => 
      req.id === requestId ? { ...req, status: 'declined' } : req
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400';
      case 'declined':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const acceptedRequests = requests.filter(req => req.status === 'accepted');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Incoming Requests</h1>
        <p className="text-muted-foreground mt-2">Manage collaboration requests from businesses</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                <p className="text-2xl font-bold">{pendingRequests.length}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">{acceptedRequests.length}</p>
              </div>
              <div className="h-12 w-12 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Potential Earnings</p>
                <p className="text-2xl font-bold">
                  ₦{pendingRequests.reduce((sum, req) => sum + req.budget, 0).toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <div className="space-y-6">
        {requests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={request.client.avatar} />
                    <AvatarFallback>
                      {request.client.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{request.title}</h3>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">{request.client.name}</p>
                    <p className="text-muted-foreground leading-relaxed">{request.description}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    ₦{request.budget.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Budget</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Requirements</h4>
                  <ul className="space-y-1">
                    {request.requirements.map((req, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center">
                        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mr-3" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Deadline: {new Date(request.deadline).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Received: {new Date(request.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                {request.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleDecline(request.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Decline
                    </Button>
                    <Button
                      onClick={() => handleAccept(request.id)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Accept Project
                    </Button>
                  </>
                )}
                
                {request.status === 'accepted' && (
                  <Button variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message Client
                  </Button>
                )}
                
                {request.status === 'declined' && (
                  <Badge variant="secondary">Request Declined</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {requests.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No requests yet</h3>
            <p className="text-muted-foreground">
              When businesses want to hire you, their requests will appear here
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}