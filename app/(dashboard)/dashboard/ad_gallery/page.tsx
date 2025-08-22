'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { PlusIcon, VideoIcon, ImageIcon, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useUser } from '@clerk/nextjs';
import { createMedia, getMedia } from '@/actions/ad.actions';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UploadDropzone } from '@/components/upload-dropzone';
import { approveSubmit, declineSubmit } from '@/actions/campaign.actions';
// import { UploadDropzone } from '@/utils/uploadthing';

interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

interface MediaProps {
  _id: string;
  clerkId: string;
  title: string;
  description: string;
  mediaUrl: MediaItem[];
  ownerId: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  requestId: string
}

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(50, "Title cannot exceed 50 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  fileUrl: z.string().url(),
  ownerId: z.string().optional()
})

type FormValues = z.infer<typeof formSchema>


const Gallery = () => {
  const { user } = useUser();
  const [medias, setMedias] = useState<MediaProps[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openMediaModal, setOpenMediaModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openNote, setOpenNote] = useState(false);
  const [note, setNote] = useState('');
  const [declinig, setDeclinig] = useState(false);
  const [approving, setApproving] = useState(false)

   const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      fileUrl: ""
    },
  })


  useEffect(() => {
    const handleGetMedia = async () => {
      try {
        const data = await getMedia({
          ownerId: user?.id ?? ""
        });
        // Transform mediaUrl strings to MediaItem objects
        const transformedData = data?.data.data.map((media: any) => ({
          ...media,
          mediaUrl: media.mediaUrl.map((url: any) => ({
            url,
            type: url.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'image'
          }))
        })) || [];
        setMedias(transformedData);

        console.log(transformedData)
      } catch (error) {
        console.error("Error fetching media:", error);
        toast.error("Failed to load media");
      }
    };

    handleGetMedia();
  }, [user?.id]);

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    try {
   const response =  await createMedia({
      title: values.title,
      description: values.description,
      clerkId: user?.id ?? "",
      ownerId: values?.ownerId ? values?.ownerId : user?.id,
      mediaUrl: values.fileUrl
    });

    if(response.status === 201) {
      setOpenDialog(false)
      setIsLoading(false);
      toast.success(`${response.message}`);
    } else {
      toast.error(`Error Occured ${response.message}`);
      setIsLoading(false)
    }
    } catch (error: any) {
      setIsLoading(false);
       setOpenDialog(false)
       toast.error(`Error ${error.message}`)
    }finally {
      setIsLoading(false)
    }
  }

  const handleDecline = async ({ mediaId, requestId}: {mediaId: string; requestId: string}) => {
   
    setDeclinig(true)
    try {
      const response = await declineSubmit({
      mediaId, requestId, note: note
    });

    if(response?.status === 200) {
      setDeclinig(false)
      toast.success('Submission has been declined')
      setOpenDialog(false)
    }
    } catch (error) {
      setDeclinig(false)
      console.log(error)
    } finally {
      setDeclinig(false)
    }
  }

   const handleApprove = async ({ mediaId, requestId}: {mediaId: string; requestId: string}) => {
   
    setApproving(true)
    try {
      const response = await approveSubmit({
      mediaId, requestId
    });

    if(response?.status === 200) {
      setApproving(false)
      toast.success('Submission has been approved ')
      setOpenDialog(false)
    }
    } catch (error) {
      setApproving(false)
      console.log(error)
    } finally {
      setApproving(false)
    }
  }


  const renderMediaItem = (item: MediaItem) => {
    if (item.type === 'video') {
      return (
        <video 
          className="w-full h-full object-cover rounded-md"
          controls
          muted
        >
          <source src={item.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
    return (
      <Image
        src={item.url}
        alt="Media content"
        fill
        className="object-cover rounded-md"
      />
    );
  };

  const renderMediaGrid = (mediaItems: MediaItem[]) => {
    if (mediaItems.length === 0) return null;
    
    const visibleMedia = mediaItems.slice(0, 4);
    const remainingCount = mediaItems.length - 4;

    return (
      <div className="grid grid-cols-2 gap-2">
        {visibleMedia.map((item, index) => (
          <div key={index} className="relative aspect-square">
            {renderMediaItem(item)}
            {item.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <VideoIcon className="h-6 w-6 text-white/80" />
              </div>
            )}
          </div>
        ))}
        {remainingCount > 0 && (
          <div 
            className="relative aspect-square bg-muted/50 flex items-center justify-center cursor-pointer"
            onClick={() => setOpenMediaModal(true)}
          >
            <span className="text-lg font-medium">+{remainingCount}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Add Media Button */}
      <div className="flex justify-end mb-8">
        <AlertDialog onOpenChange={setOpenDialog} open={openDialog}>
          <AlertDialogTrigger asChild>
            <Button className="gap-2">
              <PlusIcon className="h-4 w-4" />
              Add Media
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:max-w-[600px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">Create New Media</AlertDialogTitle>
            </AlertDialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField 
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description*</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter detailed description" 
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* File Upload Section */}
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Media</FormLabel>
                      <FormControl>
                        <UploadDropzone
                          // endpoint="mediaUpload"
                          onClientUploadComplete={(res: any) => {
                            field.onChange(res[0].url)
                            toast.success("Upload completed!")
                          }}
                          onUploadError={(error: any) => {
                            toast.error("Upload failed")
                            console.error("Upload error:", error)
                          }}
                          showPreview={true}
                        />

                       
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4 pt-4">
                  <Button 
                  variant={'outline'}
                    type="button" 
                    onClick={() => {
                      setOpenDialog(false)
                    }}
                    
                  >
                   Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={form.formState.isSubmitting}
                  >
                    {/* {form.formState.isSubmitting ? "Processing..." : "Submit"} */}
                    {isLoading ? "Processing..." : "Submit"}
                  </Button>
                </div>
              </form>
            </Form>
          </AlertDialogContent>

        </AlertDialog>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {medias.map((item) => (
          <div 
            key={item._id} 
            className="group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            onClick={() => {
              setSelectedMedia(item);
              setOpenMediaModal(true);
            }}
          >
            {/* Media Preview Grid */}
            {renderMediaGrid(item.mediaUrl)}
            
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                {item.mediaUrl.some(m => m.type === 'video') && (
                  <span className="flex items-center gap-1">
                    <VideoIcon className="h-3 w-3" />
                    Video
                  </span>
                )}
                {item.mediaUrl.some(m => m.type === 'image') && (
                  <span className="flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" />
                    Image
                  </span>
                )}
                <span className="ml-auto">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Media Modal */}
      <Dialog open={openMediaModal} onOpenChange={setOpenMediaModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedMedia && (
            <>
              <h3 className="text-xl font-semibold mb-4">{selectedMedia.title}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedMedia.mediaUrl.map((item, index) => (
                  <div key={index} className="relative aspect-video bg-black rounded-md overflow-hidden">
                    {item.type === 'video' ? (
                      <video 
                        className="w-full h-full object-contain"
                        controls
                        autoPlay={index === 0}
                      >
                        <source src={item.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <Image
                        src={item.url}
                        alt={`Media ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {selectedMedia.description}
              </p>

              {(selectedMedia?.status === 0 && selectedMedia?.clerkId !== user?.id && !openNote) && (
                <>
                 <Button variant={'destructive'} onClick={() => setOpenNote(true)}>
                  Decline
                </Button>
                <Button disabled={approving}  onClick={() =>  handleApprove({
                  mediaId: selectedMedia?._id,
                  requestId: selectedMedia?.requestId
                })}>
                  {approving && <Loader2 className='animate-spin' />}
                  Approve
                </Button>
                </>
              )}

              {(selectedMedia?.status === 2 && selectedMedia?.clerkId !== user?.id && !openNote) && (
                <p className="text-red-500 text-sm ">
                  you declined the submission of this files,  please wait for creator to send new ones 
                </p>
              )}

              {openNote && (
                <div className="flex flex-col gap-3 ">
                  <Textarea placeholder='Send note for the creator to make changes...' onChange={(e) =>  setNote(e.target.value)}  />

                  <Button onClick={() => {
                    handleDecline({
                      mediaId: selectedMedia?._id,
                      requestId: selectedMedia?.requestId
                    })
                  }} disabled={declinig} >

                    {declinig && <Loader2 className='animate-spin' />}
                    Decline Media
                  </Button>
                    <Button onClick={() => setOpenNote(false)} variant={'destructive'}>
                    Cancel
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;