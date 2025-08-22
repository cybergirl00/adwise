'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Clock, DollarSign, Calendar, MessageCircle, Check, X, Loader2 } from 'lucide-react';
import { useDashboard } from '@/context/dashboard-context';
import { toast } from 'sonner';
import { acceptRequest, declineRequest } from '@/actions/campaign.actions';

interface UserRequest {
  _id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  status: number;
  createdAt: string;
  creatorId: string;
  ownerId: string;
  requirements: string[];
}

interface Client {
  clerkId: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  // ... other client properties
}
interface UserRequestsData {
  userRequests: UserRequest[];
  clients: Record<string, Client>;
}

export default function RequestsPage() {
  const { user } = useDashboard();
   const [requests, setRequests] = useState<Array<{ request: UserRequest; client: Client }>>([]);
   const [accepting, setAccepting] = useState(false);
   const [declining, setDeclining] = useState(false)

useEffect(() => {
    if (user?.requests) {
      // Transform the API response into the desired format

      const userRequestsData = user.requests as unknown as UserRequestsData;

      const formattedRequests = userRequestsData.userRequests.map(request => {
        const client = userRequestsData.clients[request.ownerId] || {
          firstName: 'Unknown',
          lastName: 'Client',
          imageUrl: '',
          clerkId: ''
        };

      
        return { request, client };
      });

      console.log(formattedRequests)
      setRequests(formattedRequests);
    }
  }, [user?.requests]);

const handleAccept = async (requestId: string) => {
setAccepting(true)
  try {
    const accpet = await acceptRequest({
      requestId: requestId,
      clerkId: user?.id ?? ""
    });

    if(accpet?.status === 200) {
      toast.success('Request accepted');
      setAccepting(false)
       setRequests(prev => prev.map(item => 
      item.request._id === requestId 
        ? { 
            ...item, 
            request: { ...item.request, status: 1 } 
          } 
        : item
    ));
    }
  } catch (error: any) {
    setAccepting(false)
    toast.error(`${error.message}`)
  } finally {
    setAccepting(false)
  }
   
  };

  const handleDecline = async (requestId: string) => {
    setDeclining(true)
    try {
      const decline =  await declineRequest({
      requestId: requestId,
      clerkId: user?.id ?? ""
    });

    if(decline?.status === 200) {
      toast.success('Request accepted');
      setDeclining(false)
       setRequests(prev => prev.map(item => 
      item.request._id === requestId 
        ? { 
            ...item, 
            request: { ...item.request, status: 2 } 
          } 
        : item
    ));
    }
    } catch (error: any) {
      setDeclining(false)
    toast.error(`${error.message}`)
    }finally {
      setDeclining(false)
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return 'bg-yellow-100 text-yellow-800';
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-red-100 text-red-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Accepted';
      case 2: return 'Declined';
      default: return 'Unknown';
    }
  };
  const pendingRequests = requests.filter(item => item.request.status === 0);
  const acceptedRequests = requests.filter(item => item.request.status === 1);

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
              <div className="h-12 w-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
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
              <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
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
                  ₦{pendingRequests.reduce((sum, req) => sum + req.request.budget, 0).toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <div className="space-y-6">
        {requests.map((request) => (
          <Card key={request.request._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={request.client.imageUrl} />
                    <AvatarFallback>
                      {request.client.firstName[0]}{request.client.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{request.request.title}</h3>
                      <Badge className={getStatusColor(request.request.status)}>
                        {getStatusText(request.request.status)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {request.client.firstName} {request.client.lastName}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {request.request.description}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    ₦{request.request.budget.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Budget</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Requirements</h4>
                  <ul className="space-y-1">
                    {request.request.requirements.map((req, index) => (
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
                    <span>Deadline: {new Date(request.request.deadline).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Received: {new Date(request.request.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                {request.request.status === 0 && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleDecline(request.request._id)}
                      className="text-destructive flex items-center gap-3 hover:bg-destructive/10"
                      disabled={declining}
                    >
                     {declining && <Loader2 className='animate-spin' /> }
                      Decline
                    </Button>
                    <Button
                    disabled={accepting}
                      onClick={() => handleAccept(request.request._id)}
                      className='flex items-center gap-3'
                    >
                      
                      {accepting ? <Loader2 className='animate-spin' /> :  <Check className="h-4 w-4 mr-2" />}
                      Accept Project
                    </Button>
                  </>
                )}
                
                {request.request.status === 1 && (
                  <Button variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message Client
                  </Button>
                )}
                
                {request.request.status === 2 && (
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