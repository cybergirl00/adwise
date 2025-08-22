'use client';

import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import millify from "millify";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Activity,
  Code,
  Upload,
  MessageCircle,
  Eye
} from 'lucide-react';
import { useDashboard } from '@/context/dashboard-context';


export default function DashboardOverview() {
  const { user } = useDashboard();


  const getDashboardContent = () => {
    switch (user?.role) {
      case 'developer':
        return {
          title: 'Developer Dashboard',
          subtitle: 'Monitor your app performance and earnings',
          stats: [
            { name: 'Total Earnings', value: millify(user?.userData.totalEarnings), icon: DollarSign, change: '+12%' },
            { name: 'Active Apps', value: user?.userData.activeApps, icon: Code, change: '+1' },
            { name: 'Total Clicks', value: user?.userData.totalClicks, icon: Eye, change: '+8%' },
            { name: 'Monthly Revenue', value: millify(user?.userData.monthlyRevenue), icon: TrendingUp, change: '+15%' }
          ],
          actions: [
            { title: 'Add New App', description: 'Start monetizing a new application', href: '/dashboard/apps' },
            { title: 'View Analytics', description: 'Check detailed performance metrics', href: '/dashboard/analytics' },
          ]
        };

      case 'business':
        return {
          title: 'Business Dashboard',
          subtitle: 'Manage your campaigns and connect with creators',
          stats: [
            { name: 'Active Campaigns', value: '5', icon: Activity, change: '+2' },
            { name: 'Total Spend', value: millify(user.userData.totalSpent), icon: DollarSign, change: '+25%' },
            { name: 'Creators Hired', value: user?.userData.creatorsHired, icon: Users, change: '+4' },
            { name: 'Campaign Reach', value: `${user?.userData.campaignsReached}`, icon: TrendingUp, change: '+18%' }
          ],
          actions: [
            { title: 'Upload New Ad', description: 'Create a new advertising campaign', href: '/dashboard/upload-ads' },
            { title: 'Browse Creators', description: 'Find talented content creators', href: '/dashboard/creators' },
          ]
        };

      case 'creator':
        return {
          title: 'Creator Dashboard',
          subtitle: 'Track your projects and connect with businesses',
          stats: [
            { name: 'Total Earnings', value: millify(user?.userData.totalEarnings), icon: DollarSign, change: '+20%' },
            { name: 'Active Projects', value: user?.userData.activeProjects, icon: Activity, change: '+1' },
            { name: 'Client Reviews', value: '4.8/5', icon: Users, change: '+0.2' },
            { name: 'Messages', value: user?.userData.messages, icon: MessageCircle, change: '+3' }
          ],
          actions: 
          user?.userData.profile === 1 ? 
          ([
            { title: 'Update Profile', description: 'Showcase your latest work and skills', href: '/dashboard/profile' },
            { title: 'View Requests', description: 'Check new collaboration opportunities', href: '/dashboard/requests' },
          ]) : (
            [
                { title: 'Complete your  Profile', description: 'Showcase your latest work and skills', href: '/dashboard/profile' },
            ]
          )
        };

      default:
        return null;
    }
  };

  const content = getDashboardContent();
  if (!content) return null;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{content.title}</h1>
        <p className="text-muted-foreground mt-2">{content.subtitle}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {content.stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <Badge variant="outline" className="text-green-600 dark:text-green-400">
                  {stat.change}
                </Badge>
                <span className="text-sm text-muted-foreground ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {content.actions.map((action, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <p className="text-muted-foreground">{action.description}</p>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <a href={action.href}>Get Started</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
             

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            { user?.userData?.transactions?.length > 0 ? user?.userData.transactions.map((tx) => (
               <div className="flex items-center space-x-4 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                  <div className={`w-2 h-2 ${tx.type === 1 ? ' bg-green-500 ' : 'bg-red-500'} rounded-full`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{tx.desc}</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
            )): (
              <div className="">
                <p className="text-sm text-center text-muted-foreground">You do not have any transactions</p>
              </div>
            )}  
          </div>
        </CardContent>
      </Card>
    </div>
  );
}