'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { MOCK_CREATORS } from '@/lib/contants';
import { Star, MapPin, MessageCircle, Award, ArrowLeft, CalendarIcon, Loader2, Plus, X } from 'lucide-react';
import { getCreatorbyId } from '@/actions/users.actions';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns";
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDownIcon } from "lucide-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { sendRequest } from '@/actions/campaign.actions';
import { useUser } from '@clerk/nextjs';

const formSchema = z.object({
  title: z.string().min(2).max(50),
  category: z.string(),
  numberOfMedia: z.number(),
  description: z.string().min(10),
    projectDateTime: z.date({
    required_error: "Please select a date and time",
  }),
  budget: z.number(),
  requirements: z.array(z.string()).min(1, "At least one requirement is needed")
})

export default function CreatorDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const creatorId = params.id as string;
  
  const { user } = useUser();
  const [creator, setCreator] = useState<CreatorProps>();
  const [reviews, setReviews] = useState<ReviewsProps[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false)
 const [newRequirement, setNewRequirement] = useState('');
  const [status, setStatus] = useState(0)
  

  useEffect(() => {
    const getCreator = async () => {
      try {
        const creator = await getCreatorbyId(creatorId)

        if(creator?.status === 200) {
          setCreator(creator.data.data.creator);
          setReviews(creator.data.data.reviews)
        }
      } catch (error) {
        console.log(error)
      }
    }

    getCreator();
  }, [])


    const addRequirement = () => {
    if (newRequirement.trim()) {
      const currentRequirements = form.getValues('requirements') || [];
      form.setValue('requirements', [...currentRequirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    const currentRequirements = form.getValues('requirements') || [];
    form.setValue('requirements', currentRequirements.filter((_, i) => i !== index));
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      numberOfMedia: 0,
      description: "",
      budget: 0

    },
  })
 
  // 2. Define a submit handler.
  const  onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const response = await sendRequest({
        creatorId: creator?.clerkId ?? "",
         ownerId: user?.id ?? "", 
         title: values.title, 
         description: values.description, 
         category: values.category, 
         numberofFiles: values.numberOfMedia,
          deadline: values.projectDateTime,
           budget: values.budget,
           requirements: values.requirements
      });

      if(response?.status === 200) {
        toast.success("Request sent!")
        setOpenDialog(false);

        setIsLoading(false)

        setStatus(4)
      } else {
        toast.error(`${response?.data.message}`)
        setIsLoading(false)
      }
    } catch (error) {
      toast.error(`Error occured `);
      setIsLoading(false)
    }finally {
      setIsLoading(false)
    }
  }
  

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
    router.push('/dashboard/chat?creator=' + creator._id);
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
                <AvatarImage src={creator.imageUrl} />
                <AvatarFallback className="text-2xl">
                  {creator.firstName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold">{creator.firstName} {creator.lastName}</h1>
                <p className="text-lg text-muted-foreground mt-2">{creator.bio}</p>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="font-semibold">4.9</span>
                  <span className="text-muted-foreground">(1 reviews)</span>
                </div>
                
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Lagos, Nigeria</span>
                </div>
                
                <div className="flex items-center gap-1 text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
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
                  onClick={() => {
                    setOpenDialog(true)
                  }}
                  className="w-full"
                  size="lg"
                  
                >
                  
                 <MessageCircle className="h-4 w-4 mr-2" />
                 {status === 0 ? ' Hire Creator' : status === 1 ? "Message Creator" : status === 2 ? "Hire Creator" : status === 3 ? "Bergain" : "No Response"}
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
              {reviews.map((review) => (
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
                  
                  {review !== reviews[reviews.length - 1] && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>


       <Dialog onOpenChange={setOpenDialog} open={openDialog}>
  <DialogContent className="max-h-[90vh] overflow-y-auto">
    <DialogHeader className="">
      <DialogTitle>Send Project Request</DialogTitle>
      <DialogDescription>
        Fill out the details of your project
      </DialogDescription>
    </DialogHeader>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4">
          {/* Project Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Title</FormLabel>
                <FormControl>
                  <Input placeholder="Project title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Project Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {creator?.specialties.map((item) => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Project Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your project in detail..." 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Requirements */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm">Requirements</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2">
              <div className="flex flex-wrap gap-2">
                {form.watch('requirements')?.map((requirement, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {requirement}
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add a requirement"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                />
                <Button 
                  type="button"
                  onClick={addRequirement}
                  variant="outline"
                  size="icon"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Number of Media and Budget in one row */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="numberOfMedia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media Files</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget (₦)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Budget" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Date & Time Picker */}
          <FormField
            control={form.control}
            name="projectDateTime"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Project Deadline</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className="justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPPp") // "Month day, year, time"
                        ) : (
                          <span>Pick a date and time</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                    <div className="p-3 border-t">
                      <Input
                        type="time"
                        onChange={(e) => {
                          if (field.value) {
                            const [hours, minutes] = e.target.value.split(':');
                            const newDate = new Date(field.value);
                            newDate.setHours(parseInt(hours, 10));
                            newDate.setMinutes(parseInt(minutes, 10));
                            field.onChange(newDate);
                          }
                        }}
                        value={field.value ? format(field.value, 'HH:mm') : ''}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isLoading ? 'Submitting...' : 'Submit Request'}
        </Button>
      </form>
    </Form>
  </DialogContent>
</Dialog>
    </div>
  );
}