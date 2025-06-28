'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/auth-context';
import { Send, Search, MoreVertical, Phone, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockConversations = [
  {
    id: '1',
    name: 'Adebayo Williams',
    lastMessage: 'Sure, I can help with that video project. When do you need it completed?',
    timestamp: '2 min ago',
    unread: 2,
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'online'
  },
  {
    id: '2',
    name: 'TechCorp Nigeria',
    lastMessage: 'Great work on the last campaign! We have another project.',
    timestamp: '1 hour ago',
    unread: 0,
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'offline'
  },
  {
    id: '3',
    name: 'Kemi Oladele',
    lastMessage: 'The designs are ready for review. Please check your email.',
    timestamp: '3 hours ago',
    unread: 1,
    avatar: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'online'
  }
];

const mockMessages = [
  {
    id: '1',
    senderId: '2',
    content: 'Hi! I saw your portfolio and I\'m interested in hiring you for a video project.',
    timestamp: '10:30 AM',
    isOwn: false
  },
  {
    id: '2',
    senderId: '1',
    content: 'Thanks for reaching out! I\'d love to help. What type of video are you looking for?',
    timestamp: '10:32 AM',
    isOwn: true
  },
  {
    id: '3',
    senderId: '2',
    content: 'We need a 60-second promotional video for our new product launch. It should be engaging and professional.',
    timestamp: '10:35 AM',
    isOwn: false
  },
  {
    id: '4',
    senderId: '1',
    content: 'That sounds perfect! I specialize in promotional content. What\'s your timeline and budget?',
    timestamp: '10:37 AM',
    isOwn: true
  },
  {
    id: '5',
    senderId: '2',
    content: 'We need it completed within 2 weeks. Budget is flexible for quality work. Can we schedule a call?',
    timestamp: '10:40 AM',
    isOwn: false
  },
  {
    id: '6',
    senderId: '1',
    content: 'Sure, I can help with that video project. When do you need it completed?',
    timestamp: '10:42 AM',
    isOwn: true
  }
];

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [message, setMessage] = useState('');
  const [messages] = useState(mockMessages);
  const { user } = useAuth();

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add message logic here
      setMessage('');
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Conversations List */}
      <Card className="w-80 flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle>Messages</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full">
            <div className="space-y-1 p-4">
              {mockConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={cn(
                    "p-4 rounded-lg cursor-pointer transition-colors",
                    selectedConversation.id === conversation.id
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-muted"
                  )}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback>
                          {conversation.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.status === 'online' && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-foreground truncate">
                          {conversation.name}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {conversation.timestamp}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {conversation.lastMessage}
                      </p>
                      
                      {conversation.unread > 0 && (
                        <Badge className="mt-2 bg-primary text-xs">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="flex-1 flex flex-col">
        {/* Chat Header */}
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedConversation.avatar} />
                <AvatarFallback>
                  {selectedConversation.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-foreground">{selectedConversation.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{selectedConversation.status}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full p-6">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={cn(
                      "max-w-[70%] rounded-lg px-4 py-2",
                      msg.isOwn
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={cn(
                      "text-xs mt-1",
                      msg.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>

        {/* Message Input */}
        <div className="border-t border-border p-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}