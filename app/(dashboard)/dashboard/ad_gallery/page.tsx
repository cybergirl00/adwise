'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { media } from "@/lib/contants"
import { PlusIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { UploadDropzone } from '@/components/upload-dropzone'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog'
import { UploadButton } from '@/utils/uploadthing'
import { createMedia, getMedia } from '@/actions/ad.actions'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
// import { UploadDropzone } from '@/components/upload-dropzone'

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(50, "Title cannot exceed 50 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  fileUrl: z.string().url(),
  ownerId: z.string().optional()
})

type FormValues = z.infer<typeof formSchema>

const Gallery = () => {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [medias, setMedias] = useState<MediaProps[]>([])
  
  // Initialize form with proper types
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      fileUrl: ""
    },
  })

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

  useEffect(() => {

    const handlegetMedia = async () => {
      try {
        const data = await getMedia({
          ownerId: user?.id ?? ""
        });

        setMedias(data?.data.data)


      } catch (error) {
        console.log(error)
      }
    }

    handlegetMedia();
  }, [])
  

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Add Media Button */}
      <div className="flex justify-end mb-8">
        <AlertDialog onOpenChange={setOpenDialog} open={openDialog} >
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
        {medias && medias?.map((item) => (
          <div 
            key={item.id} 
            className="group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative aspect-video bg-muted">
              <Image
                src={item.mediaUrl}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
              <h3 className="text-sm text-muted-foreground line-clamp-1 font-semibold mb-1">{item.description}</h3>
              {/* <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary mb-3">
                {item.category}
              </span> */}

              {/* {item.ownerId  !== user?.id && (
                <Link 
                  href={`/creators/${item.creatorImage}`} 
                  className="flex items-center gap-2 mt-2 hover:underline"
                >
                  <Image 
                    src={item.creatorImage || ''} 
                    alt={item.creatorName || ''} 
                    width={24} 
                    height={24} 
                    className="rounded-full" 
                  />
                  <span className="text-sm text-muted-foreground">{item.creatorName}</span>
                </Link>
              )} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Gallery