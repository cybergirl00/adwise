'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/context/auth-context';
import { UserRole } from '@/lib/types';
import { Loader2, Code, Building2, Users, ArrowLeft } from 'lucide-react';

interface AuthFormProps {
  initialRole?: UserRole;
  mode?: 'signin' | 'signup';
}

export default function AuthForm({ initialRole, mode = 'signin' }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<UserRole>(initialRole || 'developer');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState(mode);
  const { login, signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (currentMode === 'signup') {
        if (password !== confirmPassword) {
          alert('Passwords do not match');
          return;
        }
        await signup(email, password, firstName, lastName, role);
      } else {
        await login(email, password);
      }
    } catch (error) {
      console.error('Authentication failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const roleIcons = {
    developer: Code,
    business: Building2,
    creator: Users
  };

  const roleDescriptions = {
    developer: 'Build and monetize your applications',
    business: 'Connect with creators and manage campaigns',
    creator: 'Showcase your work and get hired'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-xl border-0 bg-card">
          <CardHeader className="space-y-2 text-center pb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-xl font-bold text-foreground">Adwise</span>
              </div>
              <ThemeToggle />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {currentMode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
            </CardTitle>
            <p className="text-muted-foreground">
              {currentMode === 'signup' 
                ? 'Join thousands of creators, developers, and businesses' 
                : 'Sign in to access your dashboard'
              }
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {currentMode === 'signup' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="h-11"
                />
              </div>

              {currentMode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="h-11"
                  />
                </div>
              )}
              
              {currentMode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="role">I am a</Label>
                  <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleIcons).map(([roleKey, Icon]) => (
                        <SelectItem key={roleKey} value={roleKey}>
                          <div className="flex items-center space-x-3">
                            <Icon className="w-4 h-4" />
                            <div>
                              <div className="font-medium capitalize">{roleKey}</div>
                              <div className="text-xs text-muted-foreground">
                                {roleDescriptions[roleKey as UserRole]}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r bg-primary hover:bg-primary/50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {currentMode === 'signup' ? 'Creating Account...' : 'Signing in...'}
                  </>
                ) : (
                  currentMode === 'signup' ? 'Create Account' : 'Sign In'
                )}
              </Button>
            </form>
            
            <div className="text-center text-sm text-muted-foreground">
              {currentMode === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <button 
                    onClick={() => setCurrentMode('signin')}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button 
                    onClick={() => setCurrentMode('signup')}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>

            {currentMode === 'signup' && (
              <div className="text-xs text-muted-foreground text-center leading-relaxed">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-primary hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}