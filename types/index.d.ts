interface CreateMediaProps {
    title: string, 
    description: string,
     mediaUrl: string,
    clerkId: string, 
    ownerId?: string
}


interface MediaProps {
    _id: string,
    title: string,
    ownerId: string,
    mediaUrl: string,
    description: string
}

interface TransactionProps {
    id: string;
    amount: number;
    desc: string;
    type: number;
    status: number;
    createdAt: string
}

interface UserState {
  userdata: User | null
  setUser: (user: UserState['user']) => void
  clearUser: () => void
}

interface UserRequest {
  _id: string;
  title: string;
  description: string;
  category: string;
  deadline: string;
  budget: number;
  requirements: string[];
  status: number; // 0 = pending, 1 = accepted, etc.
  createdAt: string;
  creatorId: string;
  ownerId: string;
}

interface Client {
  firstName: string;
  lastName: string;
  imageUrl: string;
}

interface RequestItem {
  userRequests: UserRequest[];
  clients: Record<string, Client & { budget?: number }>;
}

interface PartnerProps {
  firstName: string;
  lastName: string;
  _id: string;
  imageUrl: string;
  clerkId: string
}
interface MessageProps {
  content: string;
  _id: string;
  isFromMe: boolean;
  type: number;
  createdAt: Date
}

interface Partner {
  user: PartnerProps,
  latestMessage: MessageProps;
  messages: MessageProps[]
}

interface MyAppProps {
  _id: string;
  apiKey: string;
  audience: {
    _id: string;
    name: string;
  };
  category: {
    _id: string;
    name: string;
  };
  audienceId: string;
  categoryId: string;
  clerkId: string;
  earnings: number;
  click: number;
  title: string;
  impression: number;
}


interface UserData {
  totalCampaigns: number,
  totalSpent: number,
  creatorsHired: number,
  campaignsReached: number,
  activeProjects: number,
  totalEarnings: number,
  messages: number,
  profile: number,
  activeApps: number,
  totalClicks: number,
  monthlyRevenue: number,
  transactions: TransactionProps[]
}


interface User {
  id: string;
  email: string;
  role: UserRole;
  avatar?: string;
  firstName: string,
  lastName: string;
  userType: number;
    clerkId: string;
    bio?: string;
    portfolio?: string[];
    specialties: [];
    balance: number,
    rate?: number;
    profile?: number;
    requests: RequestItem[];
    partners: Partner[];
    apps: MyAppProps[],
    userData: UserData
    
}


interface CreatorProps { 
  _id: string;
  firstName: string;
  lastName: string;
  specialties: string[];
  imageUrl: string;
  bio: string;
  rate: number;
  portfolio: string[];
  clerkId: string;
  reviews: [
    {
        id: string;
    rating: number;
    comment: string;
    author: string;
    date: string
    }
  

]

}


interface ReviewsProps {
   id: string;
    rating: number;
    comment: string;
    author: string;
    date: string
}



interface Campaign {
  _id: string;
  title: string;
  description?: string;
  mediaUrls: string[];
  destinationUrl?: string;
  audience?: string;
  mediaTitle?: string;
  width?: number;
  height?: number;
}

interface DisplayAd extends Omit<Campaign, 'mediaUrls'> {
  currentMediaUrl: string;
  mediaIndex: number;
  totalMedia: number;
  displayWidth: number;
  displayHeight: number;
}

declare module "adwisesdk" {
  export const AdwiseClientProvider: any;
  export const adwise: any;
  export const AdModal: any;
  export const AdBanner: any;
}


// frontend/types/adwisesdk.d.ts
declare module "adwisesdk" {
  import { ReactNode } from "react";

  export const adwise: {
    initiatePop: () => void;
  };

  export function AdwiseClientProvider(props: { apiKey?: string; children: ReactNode }): JSX.Element;
}


// Cliffland@center123