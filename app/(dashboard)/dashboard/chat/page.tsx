'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Send, Search, MoreVertical, Phone, Video, X, Files } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboard } from '@/context/dashboard-context';
import { useSocket } from '@/context/socket-context';
import { useRouter } from 'next/navigation';
import { createSubmit, getCreatorsRequestbetweenOwner } from '@/actions/campaign.actions';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UploadDropzone } from '@/components/upload-dropzone';
import { toast } from 'sonner';
import Image from 'next/image';


interface RequestProps {
  deadline: Date,
  numberofFiles: number;
  _id: string;
  creatorId: string;
  submit: number
}

interface MediaFilesProps {
  title: string;
  url: string;
  type: "image" | "video"
}
export default function ChatPage() {
  const { user } = useDashboard();
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [requestAvailabe, setRequestAvailabe] = useState(false)
  const [Request, setRequest] = useState<RequestProps>();
  const [files, setfiles] = useState<MediaFilesProps[]>([])


  const { socket, isConnected } = useSocket();
  
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const mockConversations = user?.partners || [];
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(selectedConversation?.messages || []);

  // Join user's room and set up listeners
  useEffect(() => {
    if (socket && user?.clerkId && isConnected) {
      socket.emit('join', user.clerkId);
    }
  }, [socket, user?.clerkId, isConnected]);

  // Handle incoming messages and typing indicators
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (message: any) => {
      if (message.senderId === selectedConversation?.user.clerkId || 
          message.receiverId === user?.clerkId) {
        setMessages(prev => [...prev, message]);
      }
    };

    const handleTyping = ({ senderId, isTyping }: { senderId: string; isTyping: boolean }) => {
      if (senderId === selectedConversation?.user.clerkId) {
        setTypingUsers(prev => 
          isTyping 
            ? [...prev.filter(id => id !== senderId), senderId]
            : prev.filter(id => id !== senderId)
        );
      }
    };

    socket.on('messageReceived', handleMessage);
    socket.on('typing', handleTyping);

    return () => {
      socket.off('messageReceived', handleMessage);
      socket.off('typing', handleTyping);
    };
  }, [socket, selectedConversation, user?.clerkId]);

  // Update messages when conversation changes
  useEffect(() => {
    setMessages(selectedConversation?.messages || []);
  }, [selectedConversation]);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Improved scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = () => {
    if (message.trim() && selectedConversation && user?.clerkId) {
      const newMessage = {
        content: message,
        senderId: user.clerkId,
        recieverId: selectedConversation.user.clerkId,
        createdAt: new Date(),
        isFromMe: true
      };

      // Optimistic update
      setMessages(prev => [...prev, newMessage]);
      
      // Emit to server
      socket?.emit('newMessage', newMessage);
      
      setMessage('');
      setIsTyping(false);

       setTimeout(() => {
      const scrollArea = document.querySelector('.scroll-area');
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    }, 100);
    }
  };

  const handleTyping = (isTyping: boolean) => {
    if (selectedConversation && user?.clerkId) {
      setIsTyping(isTyping);
      socket?.emit('typing', {
        senderId: user.clerkId,
        receiverId: selectedConversation.user.clerkId,
        isTyping
      });
    }
  };

