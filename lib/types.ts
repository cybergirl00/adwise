export type UserRole = 'developer' | 'business' | 'creator';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
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
  id: string;
  name: string;
  category: string;
  apiKey: string;
  earnings: number;
  clicks: number;
  createdAt: string;
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