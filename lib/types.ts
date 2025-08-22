export type UserRole = 'developer' | 'business' | 'creator';

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


// interface TransactionProps {
//   desc: string;
//   amount: string;
//   status: number;
//   createdAt: string,
//   type: number,
//   id: string
// }
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
export interface User {
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
    specialties: string[];
    balance: number,
    rate?: number;
    profile?: number;
    requests: RequestItem[],
     partners: Partner[],
     apps?: MyAppProps[],
     userData: UserData
}

export interface Creator {
  id: string;
  name: string;
  bio: string;
  rate: number;
  rating: number;
  avatar: string;
  specialties: string[];
  portfolio: string[];
  reviews: Review[];
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  author: string;
  date: string;
}

export interface App {
  _id: string;
  title: string;
  apiKey: string;
  earnings: number;
  click: number;
  createdAt: string;
  audienceId: string;
  categoryId: string;
   audience: {
    _id: string;
    name: string;
  };
  category: {
    _id: string;
    name: string;
  };
  clerkId: string;
  impression: number
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: ChatMessage;
  unreadCount: number;
}