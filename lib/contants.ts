import { Creator, App, Conversation, ChatMessage, User } from './types';

export const MOCK_CREATORS: Creator[] = [
  {
    id: '1',
    name: 'Adebayo Williams',
    bio: 'Expert video creator with 5+ years experience in brand storytelling',
    rate: 25000,
    rating: 4.9,
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    specialties: ['Video Production', 'Animation', 'Brand Stories'],
    portfolio: [
      'https://images.pexels.com/photos/7234292/pexels-photo-7234292.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/3585089/pexels-photo-3585089.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/7234293/pexels-photo-7234293.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    ],
    reviews: [
      {
        id: '1',
        rating: 5,
        comment: 'Excellent work on our product launch video. Highly recommended!',
        author: 'TechCorp Nigeria',
        date: '2024-01-15'
      }
    ]
  },
  {
    id: '2',
    name: 'Kemi Oladele',
    bio: 'Creative graphic designer specializing in social media campaigns',
    rate: 18000,
    rating: 4.8,
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    specialties: ['Graphic Design', 'Social Media', 'Branding'],
    portfolio: [
      'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/590016/pexels-photo-590016.jpg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    ],
    reviews: [
      {
        id: '2',
        rating: 5,
        comment: 'Amazing designs that really captured our brand essence!',
        author: 'Lagos Fashion Week',
        date: '2024-01-20'
      }
    ]
  },
  {
    id: '3',
    name: 'Chinedu Okoro',
    bio: 'Content creator and influencer with 100K+ followers across platforms',
    rate: 22000,
    rating: 4.7,
    avatar: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    specialties: ['Content Creation', 'Influencer Marketing', 'Photography'],
    portfolio: [
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/1181672/pexels-photo-1181672.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    ],
    reviews: [
      {
        id: '3',
        rating: 4,
        comment: 'Great engagement rates and professional content delivery.',
        author: 'Nollywood Productions',
        date: '2024-01-18'
      }
    ]
  }
];

export const MOCK_APPS: App[] = [
  {
    id: '1',
    name: 'Recipe App',
    category: 'Food & Drink',
    apiKey: 'ak_live_abc123def456ghi789',
    earnings: 45000,
    clicks: 12500,
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    name: 'Fitness Tracker',
    category: 'Health & Fitness',
    apiKey: 'ak_live_xyz789uvw456rst123',
    earnings: 38000,
    clicks: 8900,
    createdAt: '2024-01-05'
  }
];

export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'adebayo@example.com',
    name: 'Adebayo Williams',
    role: 'creator',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '2',
    email: 'business@techcorp.ng',
    name: 'Sarah Johnson',
    role: 'business',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  }
];

export const roleColors = {
  developer: 'bg-blue-500',
  business: 'bg-green-500',
  creator: 'bg-purple-500'
};

export const roleGradients = {
  developer: 'from-blue-600 to-blue-800',
  business: 'from-green-600 to-green-800',
  creator: 'from-purple-600 to-purple-800'
};