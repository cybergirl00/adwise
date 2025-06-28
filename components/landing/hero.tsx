'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArrowRight, Code, Building2, Users, TrendingUp, Shield, Zap } from 'lucide-react';

interface HeroProps {
  onRoleSelect: (role: 'developer' | 'business' | 'creator') => void;
}

export default function Hero({ onRoleSelect }: HeroProps) {
  const features = [
    { icon: TrendingUp, text: 'Higher Revenue' },
    { icon: Shield, text: 'Secure Payments' },
    { icon: Zap, text: 'Quick Setup' }
  ];

  const roleCards = [
    {
      role: 'developer' as const,
      icon: Code,
      title: "I'm a Developer",
      description: 'Monetize your apps with intelligent ad placements',
      features: ['Easy API Integration', 'Real-time Analytics', 'Multiple Ad Formats'],
      gradient: 'from-blue-600 to-blue-800',
      hoverGradient: 'hover:from-blue-700 hover:to-blue-900'
    },
    {
      role: 'business' as const,
      icon: Building2,
      title: "I'm a Business Owner",
      description: 'Connect with top creators to amplify your brand',
      features: ['Creator Marketplace', 'AI Video Creation', 'Performance Tracking'],
      gradient: 'from-green-600 to-green-800',
      hoverGradient: 'hover:from-green-700 hover:to-green-900'
    },
    {
      role: 'creator' as const,
      icon: Users,
      title: "I'm a Content Creator",
      description: 'Get hired by businesses to create amazing content',
      features: ['Direct Client Connection', 'Secure Payments', 'Portfolio Showcase'],
      gradient: 'from-purple-600 to-purple-800',
      hoverGradient: 'hover:from-purple-700 hover:to-purple-900'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="px-6 py-4 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-foreground">Adwise</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost">About</Button>
            <Button variant="ghost">Contact</Button>
            <ThemeToggle />
            <Button variant="outline" onClick={() => onRoleSelect('developer')}>
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800">
            Nigeria's #1 Ad Network Platform
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Connect. Create.
            <span className="block bg-gradient-to-r bg-primary  bg-clip-text text-transparent">
              Get Paid.
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            The all-in-one platform connecting Nigerian developers, businesses, and content creators 
            through intelligent advertising solutions and direct collaborations.
          </p>

          <div className="flex items-center justify-center space-x-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 text-muted-foreground">
                <feature.icon className="w-5 h-5 text-green-600" />
                <span className="font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection Cards */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-4">
            Choose Your Path
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Select your role to access features tailored specifically for your needs
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {roleCards.map((card) => (
              <Card 
                key={card.role}
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                onClick={() => onRoleSelect(card.role)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} ${card.hoverGradient} transition-all duration-300`} />
                <div className="relative p-8 text-white">
                  <div className="flex items-center justify-between mb-6">
                    <card.icon className="w-10 h-10" />
                    <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3">{card.title}</h3>
                  <p className="text-white/90 mb-6 leading-relaxed">{card.description}</p>
                  
                  <ul className="space-y-2">
                    {card.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-white/80">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full mt-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30"
                    size="lg"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16 bg-muted/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-foreground mb-2">500+</div>
              <div className="text-muted-foreground">Active Developers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-2">₦50M+</div>
              <div className="text-muted-foreground">Total Earnings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-2">200+</div>
              <div className="text-muted-foreground">Businesses Connected</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-2">150+</div>
              <div className="text-muted-foreground">Content Creators</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}