const handleSubmit = async () => {
  try {
    
    const fileUrls = files.map(file => file.url);
    console.log(fileUrls)
    const response = await createSubmit({
      files: fileUrls, 
      title: "Media submission",
      requestId: Request?._id ?? "",
      creatorId: Request?.creatorId ?? "",
    });

    if (response?.status === 200) {
      toast.success("Files submitted successfully!");
      setOpenDialog(false);
      setfiles([]);
    } else {
      toast.error("Failed to submit files");
    }
  } catch (error) {
    console.error("Submission error:", error);
    toast.error("An error occurred while submitting files");
  }
}
  useEffect(() => {
   const getRequest = async () => {
    try {
      const response = await getCreatorsRequestbetweenOwner(user?.clerkId ?? "", selectedConversation.user.clerkId);

      if(response?.status === 200 ) {
        setRequestAvailabe(true);

        console.log(response.data.data.userRequests)
        setRequest(response.data.data.userRequests)
      }
    } catch (error) {
      console.log(error)
    }
   }

   getRequest();
  }, [])
  


  if (!mockConversations.length) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <Card className="p-6 text-center">
          <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
          <p className="text-muted-foreground">
            When you message someone or receive messages, they'll appear here
          </p>
        </Card>
      </div>
    );
  }

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
                  key={conversation.user._id}
                  className={cn(
                    "p-4 rounded-lg cursor-pointer transition-colors",
                    selectedConversation?.user._id === conversation.user._id
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-muted"
                  )}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conversation.user.imageUrl} />
                        <AvatarFallback>
                          {conversation.user.firstName?.[0]}{conversation.user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      {typingUsers.includes(conversation.user.clerkId) && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-foreground truncate">
                          {conversation.user.firstName} {conversation.user.lastName}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {conversation.latestMessage?.createdAt && 
                            new Date(conversation.latestMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground truncate line-clamp-1 mt-1">
                        {typingUsers.includes(conversation.user.clerkId) 
                          ? 'Typing...'
                          : conversation.latestMessage?.content}
                      </p>
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
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConversation.user.imageUrl} />
                      <AvatarFallback>
                        {selectedConversation.user.firstName?.[0]}{selectedConversation.user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    {typingUsers.includes(selectedConversation.user.clerkId) && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      {selectedConversation.user.firstName} {selectedConversation.user.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {typingUsers.includes(selectedConversation.user.clerkId) 
                        ? 'Typing...' 
                        : 'Online'}
                    </p>
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
              <ScrollArea ref={scrollAreaRef} className="h-[400px] p-6">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg._id || msg._id}
                      className={`flex ${msg.isFromMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] rounded-lg px-4 flex flex-col gap-3 py-2",
                          msg.isFromMe
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        )}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className={cn(
                          "text-xs mt-1",
                          msg.isFromMe ? "text-primary-foreground/70" : "text-muted-foreground"
                        )}>
                          {msg.createdAt && new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>

                        {msg.type === 2 && (
                          <Button className='w-full' variant={'outline'}>
                            View details
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>

            {/* Message Input */}
            <div className="border-t border-border p-4">
              <div className="flex space-x-2">
                {(user?.userType === 3  && requestAvailabe && Request?.submit === 0  ) && (
                   <Button
                  onClick={() => {setOpenDialog(true)}}
                  // disabled={!message.trim()}
                  className=" hover:bg-primary/90"
                  variant={'ghost'}
                  size={'sm'}
                >
                 Submit
                </Button>
                )}

                {Request?.submit === 1 && (
                  <Button variant={'outline'} disabled>
                    awaiting approval
                  </Button>
                )}
               
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    handleTyping(e.target.value.length > 0);
                  }}
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-6">
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose a chat from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </Card>

<Dialog onOpenChange={setOpenDialog} open={openDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Submit based on users Requirements</DialogTitle>
      <DialogDescription>
        You are expected to submit {Request?.numberofFiles} media files, due: {Request?.deadline}
      </DialogDescription>
    </DialogHeader>

    <div className="">
     <UploadDropzone
  onClientUploadComplete={(res: any) => {
    if (res && res.length > 0) {
      setfiles(prev => [
        ...prev, 
        {
          title: res[0].name,
          url: res[0].url,
          type: res[0].type.includes('image') ? 'image' : 'video'
        }
      ]);
      toast.success("Upload completed!");
    }
  }}
  onUploadError={(error: any) => {
    toast.error("Upload failed");
    console.error("Upload error:", error);
  }}
/>

    </div>


    <div className="space-y-3">
        {files.length > 0 ? (
          files.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-4 flex-1">
                {item.type === 'image' ? (
                  <div className="relative h-16 w-16 flex-shrink-0">
                    <Image
                      src={item.url}
                      alt={item.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                ) : (
                  <div className="relative h-16 w-16 flex-shrink-0 bg-black rounded-md overflow-hidden">
                    <video className="h-full w-full object-cover">
                      <source src={item.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-medium truncate">{item.title}</p>
                  <span className="text-muted-foreground text-sm capitalize">{item.type}</span>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setfiles(prev => prev.filter((_, i) => i !== index));
                  toast.info("File removed");
                }}
                className="text-red-500 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No files uploaded yet
          </div>
        )}
      </div>

     {files.length > 0 && (
        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-muted-foreground">
            {files.length} of {Request?.numberofFiles} files uploaded
          </div>
          <Button
            disabled={files.length !== Request?.numberofFiles}
            onClick={handleSubmit}
          >
            Submit files
          </Button>
        </div>
      )}
  </DialogContent>
</Dialog>
    </div>
  );
}