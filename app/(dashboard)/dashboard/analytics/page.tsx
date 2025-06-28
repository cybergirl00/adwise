'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Eye, Clock as Click, DollarSign, Users } from 'lucide-react';

export default function AnalyticsPage() {
  const stats = [
    {
      title: 'Total Revenue',
      value: '₦125,000',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Ad Impressions',
      value: '2.4M',
      change: '+8.2%',
      trend: 'up',
      icon: Eye,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Click-through Rate',
      value: '3.2%',
      change: '-0.5%',
      trend: 'down',
      icon: Click,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Active Users',
      value: '45,230',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'text-orange-600 dark:text-orange-400'
    }
  ];

  const topApps = [
    { name: 'Recipe App', revenue: 45000, impressions: '1.2M', ctr: '4.1%' },
    { name: 'Fitness Tracker', revenue: 38000, impressions: '950K', ctr: '3.8%' },
    { name: 'News Reader', revenue: 25000, impressions: '650K', ctr: '2.9%' },
    { name: 'Music Player', revenue: 17000, impressions: '420K', ctr: '2.2%' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-2">Track your app performance and revenue</p>
        </div>
        <Select defaultValue="30days">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="1year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-muted">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <Badge
                  variant={stat.trend === 'up' ? 'default' : 'destructive'}
                  className={
                    stat.trend === 'up'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400'
                  }
                >
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {stat.change}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Revenue Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/30 dark:to-green-900/30 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <p className="text-muted-foreground">Revenue chart visualization</p>
                <p className="text-sm text-muted-foreground">Showing steady growth over time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Apps */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Apps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topApps.map((app, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{app.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>{app.impressions} impressions</span>
                      <span>{app.ctr} CTR</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      ₦{app.revenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">This month</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Direct</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Social Media</span>
                <span className="font-medium">30%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Search</span>
                <span className="font-medium">25%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold">68%</div>
                <div className="text-sm text-muted-foreground">Mobile</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">25%</div>
                <div className="text-sm text-muted-foreground">Desktop</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">7%</div>
                <div className="text-sm text-muted-foreground">Tablet</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geographic Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Lagos</span>
                <span className="font-medium">35%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Abuja</span>
                <span className="font-medium">20%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Port Harcourt</span>
                <span className="font-medium">15%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Kano</span>
                <span className="font-medium">12%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Others</span>
                <span className="font-medium">18%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}